// ============================================================
// QuizVerse AI — Multiplayer Game Room
// ============================================================
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Crown, Wifi, Copy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

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
  const chatRef = useRef();
  const timerRef = useRef();

  // Join room on mount
  useEffect(() => {
    emit('room:join', { userId: user.id, roomCode: code }, (res) => {
      if (res.success) {
        setPlayers(res.data.players || []);
        setIsHost(res.data.room?.hostId === user.id);
      } else {
        toast.error(res.message || 'Failed to join room');
        navigate('/multiplayer');
      }
    });

    // Socket listeners
    const unsubs = [
      on('room:playerJoined', ({ players }) => setPlayers(players)),
      on('room:playerLeft', ({ players }) => setPlayers(players)),
      on('room:playerReady', ({ players }) => setPlayers(players)),
      on('game:countdown', ({ countdown: c }) => {
        setGameState('countdown');
        setCountdown(c);
        let t = c;
        const iv = setInterval(() => { t--; setCountdown(t); if (t <= 0) clearInterval(iv); }, 1000);
      }),
      on('game:started', ({ question: q, totalQuestions: total, timeLimit }) => {
        setGameState('active');
        setQuestion(q);
        setTotalQuestions(total);
        setTimeLeft(timeLimit);
        startTimer(timeLimit);
      }),
      on('game:question', ({ question: q, questionIndex, timeLimit }) => {
        setQuestion(q); setQuestionIdx(questionIndex); setAnswer(null); setAnswerResult(null);
        setTimeLeft(timeLimit); startTimer(timeLimit);
        setLoadingNext(false);
      }),
      on('game:answerResult', (result) => setAnswerResult(result)),
      on('leaderboard:update', ({ leaderboard: lb }) => setLeaderboard(lb)),
      on('chat:message', (msg) => { setChat(c => [...c, msg]); setTimeout(() => chatRef.current?.scrollTo(0, chatRef.current.scrollHeight), 50); }),
      on('game:over', ({ leaderboard: lb }) => {
        setGameState('finished');
        setLeaderboard(lb);
        clearInterval(timerRef.current);
      }),
    ];

    return () => unsubs.forEach(fn => typeof fn === 'function' && fn());
  }, [code, user.id]);

  const startTimer = (seconds) => {
    clearInterval(timerRef.current);
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
  };

  const myPlayer = players.find(p => p.userId === user.id);
  const isReady = myPlayer?.ready || false;

  const handleReady = () => {
    if (isReady) return;
    emit('room:ready', { userId: user.id, roomCode: code });
  };

  const handleStartGame = () => {
    if (startingGame) return;
    if (players.length < 2) return toast.error('Need at least 2 players!');
    setStartingGame(true);
    emit('game:start', { userId: user.id, roomCode: code, difficulty: 'medium' }, (res) => {
      setStartingGame(false);
      if (!res?.success) toast.error(res?.message || 'Failed to start');
    });
  };

  const handleAnswer = (key) => {
    if (answer) return;
    setAnswer(key);
    emit('game:answer', { userId: user.id, roomCode: code, answer: key, timeLeft });
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
          <div style={{ display: 'flex', gap: '0.25rem' }}>{players.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />)}</div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{players.length} players</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

          {/* Waiting Lobby */}
          {gameState === 'waiting' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: 48, marginBottom: '0.5rem' }}>🏠</div>
                <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>Waiting Lobby</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Waiting for players... Share the room code to invite friends!</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {players.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white' }}>
                      {(p.name || 'U')[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name} {p.userId === user.id && <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)' }}>(You)</span>}</div>
                    </div>
                    {p.userId === players[0]?.userId && <Crown size={18} style={{ color: '#fbbf24' }} />}
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.ready ? '#10b981' : '#64748b' }} />
                  </div>
                ))}
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

              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.5 }}>{question.text}</h2>

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
                    return (
                      <motion.button key={key} whileHover={!answer ? { scale: 1.02 } : {}} whileTap={!answer ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(key)}
                        disabled={!!answer}
                        className={`quiz-option ${isSelected && !answerResult ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                        style={{ border: 'none', font: 'inherit', cursor: answer ? 'default' : 'pointer', width: '100%', textAlign: 'left' }}>
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
            {(leaderboard.length > 0 ? leaderboard : players).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ width: 20, fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{i + 1}</span>
                <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>{p.name || 'Player'}</div>
                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.875rem' }}>{p.score || 0}</span>
              </div>
            ))}
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>CHAT</h3>
            </div>
            <div ref={chatRef} style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chat.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.userId === user.id ? 'flex-end' : 'flex-start' }}>
                  {msg.userId !== user.id && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{msg.userName}</span>}
                  <div className={`chat-bubble ${msg.userId === user.id ? 'own' : 'other'}`}>{msg.message}</div>
                </div>
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
