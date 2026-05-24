// ============================================================
// QuizVerse AI — Multiplayer Socket.IO Handler
// ============================================================
const { MultiplayerRoom, RoomPlayer, Quiz, Question, User, QuizAttempt } = require('../models');
const { generateRoomCode } = require('../utils/helpers');

// In-memory game state store
const gameStates = new Map(); // roomCode -> gameState

const initializeMultiplayerSocket = (io) => {
  const multiplayerNS = io.of('/multiplayer');

  multiplayerNS.on('connection', (socket) => {
    console.log(`🎮 Multiplayer socket connected: ${socket.id}`);

    // ── Create Room ─────────────────────────────────────────
    socket.on('room:create', async (data, callback) => {
      try {
        const { userId, category, difficulty, topic, maxPlayers = 5 } = data;

        const user = await User.findByPk(userId);
        if (!user) return callback({ success: false, message: 'User not found' });

        const roomCode = generateRoomCode(6);

        const room = await MultiplayerRoom.create({
          roomCode, hostId: userId, status: 'waiting',
          maxPlayers: Math.min(Math.max(2, maxPlayers), 5),
          currentPlayers: 1, category, difficulty, topic,
        });

        await RoomPlayer.create({ roomId: room.id, userId, isReady: false, isConnected: true });

        // Initialize in-memory state
        gameStates.set(roomCode, {
          roomId: room.id, roomCode, hostId: userId,
          players: [{ userId, socketId: socket.id, name: user.fullname, avatar: user.profileImage, score: 0, ready: false, lobbyColor: '#00e5ff', lobbyTitle: 'Quiz Starter' }],
          questions: [], currentQuestion: 0, status: 'waiting',
          answers: {}, chatMessages: [],
        });

        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;

        callback({ success: true, data: { roomCode, roomId: room.id } });
        console.log(`🏠 Room created: ${roomCode} by ${user.fullname}`);
      } catch (err) {
        console.error('room:create error:', err);
        callback({ success: false, message: `Failed to create room: ${err.message}` });
      }
    });

    // ── Join Room ────────────────────────────────────────────
    socket.on('room:join', async (data, callback) => {
      try {
        const { userId, roomCode } = data;

        const room = await MultiplayerRoom.findOne({
          where: { roomCode },
          include: [{ association: 'players', include: [{ association: 'user', attributes: ['fullname', 'profileImage'] }] }],
        });

        if (!room) return callback({ success: false, message: 'Room not found' });
        if (room.status !== 'waiting') return callback({ success: false, message: 'Game already started' });

        const user = await User.findByPk(userId);
        if (!user) return callback({ success: false, message: 'User not found' });

        // Check if already in room and get active count
        const existingPlayer = await RoomPlayer.findOne({ where: { roomId: room.id, userId } });
        const playerEntriesCount = await RoomPlayer.count({ where: { roomId: room.id } });

        if (!existingPlayer && playerEntriesCount >= room.maxPlayers) {
          return callback({ success: false, message: 'Room is full' });
        }

        if (!existingPlayer) {
          await RoomPlayer.create({ roomId: room.id, userId, isReady: false, isConnected: true });
          await room.update({ currentPlayers: playerEntriesCount + 1 });
        } else {
          await existingPlayer.update({ isConnected: true });
        }

        // Update game state (Reconstruct from DB if server restarted/hot-reloaded)
        let state = gameStates.get(roomCode);
        if (!state) {
          const dbPlayers = room.players || [];
          const playersList = dbPlayers.map(p => ({
            userId: p.userId,
            socketId: p.userId === userId ? socket.id : null,
            name: p.user?.fullname || 'Player',
            avatar: p.user?.profileImage,
            score: p.score || 0,
            ready: p.isReady || false,
            connected: p.isConnected || false,
          }));

          state = {
            roomId: room.id,
            roomCode,
            hostId: room.hostId,
            players: playersList,
            questions: [],
            currentQuestion: 0,
            status: room.status,
            answers: {},
            chatMessages: [],
          };
          gameStates.set(roomCode, state);
        }

        const existsInState = state.players.find(p => p.userId === userId);
        if (!existsInState) {
          state.players.push({ userId, socketId: socket.id, name: user.fullname, avatar: user.profileImage, score: 0, ready: false, lobbyColor: '#00e5ff', lobbyTitle: 'Quiz Starter' });
        } else {
          existsInState.socketId = socket.id;
          existsInState.connected = true;
        }

        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;

        // Notify all in room
        multiplayerNS.to(roomCode).emit('room:playerJoined', {
          player: { userId, name: user.fullname, avatar: user.profileImage, score: 0, lobbyColor: '#00e5ff', lobbyTitle: 'Quiz Starter' },
          players: state?.players || [],
        });

        callback({ success: true, data: { room, players: state?.players || [], votes: state?.votes || {} } });
      } catch (err) {
        console.error('room:join error:', err);
        callback({ success: false, message: `Failed to join room: ${err.message}` });
      }
    });

    // ── Player Ready ─────────────────────────────────────────
    socket.on('room:ready', async (data) => {
      const { userId, roomCode } = data;
      const state = gameStates.get(roomCode);
      if (!state) return;

      const player = state.players.find(p => p.userId === userId);
      if (player) player.ready = true;

      const room = await MultiplayerRoom.findOne({ where: { roomCode } });
      if (room) {
        await RoomPlayer.update({ isReady: true }, { where: { roomId: room.id, userId } });
      }

      multiplayerNS.to(roomCode).emit('room:playerReady', { userId, players: state.players });
    });

    // ── Start Game (Host only) ────────────────────────────────
    socket.on('game:start', async (data, callback) => {
      try {
        const { userId, roomCode, categoryId, difficulty, topic } = data;
        const state = gameStates.get(roomCode);
        if (!state) return callback?.({ success: false, message: 'Room not found' });
        if (state.hostId !== userId) return callback?.({ success: false, message: 'Only host can start' });
        if (state.players.length < 2) return callback?.({ success: false, message: 'Need at least 2 players' });

        // Generate questions in memory (or use existing quizId)
        let questions;
        if (state.quizId) {
          questions = await Question.findAll({ where: { quizId: state.quizId }, order: [['orderIndex', 'ASC']] });
        } else {
          const { generateQuizQuestions } = require('../services/geminiService');
          const { Category } = require('../models');
          const cat = await Category.findByPk(categoryId);
          const rawQs = await generateQuizQuestions(cat?.name || 'General', difficulty || 'medium', topic, 10);
          questions = rawQs;
        }

        state.questions = questions;
        state.currentQuestion = 0;
        state.answers = {};
        state.status = 'starting';

        // Update DB
        const room = await MultiplayerRoom.findOne({ where: { roomCode } });
        if (room) await room.update({ status: 'starting', startedAt: new Date() });

        // Countdown then start
        multiplayerNS.to(roomCode).emit('game:countdown', { countdown: 5 });

        setTimeout(async () => {
          state.status = 'active';
          if (room) await room.update({ status: 'active' });

          multiplayerNS.to(roomCode).emit('game:started', {
            question: sanitizeQuestion(questions[0]),
            questionIndex: 0,
            totalQuestions: questions.length,
            timeLimit: 30,
          });
        }, 5000);

        callback?.({ success: true });
      } catch (err) {
        console.error('game:start error:', err);
        callback?.({ success: false, message: err.message });
      }
    });

    // ── Submit Answer ─────────────────────────────────────────
    socket.on('game:answer', async (data) => {
      const { userId, roomCode, answer, timeLeft, powerUp } = data;
      const state = gameStates.get(roomCode);
      if (!state || state.status !== 'active') return;

      const currentQ = state.questions[state.currentQuestion];
      if (!currentQ) return;

      // Record answer (only first submission counts)
      if (!state.answers[userId]?.[state.currentQuestion]) {
        const isCorrect = answer === (currentQ.correctAnswer || currentQ.correct_answer);
        const speedBonus = Math.floor(timeLeft * 2);
        
        let points = isCorrect ? (10 + speedBonus) : 0;

        // Apply Power-Ups
        if (powerUp === 'double' && isCorrect) {
          points = points * 2;
        } else if (powerUp === 'shield' && !isCorrect) {
          points = 5; // Safety points for shield protection
        }

        if (!state.answers[userId]) state.answers[userId] = {};
        state.answers[userId][state.currentQuestion] = { answer, isCorrect, points, powerUp };

        // Update player score
        const player = state.players.find(p => p.userId === userId);
        if (player && points > 0) player.score += points;

        // Emit live leaderboard
        const leaderboard = [...state.players].sort((a, b) => b.score - a.score);
        multiplayerNS.to(roomCode).emit('leaderboard:update', { leaderboard });
        socket.emit('game:answerResult', { isCorrect, points, correctAnswer: currentQ.correctAnswer || currentQ.correct_answer });
      }
    });

    // ── Next Question (Host) ──────────────────────────────────
    socket.on('game:next', (data) => {
      const { roomCode, userId } = data;
      const state = gameStates.get(roomCode);
      if (!state || state.hostId !== userId) return;

      state.currentQuestion++;
      if (state.currentQuestion >= state.questions.length) {
        // Game over
        endGame(multiplayerNS, roomCode, state);
      } else {
        multiplayerNS.to(roomCode).emit('game:question', {
          question: sanitizeQuestion(state.questions[state.currentQuestion]),
          questionIndex: state.currentQuestion,
          totalQuestions: state.questions.length,
          timeLimit: 30,
        });
      }
    });

    // ── Chat Message ──────────────────────────────────────────
    socket.on('chat:message', (data) => {
      const { roomCode, userId, message, userName } = data;
      const state = gameStates.get(roomCode);
      if (!state) return;

      const chatMsg = { userId, userName, message, timestamp: new Date() };
      state.chatMessages.push(chatMsg);
      multiplayerNS.to(roomCode).emit('chat:message', chatMsg);
    });

    // ── Update Presence (Color & Title) ─────────────────────
    socket.on('room:updatePresence', (data) => {
      const { roomCode, userId, lobbyColor, lobbyTitle } = data;
      const state = gameStates.get(roomCode);
      if (!state) return;

      const player = state.players.find(p => p.userId === userId);
      if (player) {
        player.lobbyColor = lobbyColor;
        player.lobbyTitle = lobbyTitle;
      }

      multiplayerNS.to(roomCode).emit('room:playerUpdated', { userId, lobbyColor, lobbyTitle, players: state.players });
    });

    // ── Room Category/Difficulty Vote ────────────────────────
    socket.on('room:vote', (data) => {
      const { roomCode, userId, categoryId, categoryName, difficulty } = data;
      const state = gameStates.get(roomCode);
      if (!state || state.status !== 'waiting') return;

      if (!state.votes) state.votes = {};
      state.votes[userId] = { categoryId, categoryName, difficulty };

      const totalVotesCount = Object.keys(state.votes).length;
      const categoryCounts = {};
      const difficultyCounts = {};

      Object.values(state.votes).forEach(v => {
        if (v.categoryName) {
          categoryCounts[v.categoryName] = (categoryCounts[v.categoryName] || 0) + 1;
        }
        if (v.difficulty) {
          difficultyCounts[v.difficulty] = (difficultyCounts[v.difficulty] || 0) + 1;
        }
      });

      multiplayerNS.to(roomCode).emit('room:votesUpdated', {
        votes: state.votes,
        categoryCounts,
        difficultyCounts,
        totalVotes: totalVotesCount
      });
    });

    // ── Emoji Reaction ───────────────────────────────────────
    socket.on('room:reaction', (data) => {
      const { roomCode, userId, userName, emoji } = data;
      multiplayerNS.to(roomCode).emit('room:reaction', { userId, userName, emoji });
    });

    // ── Disconnect ────────────────────────────────────────────
    socket.on('disconnect', async () => {
      const { roomCode, userId } = socket.data;
      if (!roomCode || !userId) return;

      const state = gameStates.get(roomCode);
      if (state) {
        const player = state.players.find(p => p.userId === userId);
        if (player) player.connected = false;
        multiplayerNS.to(roomCode).emit('room:playerLeft', { userId, players: state.players });
      }

      const room = await MultiplayerRoom.findOne({ where: { roomCode } });
      if (room) {
        await RoomPlayer.update({ isConnected: false }, { where: { roomId: room.id, userId } });
      }

      console.log(`🚪 User ${userId} left room ${roomCode}`);
    });
  });
};

// ── Helper: Sanitize question (hide correct answer) ───────────
const sanitizeQuestion = (q) => {
  const obj = q.toJSON ? q.toJSON() : { ...q };
  delete obj.correctAnswer;
  delete obj.correct_answer;
  delete obj.explanation;
  return obj;
};

// ── End Game ──────────────────────────────────────────────────
const endGame = async (ns, roomCode, state) => {
  state.status = 'finished';

  // Sort final leaderboard
  const finalLeaderboard = [...state.players]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  ns.to(roomCode).emit('game:over', { leaderboard: finalLeaderboard });

  // Update DB
  const room = await MultiplayerRoom.findOne({ where: { roomCode } });
  if (room) {
    await room.update({ status: 'finished', finishedAt: new Date() });
    for (const player of finalLeaderboard) {
      await RoomPlayer.update(
        { score: player.score, rank: player.rank },
        { where: { roomId: room.id, userId: player.userId } }
      );
    }
  }

  // Clean up state after 5 minutes
  setTimeout(() => gameStates.delete(roomCode), 5 * 60 * 1000);
};

module.exports = { initializeMultiplayerSocket };
