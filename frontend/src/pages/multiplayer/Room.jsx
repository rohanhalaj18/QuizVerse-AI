// ============================================================
// QuizVerse AI — Multiplayer Game Room
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Crown, Wifi, Copy, Volume2, VolumeX, Smile } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { audioEngine } from '../../utils/audioEngine';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const LOBBY_COLORS = ['#00e5ff', '#ff007f', '#bd00ff', '#ffd700', '#00e676', '#ff9100'];
const LOBBY_TITLES = ['🎓 Quiz Starter', '🤖 AI Overlord', '🛡️ Bug Hunter', '💻 Code Wizard', '🗄️ Query Master', '🏆 Absolute Legend'];
const QUICK_TAUNTS = [
  'Too slow! 🐢',
  'Acing this! 🧠',
  'Wait for me! 🏃‍♂️',
  'GG! 🤝',
  'Absolute genius! 👑',
  'OMG that was close! 🤯'
];

export default function Room() {
  const { code } = useParams();
  const { user } = useAuth();
  const { emit, on, off } = useSocket();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('waiting'); // waiting | countdown | active | finished
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [leaderboard, setLeaderboard] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [countdown, setCountdown] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [startingGame, setStartingGame] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  
  // Interactive Customization & Voting states
  const [soundMuted, setSoundMuted] = useState(false);
  const [lobbyColor, setLobbyColor] = useState('#00e5ff');
  const [lobbyTitle, setLobbyTitle] = useState('🎓 Quiz Starter');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [votes, setVotes] = useState({});
  const [voteCategory, setVoteCategory] = useState('');
  const [voteDifficulty, setVoteDifficulty] = useState('');
  const [votesStats, setVotesStats] = useState({ categoryCounts: {}, difficultyCounts: {}, totalVotes: 0 });

  // Power-Ups states
  const [powerUpsAvailable, setPowerUpsAvailable] = useState({ double: true, shield: true, half: true, freeze: true });
  const [activePowerUp, setActivePowerUp] = useState(null); 
  const [hiddenOptions, setHiddenOptions] = useState([]); 
  const [isFrozen, setIsFrozen] = useState(false);

  const chatRef = useRef();
  const timerRef = useRef();
  const isFrozenRef = useRef(false);

  // Join room on mount
  useEffect(() => {
    emit('room:join', { userId: user.id, roomCode: code }, (res) => {
      if (res.success) {
        setPlayers(res.data.players || []);
        setIsHost(res.data.room?.hostId === user.id);
        
        // Sync votes if they exist
        if (res.data.votes) {
          setVotes(res.data.votes);
          const categoryCounts = {};
          const difficultyCounts = {};
          Object.values(res.data.votes).forEach(v => {
            if (v.categoryName) categoryCounts[v.categoryName] = (categoryCounts[v.categoryName] || 0) + 1;
            if (v.difficulty) difficultyCounts[v.difficulty] = (difficultyCounts[v.difficulty] || 0) + 1;
          });
          setVotesStats({ categoryCounts, difficultyCounts, totalVotes: Object.keys(res.data.votes).length });
        }
      } else {
        toast.error(res.message || 'Failed to join room');
        navigate('/multiplayer');
      }
    });

    // Socket listeners
    const unsubs = [
      on('room:playerJoined', ({ players }) => setPlayers(players)),
      on('room:playerLeft', ({ players }) => setPlayers(players)),
      on('room:playerReady', ({ players }) => {
        setPlayers(players);
        audioEngine.playReady(); // Play chime when anyone gets ready!
      }),
      on('room:playerUpdated', ({ players }) => setPlayers(players)),
      
      on('room:votesUpdated', ({ votes, categoryCounts, difficultyCounts, totalVotes }) => {
        setVotes(votes);
        setVotesStats({ categoryCounts, difficultyCounts, totalVotes });
      }),
      
      on('room:reaction', ({ userId, userName, emoji }) => {
        const newEmoji = {
          id: Date.now() + Math.random(),
          emoji,
          userName: userName.split(' ')[0],
          x: Math.random() * 80 + 10,
        };
        setFloatingEmojis(prev => [...prev, newEmoji]);
        setTimeout(() => {
          setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
        }, 3000);
      }),
      
      on('game:countdown', ({ countdown: c }) => {
        setGameState('countdown');
        setCountdown(c);
        audioEngine.playReady(); // Grand startup chime
        let t = c;
        const iv = setInterval(() => {
          t--;
          setCountdown(t);
          if (t > 0) {
            audioEngine.playTick(t === 1); // final tick is higher pitch
          } else {
            clearInterval(iv);
          }
        }, 1000);
      }),
      
      on('game:started', ({ question: q, totalQuestions: total, timeLimit }) => {
        setGameState('active');
        setQuestion(q);
        setTotalQuestions(total);
        setTimeLeft(timeLimit);
        startTimer(timeLimit);
        
        // Reset powerup charges and states for a new game
        setPowerUpsAvailable({ double: true, shield: true, half: true, freeze: true });
        setActivePowerUp(null);
        setHiddenOptions([]);
        setIsFrozen(false);
        isFrozenRef.current = false;
      }),
      
      on('game:question', ({ question: q, questionIndex, timeLimit }) => {
        setQuestion(q); setQuestionIdx(questionIndex); setAnswer(null); setAnswerResult(null);
        setTimeLeft(timeLimit); startTimer(timeLimit);
        setLoadingNext(false);
        
        // Reset active question power-up states
        setActivePowerUp(null);
        setHiddenOptions([]);
        setIsFrozen(false);
        isFrozenRef.current = false;
      }),
      
      on('game:answerResult', (result) => {
        setAnswerResult(result);
        if (result.isCorrect) {
          audioEngine.playCorrect();
        } else {
          audioEngine.playWrong();
        }
      }),
      
      on('leaderboard:update', ({ leaderboard: lb }) => setLeaderboard(lb)),
      on('chat:message', (msg) => { setChat(c => [...c, msg]); setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 50); }),
      on('game:over', ({ leaderboard: lb }) => {
        setGameState('finished');
        setLeaderboard(lb);
        clearInterval(timerRef.current);
        audioEngine.playVictory(); // Play epic victory chime!
      }),
    ];

    return () => unsubs.forEach(fn => typeof fn === 'function' && fn());
  }, [code, user.id]);

  const startTimer = (seconds) => {
    clearInterval(timerRef.current);
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (isFrozenRef.current) return t; // Skip decrement if timer is frozen
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        if (t <= 6) {
          audioEngine.playTick(t === 2); // tick-tock as time runs out
        }
        return t - 1;
      });
    }, 1000);
  };

  const myPlayer = players.find(p => p.userId === user.id);
  const isReady = myPlayer?.ready || false;

  const handleReady = () => {
    if (isReady) return;
    audioEngine.playReady();
    emit('room:ready', { userId: user.id, roomCode: code });
  };

  // Lobby choices
  const getLobbyWinningChoices = () => {
    let winningCategory = 'Programming';
    let winningCategoryId = 1;
    let winningDifficulty = 'medium';

    const catCounts = votesStats.categoryCounts;
    const diffCounts = votesStats.difficultyCounts;

    let maxCat = 0;
    Object.entries(catCounts).forEach(([cat, val]) => {
      if (val > maxCat) {
        maxCat = val;
        winningCategory = cat;
      }
    });

    let maxDiff = 0;
    Object.entries(diffCounts).forEach(([diff, val]) => {
      if (val > maxDiff) {
        maxDiff = val;
        winningDifficulty = diff;
      }
    });

    const cat = [
      { id: 1, name: 'Programming' }, { id: 2, name: 'DBMS' },
      { id: 3, name: 'AI/ML' }, { id: 4, name: 'Web Dev' },
      { id: 5, name: 'Networking' }, { id: 9, name: 'Aptitude' }
    ].find(c => c.name === winningCategory);
    if (cat) winningCategoryId = cat.id;

    return { winningCategory, winningCategoryId, winningDifficulty };
  };

  const handleStartGame = () => {
    if (startingGame) return;
    if (players.length < 2) return toast.error('Need at least 2 players!');
    setStartingGame(true);
    
    // Choose winning category/difficulty from live votes if any votes exist
    const { winningCategoryId, winningDifficulty } = getLobbyWinningChoices();
    
    emit('game:start', {
      userId: user.id,
      roomCode: code,
      categoryId: winningCategoryId,
      difficulty: winningDifficulty,
      topic: 'General'
    }, (res) => {
      setStartingGame(false);
      if (!res?.success) toast.error(res?.message || 'Failed to start');
    });
  };

  const parseOptions = (options) => {
    let parsed = options;
    while (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        break;
      }
    }
    return Array.isArray(parsed) ? parsed : Object.values(parsed || {});
  };

  const handleUsePowerUp = (type) => {
    if (!powerUpsAvailable[type] || answer || gameState !== 'active') return;

    // Use charge
    setPowerUpsAvailable(prev => ({ ...prev, [type]: false }));
    audioEngine.playClick();

    if (type === 'double' || type === 'shield') {
      setActivePowerUp(type);
      toast.success(`Active: ${type === 'double' ? '🚀 Double Score' : '🛡️ Point Shield'} for this question!`);
    } else if (type === 'half') {
      // 50/50: request server for 2 incorrect options to hide securely
      if (!question) return;
      emit('game:use5050', { roomCode: code, userId: user.id }, (res) => {
        if (res && res.success) {
          setHiddenOptions(res.hiddenOptions || []);
          toast.success('✂️ 50/50 Activated! Two wrong options removed.');
        } else {
          toast.error(res?.message || 'Failed to activate 50/50');
          // Refund charge
          setPowerUpsAvailable(prev => ({ ...prev, half: true }));
        }
      });
    } else if (type === 'freeze') {
      setIsFrozen(true);
      isFrozenRef.current = true;
      setTimeLeft(t => t + 10);
      
      // Play cool synthesized beep alert
      audioEngine.playTick(true);
      setTimeout(() => {
        audioEngine.playTick(false);
      }, 180);

      toast.success('❄️ Freeze Activated! +10 seconds added.');
      
      setTimeout(() => {
        setIsFrozen(false);
        isFrozenRef.current = false;
      }, 10000);
    }
  };

  const handleAnswer = (key) => {
    if (answer) return;
    setAnswer(key);
    audioEngine.playClick();
    emit('game:answer', {
      userId: user.id,
      roomCode: code,
      answer: key,
      timeLeft,
      powerUp: activePowerUp
    });
  };

  const handleUpdatePresence = (color, title) => {
    audioEngine.playClick();
    setLobbyColor(color);
    setLobbyTitle(title);
    emit('room:updatePresence', { roomCode: code, userId: user.id, lobbyColor: color, lobbyTitle: title });
  };

  const handleVote = (categoryName, difficulty) => {
    audioEngine.playClick();
    setVoteCategory(categoryName);
    setVoteDifficulty(difficulty);
    
    const cat = [
      { id: 1, name: 'Programming' }, { id: 2, name: 'DBMS' },
      { id: 3, name: 'AI/ML' }, { id: 4, name: 'Web Dev' },
      { id: 5, name: 'Networking' }, { id: 9, name: 'Aptitude' }
    ].find(c => c.name === categoryName);

    emit('room:vote', {
      roomCode: code,
      userId: user.id,
      categoryId: cat?.id || 1,
      categoryName,
      difficulty
    });
  };

  const handleSendReaction = (emoji) => {
    audioEngine.playClick();
    emit('room:reaction', { roomCode: code, userId: user.id, userName: user.fullname, emoji });
  };

  const handleNextQuestion = () => {
    if (loadingNext) return;
    setLoadingNext(true);
    emit('game:next', { userId: user.id, roomCode: code });
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    emit('chat:message', { userId: user.id, roomCode: code, message: chatInput, userName: user.fullname });
    setChatInput('');
  };

  const copyCode = () => { navigator.clipboard.writeText(code); toast.success('Room code copied!'); };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes tauntShake {
          0% { transform: rotate(-2deg) scale(1); }
          100% { transform: rotate(2deg) scale(1.03); }
        }
        .taunt-bubble {
          animation: tauntShake 0.4s ease-in-out infinite alternate !important;
        }
        .animate-hover-grow:hover {
          transform: scale(1.3) rotate(5deg) !important;
        }
      `}</style>

      {/* Floating Reactions Overlay */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, overflow: 'hidden' }}>
        <AnimatePresence>
          {floatingEmojis.map(fe => (
            <motion.div
              key={fe.id}
              initial={{ y: '100vh', opacity: 0.9, scale: 0.5, x: `${fe.x}vw` }}
              animate={{ y: '-10vh', opacity: 0, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                fontSize: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              <span>{fe.emoji}</span>
              <span style={{ fontSize: '0.65rem', background: 'var(--bg-glass)', color: 'white', padding: '0.15rem 0.4rem', borderRadius: 8, border: '1px solid var(--border)', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
                {fe.userName}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>⚡ QuizVerse Multiplayer</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.3rem', color: 'var(--primary-light)' }}>{code}</span>
            <button onClick={copyCode} className="btn btn-ghost btn-sm" style={{ padding: '0.25rem' }}><Copy size={14} /></button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Sound Mute Button */}
          <button
            onClick={() => {
              const nextMuted = !soundMuted;
              setSoundMuted(nextMuted);
              audioEngine.setMuted(nextMuted);
              audioEngine.playClick();
            }}
            className="btn btn-ghost btn-sm"
            style={{ padding: '0.4rem', color: soundMuted ? 'var(--text-muted)' : 'var(--primary-light)' }}
            title={soundMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {soundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div style={{ display: 'flex', gap: '0.25rem' }}>{players.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />)}</div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{players.length} players</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

          {/* Emoji Reactions Toolbar (Always available in waiting, countdown or finished states) */}
          {(gameState === 'waiting' || gameState === 'active' || gameState === 'finished') && (
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', padding: '0.4rem 0.8rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 20, width: 'fit-content', margin: '0 auto 1.5rem auto', boxShadow: 'var(--shadow-sm)' }}>
              {['🔥', '🧠', '⚡', '🎉', '🤫', '🤯', '👑', '🤬'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleSendReaction(emoji)}
                  style={{
                    fontSize: '1.35rem', padding: '0.3rem 0.5rem', border: 'none', background: 'none', cursor: 'pointer', transition: 'transform 0.15s',
                  }}
                  className="animate-hover-grow"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Waiting Lobby */}
          {gameState === 'waiting' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: 48, marginBottom: '0.5rem' }}>🏠</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Waiting Lobby</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Waiting for players... Share the room code to invite friends!</p>
              </div>

              {/* Lobby Winning Suggestions Display */}
              {votesStats.totalVotes > 0 && (
                <div style={{ padding: '0.875rem 1.25rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Lobby Winning Choice</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-light)', marginTop: '0.1rem' }}>
                      📚 {getLobbyWinningChoices().winningCategory} ({getLobbyWinningChoices().winningDifficulty.toUpperCase()})
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: 8, fontWeight: 700 }}>
                    {votesStats.totalVotes} Votes Cast
                  </span>
                </div>
              )}

              {/* Lobby Players List with Custom Presences */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {players.map((p, i) => {
                  const borderCol = p.lobbyColor || '#00e5ff';
                  const title = p.lobbyTitle || '🎓 Quiz Starter';
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        color: 'white',
                        border: `3px solid ${borderCol}`,
                        boxShadow: `0 0 10px ${borderCol}60`,
                        background: 'var(--gradient-primary)'
                      }}>
                        {(p.name || 'U')[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {p.name}
                          {p.userId === user.id && <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', background: 'rgba(99,102,241,0.1)', padding: '0.1rem 0.4rem', borderRadius: 6 }}>(You)</span>}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.1rem' }}>
                          {title}
                        </div>
                      </div>
                      {p.userId === players[0]?.userId && <Crown size={18} style={{ color: '#fbbf24' }} />}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', color: p.ready ? '#10b981' : 'var(--text-muted)', fontWeight: 700 }}>
                          {p.ready ? 'READY' : 'WAITING'}
                        </span>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.ready ? '#10b981' : '#64748b', boxShadow: p.ready ? '0 0 6px #10b981' : 'none' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lobby Interaction Controls Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="lobby-interaction-grid">
                <style>{`@media(max-width:768px){.lobby-interaction-grid{grid-template-columns:1fr!important;}}`}</style>
                
                {/* 🎨 Personalization Selector */}
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>🎨 Customize Avatar presence</h3>
                  
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Avatar Aura Color</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {LOBBY_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => handleUpdatePresence(c, lobbyTitle)}
                          style={{
                            width: 28, height: 28, borderRadius: '50%', background: c, border: lobbyColor === c ? '3px solid white' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s',
                            transform: lobbyColor === c ? 'scale(1.15)' : 'none',
                            boxShadow: lobbyColor === c ? `0 0 12px ${c}` : 'none'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Choose Title</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                      {LOBBY_TITLES.map(t => (
                        <button
                          key={t}
                          onClick={() => handleUpdatePresence(lobbyColor, t)}
                          style={{
                            padding: '0.4rem 0.5rem', fontSize: '0.72rem', borderRadius: 8, border: lobbyTitle === t ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s',
                            background: lobbyTitle === t ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                            color: lobbyTitle === t ? 'var(--primary-light)' : 'var(--text-secondary)',
                            fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🗳️ Live Voting Panel */}
                <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>🗳️ Live Configuration Voting</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Suggest room rules. The host will start based on majority choice.</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Category</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {['Programming', 'DBMS', 'AI/ML', 'Web Dev', 'Networking', 'Aptitude'].map(catName => {
                        const votesForCat = Object.values(votes).filter(v => v.categoryName === catName).length;
                        const isSelected = voteCategory === catName;
                        return (
                          <button
                            key={catName}
                            onClick={() => handleVote(catName, voteDifficulty || 'medium')}
                            style={{
                              padding: '0.35rem 0.6rem', fontSize: '0.72rem', borderRadius: 8, cursor: 'pointer', border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)', transition: 'all 0.15s',
                              background: isSelected ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                              color: isSelected ? 'var(--primary-light)' : 'var(--text-primary)',
                              display: 'flex', gap: '0.4rem', alignItems: 'center', fontWeight: 700
                            }}
                          >
                            <span>{catName}</span>
                            {votesForCat > 0 && <span style={{ background: 'var(--primary)', color: 'white', padding: '0.05rem 0.3rem', borderRadius: 6, fontSize: '0.6rem' }}>{votesForCat}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Select Difficulty</div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {['easy', 'medium', 'hard'].map(d => {
                        const votesForDiff = Object.values(votes).filter(v => v.difficulty === d).length;
                        const isSelected = voteDifficulty === d;
                        return (
                          <button
                            key={d}
                            onClick={() => handleVote(voteCategory || 'Programming', d)}
                            style={{
                              flex: 1, padding: '0.4rem', fontSize: '0.72rem', borderRadius: 8, cursor: 'pointer', border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)', transition: 'all 0.15s',
                              background: isSelected ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                              color: isSelected ? 'var(--primary-light)' : 'var(--text-secondary)',
                              display: 'flex', gap: '0.3rem', justifyContent: 'center', alignItems: 'center', fontWeight: 700
                            }}
                          >
                            <span>{d.toUpperCase()}</span>
                            {votesForDiff > 0 && <span style={{ background: 'var(--border)', color: 'var(--text-primary)', padding: '0.05rem 0.3rem', borderRadius: 6, fontSize: '0.6rem' }}>{votesForDiff}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={handleReady} disabled={isReady} className="btn btn-secondary" style={{ gap: '0.5rem' }}>
                  {isReady ? '✓ Ready!' : '✅ Ready'}
                </button>
                {isHost && (
                  <button onClick={handleStartGame} disabled={startingGame || players.length < 2} className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    {startingGame ? <><Spinner size="sm" color="white" /> Starting...</> : <><Wifi size={16} /> Start Game ({players.length}/5)</>}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Countdown */}
          {gameState === 'countdown' && (
            <motion.div style={{ textAlign: 'center', paddingTop: '6rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1.1rem' }}>Game starts in</p>
              <motion.div key={countdown} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ fontSize: '8rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
                {countdown}
              </motion.div>
            </motion.div>
          )}

          {/* Active Game */}
          {gameState === 'active' && question && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Q {questionIdx + 1} of {totalQuestions}</span>
                <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.5rem', color: timeLeft <= 10 ? '#f87171' : 'var(--primary-light)' }}>
                  ⏱ {timeLeft}s
                </div>
              </div>

              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, marginBottom: '1.5rem', overflow: 'hidden' }}>
                <motion.div style={{ height: '100%', background: 'var(--gradient-primary)', borderRadius: 2 }}
                  animate={{ width: `${(questionIdx / totalQuestions) * 100}%` }} />
              </div>

              {/* Futuristic Power-Ups Hotbar */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', padding: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                {[
                  { type: 'double', label: 'Double', desc: 'x2 points for correct answer', color: '#ff007f' },
                  { type: 'shield', label: 'Shield', desc: 'Earn +5pts if incorrect', color: '#3b82f6' },
                  { type: 'half', label: '50/50', desc: 'Remove 2 wrong options', color: '#eab308' },
                  { type: 'freeze', label: 'Freeze', desc: 'Add +10s & pause clock', color: '#06b6d4' }
                ].map(pu => {
                  const isAvailable = powerUpsAvailable[pu.type];
                  const isActive = activePowerUp === pu.type || (pu.type === 'half' && hiddenOptions.length > 0) || (pu.type === 'freeze' && isFrozen);
                  
                  return (
                    <motion.button
                      key={pu.type}
                      type="button"
                      whileHover={isAvailable && !answer ? { scale: 1.05 } : {}}
                      whileTap={isAvailable && !answer ? { scale: 0.95 } : {}}
                      onClick={() => handleUsePowerUp(pu.type)}
                      disabled={!isAvailable || !!answer}
                      style={{
                        flex: 1, padding: '0.5rem 0.25rem', borderRadius: 12, border: '1.5px solid', cursor: isAvailable && !answer ? 'pointer' : 'default', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                        borderColor: isActive ? pu.color : (isAvailable && !answer ? 'var(--border)' : 'rgba(255,255,255,0.05)'),
                        background: isActive ? `${pu.color}25` : (isAvailable && !answer ? 'var(--bg-glass)' : 'rgba(0,0,0,0.2)'),
                        opacity: isAvailable && !answer ? 1 : 0.4,
                        boxShadow: isActive ? `0 0 10px ${pu.color}50` : 'none',
                      }}
                      title={pu.desc}
                    >
                      <span style={{ fontSize: '1.15rem' }}>
                        {pu.type === 'double' ? '🚀' : pu.type === 'shield' ? '🛡️' : pu.type === 'half' ? '✂️' : '❄️'}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: isActive ? pu.color : 'var(--text-primary)' }}>
                        {pu.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {isFrozen && <span style={{ color: '#06b6d4', marginRight: '0.5rem' }}>❄️ FROZEN:</span>}
                {question.text}
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1.5rem' }}>
                {(() => {
                  let parsedOptions = question.options;
                  
                  // Safeguard: Unwrap double-stringified JSON if it occurs
                  while (typeof parsedOptions === 'string') {
                    try {
                      parsedOptions = JSON.parse(parsedOptions);
                    } catch (e) {
                      break; // Leave as-is if it's a plain string
                    }
                  }
                  
                  const optionsToRender = Array.isArray(parsedOptions) ? parsedOptions : Object.values(parsedOptions || {});
                  
                  return optionsToRender.map((opt, i) => {
                    const key = String.fromCharCode(65 + i);
                    const isSelected = answer === key;
                    const isCorrect = answerResult && key === answerResult.correctAnswer;
                    const isWrong = answerResult && isSelected && !answerResult.isCorrect;
                    const isHidden = hiddenOptions.includes(key);
                    
                    return (
                      <motion.button key={key} whileHover={!answer && !isHidden ? { scale: 1.02 } : {}} whileTap={!answer && !isHidden ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(key)}
                        disabled={!!answer || isHidden}
                        className={`quiz-option ${isSelected && !answerResult ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                        style={{
                          border: 'none',
                          font: 'inherit',
                          cursor: answer || isHidden ? 'default' : 'pointer',
                          width: '100%',
                          textAlign: 'left',
                          opacity: isHidden ? 0.15 : 1,
                          pointerEvents: isHidden ? 'none' : 'auto'
                        }}>
                        <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--bg-glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{key}</span>
                        <span style={{ fontSize: '0.9rem' }}>{typeof opt === 'string' ? opt : JSON.stringify(opt)}</span>
                      </motion.button>
                    );
                  });
                })()}
              </div>

              {answerResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '1rem', borderRadius: 12, background: answerResult.isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${answerResult.isCorrect ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`, marginBottom: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem' }}>{answerResult.isCorrect ? '✅' : '❌'}</div>
                  <div style={{ fontWeight: 700, color: answerResult.isCorrect ? '#34d399' : '#f87171' }}>
                    {answerResult.isCorrect ? `Correct! +${answerResult.points} pts` : 'Wrong answer!'}
                  </div>
                </motion.div>
              )}

              {isHost && answerResult && (
                <button onClick={handleNextQuestion} disabled={loadingNext} className="btn btn-primary" style={{ width: '100%', gap: '0.5rem' }}>
                  {loadingNext ? <><Spinner size="sm" color="white" /> Loading...</> : (questionIdx + 1 >= totalQuestions ? '🏁 Finish Game' : 'Next Question →')}
                </button>
              )}
            </motion.div>
          )}

          {/* Game Over */}
          {gameState === 'finished' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: '1rem' }}>🏆</div>
              <h2 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '1.5rem' }}>Game Over!</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 400, margin: '0 auto 2rem' }}>
                {leaderboard.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`leaderboard-row ${i < 3 ? `rank-${i + 1}` : ''}`}>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>{['🥇','🥈','🥉'][i] || i + 1}</span>
                    <div style={{ flex: 1 }}>{p.name} {p.userId === user.id && <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>(You)</span>}</div>
                    <span style={{ fontWeight: 800, color: 'var(--primary-light)' }}>{p.score} pts</span>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => navigate('/multiplayer')} className="btn btn-primary btn-lg">Play Again</button>
            </motion.div>
          )}
        </div>

        {/* Live Leaderboard & Chat */}
        <div style={{ width: 280, background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="room-sidebar">
          <style>{`@media(max-width:900px){.room-sidebar{display:none!important;}}`}</style>

          {/* Live Scores */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>LIVE SCORES</h3>
            {(leaderboard.length > 0 ? leaderboard : players).map((p, i) => {
              const borderCol = p.lobbyColor || '#00e5ff';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 20, fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</span>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '0.65rem',
                    border: `1.5px solid ${borderCol}`,
                    boxShadow: `0 0 4px ${borderCol}60`,
                    background: 'var(--gradient-primary)',
                    marginRight: '0.2rem'
                  }}>
                    {(p.name || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {p.name || 'Player'}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.875rem' }}>{p.score || 0}</span>
                </div>
              );
            })}
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>CHAT</h3>
            </div>
            
            <div ref={chatRef} style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chat.map((msg, i) => {
                const isTaunt = msg.message?.startsWith('/taunt:');
                const tauntText = isTaunt ? msg.message.slice(7) : msg.message;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.userId === user.id ? 'flex-end' : 'flex-start' }}>
                    {msg.userId !== user.id && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{msg.userName}</span>}
                    <div
                      className={`chat-bubble ${msg.userId === user.id ? 'own' : 'other'} ${isTaunt ? 'taunt-bubble' : ''}`}
                      style={isTaunt ? {
                        background: 'linear-gradient(135deg, #ff007f, #7928ca)',
                        color: 'white',
                        fontWeight: 800,
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 4px 10px rgba(255, 0, 127, 0.3)',
                        animation: 'tauntShake 0.5s ease-in-out infinite alternate',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        borderRadius: 12
                      } : {}}
                    >
                      {tauntText}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Taunts Grid */}
            <div style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.3rem', background: 'var(--bg-glass)' }}>
              {QUICK_TAUNTS.map(taunt => (
                <button
                  key={taunt}
                  type="button"
                  onClick={() => {
                    audioEngine.playClick();
                    emit('chat:message', { roomCode: code, userId: user.id, message: `/taunt:${taunt}`, userName: user.fullname });
                  }}
                  style={{
                    padding: '0.25rem 0.35rem', fontSize: '0.7rem', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s',
                    background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
                  }}
                  className="animate-hover-grow"
                >
                  {taunt}
                </button>
              ))}
            </div>

            <form onSubmit={sendChat} style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input className="form-input" placeholder="Message..." value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.4rem 0.75rem' }}><Send size={14} /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
