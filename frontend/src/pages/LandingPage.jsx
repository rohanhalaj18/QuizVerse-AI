// ============================================================
// QuizVerse AI — Premium Gen-Z Playful Landing Page
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, Moon, Zap, Brain, Users, Trophy, ChevronRight, Star, 
  ArrowRight, Shield, BookOpen, Clock, Heart, Award, Sparkles, Plus, Play, CheckCircle,
  Volume2, VolumeX, Send, MessageSquare, Loader2, PlayCircle, XCircle
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } }
};

const floatAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const categories = [
  { name: 'Engineering', icon: '⚙️', desc: 'JEE, GATE, Core Engg', color: '#7C4DFF', gradient: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(101, 31, 255, 0.05))', tag: 'IIT Aspirants' },
  { name: 'Medical', icon: '🩺', desc: 'NEET, Anatomy, Clinical', color: '#FF4081', gradient: 'linear-gradient(135deg, rgba(255, 64, 129, 0.15), rgba(255, 23, 68, 0.05))', tag: 'AIIMS Preps' },
  { name: 'Programming', icon: '💻', desc: 'JS, Python, DSA, OOPs', color: '#00E676', gradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(0, 176, 255, 0.05))', tag: 'Tech Gurus' },
  { name: 'AI & ML', icon: '🤖', desc: 'Deep Learning, LLMs', color: '#00B0FF', gradient: 'linear-gradient(135deg, rgba(0, 176, 255, 0.15), rgba(41, 121, 255, 0.05))', tag: 'Future Tech' },
  { name: 'Cyber Security', icon: '🔐', desc: 'Hacking, Networks, crypt', color: '#FF9100', gradient: 'linear-gradient(135deg, rgba(255, 145, 0, 0.15), rgba(255, 61, 0, 0.05))', tag: 'Defenders' },
  { name: 'Aptitude', icon: '🧮', desc: 'Logical, Math, Quant', color: '#FFD600', gradient: 'linear-gradient(135deg, rgba(255, 214, 0, 0.15), rgba(255, 23, 0, 0.05))', tag: 'Brainiacs' },
  { name: 'UPSC & Civil', icon: '🏛️', desc: 'History, Polity, GK', color: '#2979FF', gradient: 'linear-gradient(135deg, rgba(41, 121, 255, 0.15), rgba(124, 77, 255, 0.05))', tag: 'Officers' },
  { name: 'NEET Special', icon: '🧬', desc: 'Biology, Genetics, Physio', color: '#00E676', gradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(255, 64, 129, 0.05))', tag: 'Top Ranks' },
  { name: 'JEE Special', icon: '📐', desc: 'Physics, Calculus, Chem', color: '#7C4DFF', gradient: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(0, 176, 255, 0.05))', tag: 'Main & Adv' },
  { name: 'Cloud Computing', icon: '☁️', desc: 'AWS, Azure, DevOps', color: '#9C27B0', gradient: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(124, 77, 255, 0.05))', tag: 'Architects' },
];

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  // ── States ──────────────────────────────────────────────────
  const [soundOn, setSoundOn] = useState(true);
  const [stars, setStars] = useState([]);

  // Generate twinkling star coordinates on mount
  useEffect(() => {
    const generatedStars = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 4
    }));
    setStars(generatedStars);
  }, []);

  // Synchronize audio Engine mute state
  useEffect(() => {
    audioEngine.setMuted(!soundOn);
  }, [soundOn]);

  const triggerClick = () => {
    if (soundOn) audioEngine.playClick();
  };

  // ── Phase 2 States ──────────────────────────────────────────
  const [heroPromptText, setHeroPromptText] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [streakCount, setStreakCount] = useState(7);
  const [streakClaimed, setStreakClaimed] = useState(false);
  const [showStreakConfetti, setShowStreakConfetti] = useState(false);

  const globalTickerAlerts = [
    "🟢 sneha just unlocked the 'Clinical Anatomy' Master Badge (+300 XP)",
    "🔥 ashish reached a 14-day study streak on GATE coding!",
    "⚔️ rohan halaj created a Live Battle Lobby for Rel relational algebra!",
    "⚡ rohan_sharma climbed to Rank #1 on the Global Weekly Arena!",
    "🎓 sinchana solved 15 DBMS questions with 100% accuracy!",
    "🧠 deepak_ai generated a Hard Mode quiz on Quantum Superconductors!"
  ];

  // Rotate global activity ticker alert
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % globalTickerAlerts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!heroPromptText.trim()) return;
    triggerClick();
    
    // Set custom topic
    setAiTopic(heroPromptText);
    
    // Scroll to the generator card
    const target = document.getElementById("ai-generator");
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Auto launch AI generation simulated sequence!
    setTimeout(() => {
      startAiGeneration();
    }, 800);
  };

  const handleClaimStreak = () => {
    if (streakClaimed) return;
    audioEngine.playVictory();
    setStreakClaimed(true);
    setStreakCount(8);
    setShowStreakConfetti(true);
  };

  // ── 1. Interactive Demo Quiz State ──────────────────────────
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [quizState, setQuizState] = useState(null); // 'correct' | 'wrong' | null
  const [quizHint, setQuizHint] = useState("");
  const [xpEarned, setXpEarned] = useState(0);
  const [particles, setParticles] = useState([]);

  const handleQuizClick = (opt) => {
    if (quizState === 'correct') return;
    triggerClick();
    setSelectedOpt(opt.key);
    if (opt.select) {
      setQuizState('correct');
      audioEngine.playCorrect();
      setXpEarned(150);
      setQuizHint("Correct! Merge Sort guarantees O(N log N) in all cases (worst, best, average) because of its recursive divide-and-conquer strategy.");
      // Spawn flying emoji/star particles
      const newParticles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * -150 - 50,
        char: ['✨', '⭐', '⚡', '🔥', '🎓'][Math.floor(Math.random() * 5)],
        size: Math.random() * 20 + 15
      }));
      setParticles(newParticles);
    } else {
      setQuizState('wrong');
      audioEngine.playWrong();
      if (opt.key === 'A') {
        setQuizHint("Quick Sort averages O(N log N), but triggers O(N²) in the worst case when the pivot is chosen poorly! Try again.");
      } else if (opt.key === 'C') {
        setQuizHint("Bubble Sort is O(N²) in the average and worst case. Far too slow for competitive platforms! Try again.");
      } else {
        setQuizHint("Selection Sort always performs O(N²) operations, regardless of initial sorting. Merging is much faster! Try again.");
      }
    }
  };

  // ── 2. Interactive AI Setup State ───────────────────────────
  const [aiTopic, setAiTopic] = useState("Deep Learning Networks");
  const [aiDifficulty, setAiDifficulty] = useState("Hard");
  const [aiQuestions, setAiQuestions] = useState(10);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiQuiz, setAiQuiz] = useState(null);
  const [aiCurrentQuestion, setAiCurrentQuestion] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [selectedAiOpt, setSelectedAiOpt] = useState(null);
  const [aiAnswerState, setAiAnswerState] = useState(null);

  const handleDifficultyCycle = () => {
    triggerClick();
    if (aiDifficulty === "Easy") setAiDifficulty("Medium");
    else if (aiDifficulty === "Medium") setAiDifficulty("Hard");
    else setAiDifficulty("Easy");
  };

  const handleQuestionsSlider = (e) => {
    const val = parseInt(e.target.value);
    setAiQuestions(val);
    audioEngine.playTick(val % 5 === 0);
  };

  const generateMockQuiz = (topic) => {
    return [
      {
        q: `What is the primary activation function used to prevent vanishing gradients in hidden layers?`,
        opts: [
          { k: 'A', text: 'Sigmoid Function', c: false },
          { k: 'B', text: 'ReLU (Rectified Linear Unit)', c: true },
          { k: 'C', text: 'Tanh (Hyperbolic Tangent)', c: false },
          { k: 'D', text: 'Linear activation', c: false }
        ],
        exp: "ReLU outputs x if x > 0, keeping gradients constant (1) for positive values, avoiding vanishing issues!"
      },
      {
        q: `Which component dynamically scales token attention vectors in a Transformer network?`,
        opts: [
          { k: 'A', text: 'Softmax Scaled Dot-Product', c: true },
          { k: 'B', text: 'Batch Normalization Layer', c: false },
          { k: 'C', text: 'Stochastic Gradient Descent', c: false },
          { k: 'D', text: 'Positional Sine Embedding', c: false }
        ],
        exp: "Softmax weights normalized Q dot K elements, allowing the decoder to attend selectively."
      },
      {
        q: `Which optimizer uses running averages of both first and second moments of gradients?`,
        opts: [
          { k: 'A', text: 'Standard SGD', c: false },
          { k: 'B', text: 'RMSprop', c: false },
          { k: 'C', text: 'Adam (Adaptive Moment Estimation)', c: true },
          { k: 'D', text: 'AdaGrad', c: false }
        ],
        exp: "Adam computes bias-corrected estimates of first (mean) and second (uncentered variance) moments."
      }
    ];
  };

  const startAiGeneration = () => {
    setAiGenerating(true);
    audioEngine.playReady();
    setTimeout(() => {
      setAiGenerating(false);
      setAiQuiz(generateMockQuiz(aiTopic));
      setAiCurrentQuestion(0);
      setAiScore(0);
      setSelectedAiOpt(null);
      setAiAnswerState(null);
      audioEngine.playVictory();
    }, 2000);
  };

  const handleAiQuizAnswer = (opt) => {
    if (aiAnswerState !== null) return;
    triggerClick();
    setSelectedAiOpt(opt.k);
    if (opt.c) {
      setAiAnswerState('correct');
      setAiScore(prev => prev + 1);
      audioEngine.playCorrect();
    } else {
      setAiAnswerState('wrong');
      audioEngine.playWrong();
    }
  };

  const nextAiQuestion = () => {
    triggerClick();
    setSelectedAiOpt(null);
    setAiAnswerState(null);
    if (aiCurrentQuestion < aiQuiz.length - 1) {
      setAiCurrentQuestion(prev => prev + 1);
    } else {
      audioEngine.playVictory();
      setAiCurrentQuestion(aiQuiz.length);
    }
  };

  // ── 3. Multiplayer Esports Lobby Simulator ──────────────────
  const [lobbyReady, setLobbyReady] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { name: 'Alex (Coder)', msg: 'Yo! Is this JEE practice or full Computer Science algorithms?', own: false },
    { name: 'Sneha (Med)', msg: 'Algorithms. Prepare to get dominated by Rohan 😂', own: false },
  ]);
  const [typedMessage, setTypedMessage] = useState("");
  const [opponentTyping, setOpponentTyping] = useState(false);

  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!typedMessage.trim()) return;
    triggerClick();
    const newMsg = { name: 'Rohan (Host)', msg: typedMessage, own: true };
    setChatMessages(prev => [...prev, newMsg]);
    setTypedMessage("");

    setOpponentTyping(true);
    setTimeout(() => {
      setOpponentTyping(false);
      const responses = [
        "Bro you are absolutely cracked at DBMS queries! 😳",
        "Wait, what is the answer to question 4? That was insane.",
        "Let's click READY and spin the board! 🏁",
        "I'm ready! Bring on the Hard Mode questions!",
        "Who generated this topic? Anatomy is so fun."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages(prev => [...prev, { name: 'Alex (Coder)', msg: randomReply, own: false }]);
      audioEngine.playClick();
    }, 1500 + Math.random() * 1000);
  };

  const clickQuickChat = (phrase) => {
    triggerClick();
    setChatMessages(prev => [...prev, { name: 'Rohan (Host)', msg: phrase, own: true }]);
    
    setOpponentTyping(true);
    setTimeout(() => {
      setOpponentTyping(false);
      setChatMessages(prev => [...prev, { name: 'Sneha (Med)', msg: "Let's go! I'm in my prime! 🔥", own: false }]);
      audioEngine.playClick();
    }, 1200);
  };

  // ── 4. Interactive Leaderboard Shifts ────────────────────────
  const [leaderboardTab, setLeaderboardTab] = useState('weekly');

  const weeklyRankings = [
    { rank: 1, name: 'Rohan Sharma', score: 5240, badge: '🥇', color: '#FFD600', isOwn: true },
    { rank: 2, name: 'Alex Chen', score: 4820, badge: '🥈', color: '#C7C3FA', isOwn: false },
    { rank: 3, name: 'Sara Kumar', score: 4150, badge: '🥉', color: '#B39DDB', isOwn: false },
    { rank: 4, name: 'Amit Patel', score: 3890, badge: '🔥', color: '#FF4081', isOwn: false },
    { rank: 5, name: 'Priya Nair', score: 3740, badge: '🧠', color: '#00E676', isOwn: false }
  ];

  const allTimeRankings = [
    { rank: 1, name: 'Simba Davis', score: 98450, badge: '👑', color: '#FFD600', isOwn: false },
    { rank: 2, name: 'Rohan Sharma', score: 87400, badge: '🥈', color: '#C7C3FA', isOwn: true },
    { rank: 3, name: 'Kabir Dev', score: 79210, badge: '🥉', color: '#B39DDB', isOwn: false },
    { rank: 4, name: 'Elena Vost', score: 74120, badge: '🚀', color: '#FF4081', isOwn: false },
    { rank: 5, name: 'Sneha (Med)', score: 68450, badge: '🔬', color: '#00E676', isOwn: false }
  ];

  const squadRankings = [
    { rank: 1, name: 'Rohan Sharma', score: 5240, badge: '⚡', color: '#FFD600', isOwn: true },
    { rank: 2, name: 'Alex Chen', score: 4820, badge: '🎮', color: '#C7C3FA', isOwn: false },
    { rank: 3, name: 'Sneha (Med)', score: 3210, badge: '🩺', color: '#B39DDB', isOwn: false },
    { rank: 4, name: 'Aarav Mehta', score: 2890, badge: '🧬', color: '#FF4081', isOwn: false }
  ];

  const currentRankings = leaderboardTab === 'weekly' 
    ? weeklyRankings 
    : leaderboardTab === 'all-time' 
      ? allTimeRankings 
      : squadRankings;
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', transition: 'background 0.4s' }}>
      
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.25rem 2rem',
        background: isDark ? 'rgba(12, 10, 31, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1.5px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 900, boxShadow: 'var(--shadow-glow-sm)', color: 'white'
          }}>⚡</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Quiz<span style={{ color: 'var(--primary)' }}>Verse</span> AI
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Sound Synthesizer Controller */}
          <button 
            onClick={() => setSoundOn(prev => !prev)} 
            className="btn btn-ghost btn-sm" 
            style={{ 
              padding: '0.5rem', 
              borderRadius: 12, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: soundOn ? 'rgba(255, 107, 0, 0.08)' : 'rgba(255, 255, 255, 0.02)',
              border: soundOn ? '1.5px solid rgba(255, 107, 0, 0.3)' : '1.5px solid var(--border)',
              transition: 'all 0.2s'
            }}
            title={soundOn ? "Mute Game Sounds" : "Enable Gamified Sound Engine"}
          >
            {soundOn ? (
              <Volume2 size={18} style={{ color: 'var(--primary)' }} />
            ) : (
              <VolumeX size={18} style={{ color: 'var(--text-muted)' }} />
            )}
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: soundOn ? 'var(--primary)' : 'var(--text-muted)' }}>
              {soundOn ? "FX ON" : "MUTED"}
            </span>
          </button>

          <button onClick={() => { triggerClick(); toggleTheme(); }} className="btn btn-ghost btn-sm" style={{ padding: '0.45rem', borderRadius: 10 }}>
            {isDark ? <Sun size={20} style={{ color: '#FFD600' }} /> : <Moon size={20} style={{ color: '#7C4DFF' }} />}
          </button>
          
          <Link to="/login" onClick={triggerClick} style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Login</Link>
          
          <Link to="/register" onClick={triggerClick} className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 20px rgba(255, 107, 0, 0.25)' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Global MMO Activity Ticker ─────────────────────── */}
      <div style={{
        position: 'fixed',
        top: '85px',
        left: 0,
        right: 0,
        height: '36px',
        background: isDark ? 'rgba(15, 10, 5, 0.7)' : 'rgba(255, 248, 245, 0.7)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(24px)',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', maxWidth: '1280px', padding: '0 2rem' }}>
          <span style={{ 
            fontSize: '0.65rem', 
            fontWeight: 900, 
            background: 'rgba(255, 107, 0, 0.15)', 
            color: 'var(--primary)', 
            padding: '0.2rem 0.5rem', 
            borderRadius: '6px',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.02em',
            flexShrink: 0
          }}>ARENA FEED</span>
          
          <div style={{ flex: 1, position: 'relative', height: '24px', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={tickerIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  fontSize: '0.8rem',
                  fontWeight: 750,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {globalTickerAlerts[tickerIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        paddingTop: '160px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}>
        {/* Cosmic Twinkling Stars Background */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          {stars.map(star => (
            <motion.div
              key={star.id}
              animate={{
                opacity: [0.1, 0.75, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 10px white',
              }}
            />
          ))}
        </div>

        {/* Dynamic Interactive Mesh Gradient Background (Aurora style) */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
              scale: [1, 1.15, 0.9, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute', width: '650px', height: '650px',
              background: 'radial-gradient(circle, rgba(255, 107, 0, 0.16) 0%, transparent 70%)',
              top: '-15%', left: '-15%', filter: 'blur(80px)'
            }}
          />
          <motion.div
            animate={{
              x: [0, -35, 50, 0],
              y: [0, 45, -35, 0],
              scale: [1, 0.9, 1.15, 1]
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{
              position: 'absolute', width: '550px', height: '550px',
              background: 'radial-gradient(circle, rgba(124, 77, 255, 0.14) 0%, transparent 70%)',
              bottom: '15%', right: '-10%', filter: 'blur(80px)'
            }}
          />
          <motion.div
            animate={{
              x: [0, 30, -50, 0],
              y: [0, 55, -25, 0],
              scale: [1, 1.1, 0.95, 1]
            }}
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{
              position: 'absolute', width: '580px', height: '580px',
              background: 'radial-gradient(circle, rgba(255, 64, 129, 0.11) 0%, transparent 70%)',
              top: '25%', right: '10%', filter: 'blur(80px)'
            }}
          />
          <motion.div
            animate={{
              x: [0, -45, 25, 0],
              y: [0, -25, 45, 0],
              scale: [1, 0.95, 1.1, 1]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: 'absolute', width: '450px', height: '450px',
              background: 'radial-gradient(circle, rgba(255, 214, 0, 0.08) 0%, transparent 70%)',
              bottom: '-5%', left: '15%', filter: 'blur(80px)'
            }}
          />
        </div>

        {/* Tech Grid Overlay */}
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.85, zIndex: 0, pointerEvents: 'none' }} />

        {/* Left Floating Hand-Drawn Sticky Note */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '20%', left: '7%',
            background: 'var(--gradient-card)', border: '2.5px dashed var(--primary)',
            padding: '0.85rem 1.25rem', borderRadius: 20,
            fontFamily: 'var(--font-handdrawn)', fontSize: '1.25rem', color: 'var(--primary-light)',
            zIndex: 3, maxWidth: 190,
            boxShadow: 'var(--shadow-md)', textAlign: 'left',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer'
          }}
          onClick={() => {
            triggerClick();
            setHeroPromptText("Organic Chemistry Synthesis");
          }}
          title="Click to fill prompt!"
        >
          📌 <span style={{ textDecoration: 'underline' }}>No boring books!</span> Click to auto-fill Organic Chem 🧪
        </motion.div>

        {/* Right Floating Hand-Drawn Sticky Note */}
        <motion.div
          animate={{ y: [0, 8, 0], rotate: [6, 8, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: 'absolute', top: '26%', right: '12%',
            background: 'var(--gradient-card)', border: '2.5px dashed var(--accent)',
            padding: '0.85rem 1.25rem', borderRadius: 20,
            fontFamily: 'var(--font-handdrawn)', fontSize: '1.25rem', color: 'var(--accent)',
            zIndex: 3, maxWidth: 200,
            boxShadow: 'var(--shadow-md)', textAlign: 'right',
            backdropFilter: 'blur(12px)',
            cursor: 'pointer'
          }}
          onClick={() => {
            triggerClick();
            setHeroPromptText("Quantum Superconductors");
          }}
          title="Click to fill prompt!"
        >
          🧬 <span style={{ textDecoration: 'underline' }}>Quantum physics</span> generated in 5s! Try it ⚡
        </motion.div>

        {/* Cute hand-drawn circles and stickers */}
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', top: '15%', left: '22%', fontSize: '2.5rem', zIndex: 2 }}>🎓</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', bottom: '25%', left: '22%', fontSize: '3rem', zIndex: 2, animationDelay: '2s' }}>🩺</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', top: '20%', right: '22%', fontSize: '2.8rem', zIndex: 2, animationDelay: '1s' }}>🚀</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', bottom: '15%', right: '22%', fontSize: '2.5rem', zIndex: 2, animationDelay: '2.5s' }}>🤖</motion.div>

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '0 1.5rem' }}>
          <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', border: '1.5px solid var(--border)', padding: '0.5rem 1.25rem', borderRadius: 30, marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
              <Sparkles size={16} style={{ color: '#FFEB3B' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>Personalized Exam Arena for Gen-Z</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 4.8rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              maxWidth: 1000,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)'
            }}>
              The smartest place to{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span className="gradient-text">learn</span>
                <svg style={{ position: 'absolute', bottom: -10, left: 0, width: '100%' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,7 C30,2 70,2 100,7" stroke="#7C4DFF" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              ,{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ color: '#FF4081' }}>compete</span>
                <svg style={{ position: 'absolute', bottom: -10, left: 0, width: '100%' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,7 C30,8 70,8 100,4" stroke="#FF4081" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>{' '}
              and{' '}
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <span style={{ color: 'var(--secondary-dark)' }}>improve</span>
                <svg style={{ position: 'absolute', bottom: -10, left: 0, width: '100%' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,5 C30,3 70,9 100,6" stroke="#FBC02D" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 650, marginBottom: '2.5rem', lineHeight: 1.7, fontWeight: 500 }}>
              Say goodbye to boring study books. Generate gamified <strong style={{ color: 'var(--primary)' }}>AI-powered</strong> quizzes, participate in live <strong style={{ color: '#FF4081' }}>multiplayer</strong> battles, and track your metrics like a pro.
            </motion.p>

            {/* 🚀 Hero Prompt Playground */}
            <motion.form 
              variants={fadeUp} 
              onSubmit={handleHeroSearchSubmit}
              style={{
                width: '100%',
                maxWidth: '650px',
                marginBottom: '2rem',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-glass)',
                border: '2.5px solid var(--border)',
                borderRadius: '24px',
                padding: '0.5rem 0.75rem',
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(16px)',
                transition: 'all 0.3s'
              }}
              onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Sparkles size={20} style={{ color: 'var(--primary-light)', marginLeft: '0.5rem', flexShrink: 0 }} />
              <input
                type="text"
                value={heroPromptText}
                onChange={(e) => setHeroPromptText(e.target.value)}
                placeholder="What obscure topic do you want to master today? (e.g. Relational Database Joins)"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 650,
                  color: 'var(--text-primary)',
                  padding: '0.5rem'
                }}
              />
              <button 
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '0.65rem 1.5rem',
                  borderRadius: '16px',
                  background: 'var(--primary)',
                  boxShadow: '0 4px 15px rgba(255, 107, 0, 0.3)'
                }}
              >
                Launch Battle ⚡
              </button>
            </motion.form>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4.5rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.25rem', borderRadius: 18, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', boxShadow: '0 8px 30px rgba(124, 77, 255, 0.35)' }}>
                Start Leveling Up ⚡ <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.25rem', borderRadius: 18, fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none' }}>
                Demo Battle 🎮
              </Link>
            </motion.div>

            {/* ── Trusted by Students Section ────────────────────── */}
            <motion.div variants={fadeUp} style={{ width: '100%', maxWidth: 800, marginBottom: '5rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Trusted by 50,000+ competitive aspirants from
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2.5rem', flexWrap: 'wrap', opacity: 0.85 }}>
                {['IIT Bombay', 'AIIMS Delhi', 'BITS Pilani', 'MIT Tech', 'NEET Hub', 'JEE Scholars'].map((univ, idx) => (
                  <div key={idx} style={{
                    padding: '0.5rem 1.25rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)',
                    fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-secondary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    🏫 {univ}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Premium Hero Bento Graphic */}
            <motion.div variants={fadeUp} style={{ width: '100%', maxWidth: 950 }}>
              <div style={{
                background: 'var(--bg-secondary)',
                border: '2px solid var(--border)',
                borderRadius: 28,
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                  {['#FF1744', '#FF9100', '#00E676'].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                  ))}
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'monospace' }}>
                    QUIZVERSE-ENGINE v2.5 // LIVE DEMO
                  </span>
                </div>

                {/* Confetti Particles Effect */}
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                    animate={{ x: p.x, y: p.y, scale: [0, 1.3, 1], opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '40%',
                      fontSize: p.size,
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}
                  >
                    {p.char}
                  </motion.div>
                ))}

                {/* Mock quiz UI */}
                <div style={{ textAlign: 'left', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ background: 'rgba(255, 107, 0, 0.12)', color: 'var(--primary-light)', border: '1px solid rgba(255, 107, 0, 0.25)', fontSize: '0.75rem', fontWeight: 800 }}>MOCK ARENA</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>Category: Computer Science</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      background: quizState === 'correct' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)', 
                      border: quizState === 'correct' ? '1.5px solid rgba(0, 230, 118, 0.3)' : '1.5px solid rgba(255, 23, 68, 0.3)', 
                      padding: '0.3rem 0.75rem', 
                      borderRadius: 20 
                    }}>
                      <span style={{ 
                        color: quizState === 'correct' ? '#00E676' : '#FF1744', 
                        fontSize: '0.85rem', 
                        fontWeight: 850 
                      }}>
                        {quizState === 'correct' ? "⏱ SOLVED" : "⏱ 24s left"}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontWeight: 800, marginBottom: '1.5rem', fontSize: '1.15rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    Which sorting algorithm guarantees a worst-case time complexity of O(N log N)?
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {[
                      { key: 'A', val: 'Quick Sort', select: false },
                      { key: 'B', val: 'Merge Sort', select: true },
                      { key: 'C', val: 'Bubble Sort', select: false },
                      { key: 'D', val: 'Selection Sort', select: false }
                    ].map((opt, i) => {
                      const isSelected = selectedOpt === opt.key;
                      const isCorrect = opt.select;
                      
                      let optionBorderColor = 'var(--border)';
                      let optionBackground = 'var(--bg-glass)';
                      let keyColor = 'var(--text-secondary)';
                      let keyBg = 'var(--border)';

                      if (isSelected) {
                        if (quizState === 'correct') {
                          optionBorderColor = '#00E676';
                          optionBackground = 'rgba(0, 230, 118, 0.12)';
                          keyColor = 'white';
                          keyBg = '#00E676';
                        } else {
                          optionBorderColor = '#FF1744';
                          optionBackground = 'rgba(255, 23, 68, 0.12)';
                          keyColor = 'white';
                          keyBg = '#FF1744';
                        }
                      } else if (quizState === 'correct' && isCorrect) {
                        // Highlight the correct one if they solved it
                        optionBorderColor = '#00E676';
                        optionBackground = 'rgba(0, 230, 118, 0.08)';
                        keyColor = 'white';
                        keyBg = '#00E676';
                      }

                      return (
                        <motion.div 
                          key={i} 
                          className="quiz-option" 
                          onClick={() => handleQuizClick(opt)}
                          whileHover={{ y: quizState === 'correct' ? 0 : -2, borderColor: quizState === 'correct' ? '#00E676' : 'var(--primary)' }}
                          whileTap={{ scale: quizState === 'correct' ? 1 : 0.98 }}
                          style={{
                            padding: '1rem 1.25rem', 
                            borderRadius: 16, 
                            border: '2px solid',
                            borderColor: optionBorderColor,
                            background: optionBackground,
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.75rem', 
                            cursor: quizState === 'correct' ? 'default' : 'pointer',
                            transition: 'border-color 0.2s, background-color 0.2s'
                          }}
                        >
                          <span style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: keyBg,
                            color: keyColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            transition: 'all 0.2s'
                          }}>{opt.key}</span>
                          <span style={{ 
                            fontSize: '0.95rem', 
                            fontWeight: 700, 
                            color: isSelected && quizState === 'wrong' ? '#FF1744' : 'var(--text-primary)'
                          }}>{opt.val}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Dynamic Adaptive Explanation Banner */}
                  <AnimatePresence>
                    {quizState && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          marginTop: '1.5rem',
                          padding: '1.25rem',
                          borderRadius: 18,
                          background: quizState === 'correct' ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 23, 68, 0.08)',
                          border: quizState === 'correct' ? '1.5px solid rgba(0, 230, 118, 0.3)' : '1.5px solid rgba(255, 23, 68, 0.3)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {quizState === 'correct' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 1] }}
                            style={{
                              position: 'absolute', right: 15, top: 15,
                              background: 'var(--gradient-primary)', color: 'white',
                              padding: '0.3rem 0.75rem', borderRadius: 12,
                              fontWeight: 900, fontSize: '0.85rem', boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            🔥 +150 XP
                          </motion.div>
                        )}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {quizState === 'correct' ? (
                            <CheckCircle size={20} style={{ color: '#00E676' }} />
                          ) : (
                            <XCircle size={20} style={{ color: '#FF1744' }} />
                          )}
                          <span style={{ 
                            fontWeight: 800, 
                            fontSize: '1rem',
                            color: quizState === 'correct' ? '#00E676' : '#FF1744'
                          }}>
                            {quizState === 'correct' ? "LEGEN-DARY! ACCURACY 100%" : "SKILL ISSUE! HINT DETECTED"}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.5, maxWidth: '90%' }}>
                          {quizHint}
                        </p>
                        {quizState === 'wrong' && (
                          <button 
                            onClick={() => { triggerClick(); setQuizState(null); setSelectedOpt(null); }} 
                            className="btn btn-ghost btn-sm"
                            style={{ alignSelf: 'flex-start', padding: '0.2rem 0.5rem', fontSize: '0.75rem', marginTop: '0.5rem', border: '1px solid rgba(255,23,68,0.2)' }}
                          >
                            Try Again 🔄
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Categories Section ──────────────────────────────── */}
      <section id="categories" style={{ padding: '7rem 0', background: 'var(--bg-glass)', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)', position: 'relative' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#FF408115', color: '#FF4081',
              border: '1.5px solid #FF408140', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>🎯 DIVERSE SUBJECTS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Tailored for <span style={{ color: 'var(--primary)' }}>High-Achievers</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Whether you are coding algorithms, memorizing clinical terms, or crushing engineering exams, we have got you covered.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <motion.div key={i} className="glass-card" onMouseMove={handleMouseMove} style={{
                background: cat.gradient,
                border: `2px solid ${cat.color}25`,
                borderRadius: 24,
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: 'var(--shadow-sm)'
              }}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-md)', transition: { duration: 0.2 } }}>
                
                {/* Floating design shape inside card */}
                <div style={{ position: 'absolute', right: -15, bottom: -15, width: 70, height: 70, borderRadius: '50%', background: `${cat.color}10` }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                    color: cat.color, background: `${cat.color}20`, padding: '0.25rem 0.625rem', borderRadius: 8,
                    border: `1px solid ${cat.color}40`
                  }}>{cat.tag}</div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{cat.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Quiz Generator Preview (Bento Section 1) ────────── */}
      <section id="ai-generator" style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div className="grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
            
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div style={{
                display: 'inline-flex', padding: '0.4rem 1rem', background: '#00B0FF15', color: '#00B0FF',
                border: '1.5px solid #00B0FF40', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
              }}>🤖 GEMINI INTELLIGENCE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>
                Gen-Z AI Quiz <br /><span className="gradient-text">Engine</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', fontWeight: 500 }}>
                Type in any obscure engineering formula, specialized medical symptom, or coding topic. Our Google Gemini 2.5 Flash system spits out challenging, high-quality, concept-valid MCQs with descriptive feedback in seconds.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  'Adaptive question difficulty mapping (Easy, Medium, Hard)',
                  'Descriptive educational explanations for every choice',
                  'Instant customized study plan feedback loops'
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
                    <CheckCircle size={18} style={{ color: '#00E676', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              style={{
                background: 'var(--gradient-card)',
                border: '2px solid var(--border)',
                borderRadius: 32,
                padding: '2.5rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
              <div style={{ position: 'absolute', top: -15, right: -15, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255, 107, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✨</div>
              
              <AnimatePresence mode="wait">
                {/* 1. Setup Phase */}
                {!aiGenerating && !aiQuiz && (
                  <motion.div 
                    key="setup"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                  >
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)' }}>AI Setup Panel</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Topic Selector */}
                      <div style={{ padding: '0.875rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SELECT TOPIC</div>
                        <select 
                          value={aiTopic}
                          onChange={(e) => { triggerClick(); setAiTopic(e.target.value); }}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Deep Learning Networks" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>🤖 Deep Learning Networks</option>
                          <option value="DBMS Relational Algebra" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>📊 DBMS Relational Algebra</option>
                          <option value="Organic Chemistry Synthesis" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>🧬 Organic Chemistry Synthesis</option>
                          <option value="Quantum Superconductors" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>🪐 Quantum Superconductors</option>
                        </select>
                      </div>

                      {/* Difficulty and Question Count */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Difficulty Cycle Button */}
                        <div 
                          onClick={handleDifficultyCycle}
                          style={{ 
                            flex: 1, 
                            padding: '0.875rem', 
                            borderRadius: 14, 
                            background: 'var(--bg-glass)', 
                            border: '1.5px solid var(--border)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DIFFICULTY</div>
                          <div style={{ 
                            fontWeight: 850, 
                            fontSize: '0.95rem', 
                            color: aiDifficulty === 'Easy' ? '#00E676' : aiDifficulty === 'Medium' ? '#FF9100' : '#FF1744',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}>
                            {aiDifficulty === 'Easy' ? '🟢 Easy Mode' : aiDifficulty === 'Medium' ? '🟡 Medium Mode' : '🔴 Hard Mode'}
                          </div>
                        </div>

                        {/* Question Count Slider */}
                        <div style={{ flex: 1, padding: '0.875rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>QUESTIONS</span>
                            <span style={{ color: 'var(--primary-light)', fontWeight: 900 }}>{aiQuestions} MCQs</span>
                          </div>
                          <input 
                            type="range" 
                            min="5" 
                            max="30" 
                            step="5"
                            value={aiQuestions}
                            onChange={handleQuestionsSlider}
                            style={{
                              width: '100%',
                              accentColor: 'var(--primary)',
                              height: '4px',
                              borderRadius: '2px',
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      </div>
                      
                      <button 
                        onClick={startAiGeneration}
                        className="btn btn-primary" 
                        style={{ 
                          padding: '1rem', 
                          borderRadius: 14, 
                          fontWeight: 800, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: '0.5rem',
                          background: 'var(--gradient-primary)',
                          boxShadow: 'var(--shadow-glow-sm)'
                        }}
                      >
                        <Sparkles size={16} /> Generate AI Quiz with Gemini ⚡
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 2. Generating Phase (Circular Ring Loader) */}
                {aiGenerating && (
                  <motion.div 
                    key="generating"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                  >
                    <div style={{ position: 'relative', width: 80, height: 80 }}>
                      <Loader2 size={80} className="animate-spin" style={{ color: 'var(--primary)' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🧠</div>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                        Google Gemini 2.5 Flash
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                        Parsing curriculum standards and synthesising conceptual MCQ parameters...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 3. Generated Quiz Active Game */}
                {!aiGenerating && aiQuiz && aiCurrentQuestion < aiQuiz.length && (
                  <motion.div 
                    key="playing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary-light)' }}>
                        TOPIC: {aiTopic}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>
                        Q {aiCurrentQuestion + 1} of {aiQuiz.length}
                      </span>
                    </div>

                    <p style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                      {aiQuiz[aiCurrentQuestion].q}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.65rem' }}>
                      {aiQuiz[aiCurrentQuestion].opts.map((opt, idx) => {
                        const isSelected = selectedAiOpt === opt.k;
                        const showCorrect = aiAnswerState !== null && opt.c;
                        const showWrong = isSelected && aiAnswerState === 'wrong';

                        let optBorder = 'var(--border)';
                        let optBg = 'var(--bg-glass)';
                        let bulletBg = 'var(--border)';
                        let bulletColor = 'var(--text-secondary)';

                        if (showCorrect) {
                          optBorder = '#00E676';
                          optBg = 'rgba(0, 230, 118, 0.12)';
                          bulletBg = '#00E676';
                          bulletColor = 'white';
                        } else if (showWrong) {
                          optBorder = '#FF1744';
                          optBg = 'rgba(255, 23, 68, 0.12)';
                          bulletBg = '#FF1744';
                          bulletColor = 'white';
                        }

                        return (
                          <motion.div
                            key={idx}
                            onClick={() => handleAiQuizAnswer(opt)}
                            whileHover={{ y: aiAnswerState ? 0 : -1, borderColor: aiAnswerState ? optBorder : 'var(--primary)' }}
                            style={{
                              padding: '0.75rem 1rem',
                              borderRadius: 12,
                              border: '1.5px solid',
                              borderColor: optBorder,
                              background: optBg,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              cursor: aiAnswerState ? 'default' : 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: bulletBg,
                              color: bulletColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.75rem'
                            }}>{opt.k}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{opt.text}</span>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Explanations & Next Button */}
                    <AnimatePresence>
                      {aiAnswerState && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          style={{
                            padding: '0.85rem',
                            borderRadius: 12,
                            background: aiAnswerState === 'correct' ? 'rgba(0, 230, 118, 0.05)' : 'rgba(255, 23, 68, 0.05)',
                            border: aiAnswerState === 'correct' ? '1px solid rgba(0, 230, 118, 0.25)' : '1px solid rgba(255, 23, 68, 0.25)',
                            fontSize: '0.8rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ 
                              fontWeight: 900, 
                              color: aiAnswerState === 'correct' ? '#00E676' : '#FF1744'
                            }}>
                              {aiAnswerState === 'correct' ? "🎉 EXCELLENT ANSWER" : "❌ INCORRECT CONGRUENCE"}
                            </span>
                            <button 
                              onClick={nextAiQuestion}
                              className="btn btn-primary btn-sm"
                              style={{ 
                                padding: '0.3rem 0.75rem', 
                                borderRadius: 8,
                                background: 'var(--primary)'
                              }}
                            >
                              Next MCQ ➡️
                            </button>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.4 }}>
                            {aiQuiz[aiCurrentQuestion].exp}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* 4. Scorecard / Quiz Completion */}
                {!aiGenerating && aiQuiz && aiCurrentQuestion === aiQuiz.length && (
                  <motion.div 
                    key="scorecard"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}
                  >
                    <div style={{ fontSize: '3rem' }}>🏆</div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                        Concept Arena Mastered!
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Adaptive calibration reports high competency index!
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--bg-glass)', border: '1.5px solid var(--border)', padding: '0.85rem 1.5rem', borderRadius: 16 }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>SCORE</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary-light)' }}>{aiScore} / {aiQuiz.length}</div>
                      </div>
                      <div style={{ width: 1, background: 'var(--border)' }} />
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>REWARD</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFD600' }}>+{aiScore * 50} XP 🔥</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                      <button 
                        onClick={() => { triggerClick(); setAiQuiz(null); }}
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '0.75rem', borderRadius: 12 }}
                      >
                        Reset Setup 🔄
                      </button>
                      <button 
                        onClick={() => { triggerClick(); startAiGeneration(); }}
                        className="btn btn-primary" 
                        style={{ flex: 2, padding: '0.75rem', borderRadius: 12 }}
                      >
                        Regenerate ⚡
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Multiplayer Quiz Battle (Esports gaming lobby style) ── */}
      <section style={{ padding: '7rem 0', background: 'var(--bg-glass)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#FF910015', color: '#FF9100',
              border: '1.5px solid #FF910040', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>🎮 MULTIPLAYER ARENA</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Esports-Style <span style={{ color: '#FF9100' }}>Quiz Battles</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Create lobbies, invite squad members, toggle live chat, and experience rapid real-time scoring.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '3rem', alignItems: 'center' }}>
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              style={{
                background: 'linear-gradient(135deg, rgba(20,18,51,0.95), rgba(12,10,31,0.95))',
                border: '2px solid #FF910050',
                borderRadius: 28,
                padding: '2rem',
                boxShadow: '0 12px 40px rgba(255, 145, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(255, 145, 0, 0.2)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ animation: 'pulse 1.5s infinite', width: 8, height: 8, borderRadius: '50%', background: '#00E676' }} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#FF9100', fontSize: '0.9rem' }}>🎮 ROOM LOBBY // active</span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  CODE: <span style={{ color: '#FF9100', fontWeight: 900 }}>QVERSE-90X</span>
                </div>
              </div>

              {/* Lobby Players List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {[
                  { name: 'Rohan (Host)', score: 320, isHost: true, isReady: lobbyReady },
                  { name: 'Alex (Coder)', score: 280, isHost: false, isReady: true },
                  { name: 'Sneha (Med)', score: 140, isHost: false, isReady: lobbyReady ? true : false },
                ].map((player, i) => (
                  <motion.div 
                    key={i} 
                    layout
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.03)', border: `1.5px solid ${player.isReady ? 'rgba(0, 230, 118, 0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 14,
                      transition: 'border-color 0.3s'
                    }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.75rem', color: 'white' }}>
                      {player.name[0]}
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: '0.85rem', color: '#F8FAFC' }}>
                      {player.name}
                      {player.isHost && <span style={{ marginLeft: '0.35rem', fontSize: '0.65rem', background: 'rgba(255, 107, 0, 0.2)', color: 'var(--primary-light)', padding: '0.1rem 0.3rem', borderRadius: 6 }}>HOST</span>}
                    </div>
                    <span style={{ fontWeight: 800, color: '#FF9100', fontSize: '0.8rem' }}>{player.score} pts</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      color: player.isReady ? '#00E676' : '#FF1744',
                      background: player.isReady ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 8
                    }}>
                      {player.isReady ? 'READY' : 'WAITING'}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Lobby Interactive Live Chat */}
              <div style={{ 
                background: 'rgba(0, 0, 0, 0.25)', 
                borderRadius: 18, 
                border: '1.5px solid rgba(255,255,255,0.05)', 
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  <MessageSquare size={12} /> LIVE ROOM CHAT
                </div>

                {/* Message Scroll View */}
                <div style={{ 
                  height: '110px', 
                  overflowY: 'auto', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.5rem',
                  paddingRight: '0.25rem'
                }}>
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        alignSelf: msg.own ? 'flex-end' : 'flex-start',
                        maxWidth: '85%'
                      }}
                    >
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '0.1rem', textAlign: msg.own ? 'right' : 'left' }}>
                        {msg.name}
                      </div>
                      <div style={{ 
                        background: msg.own ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.06)', 
                        color: 'white',
                        padding: '0.45rem 0.75rem',
                        borderRadius: msg.own ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.msg}
                      </div>
                    </div>
                  ))}

                  {/* Opponent typing bubble indicator */}
                  {opponentTyping && (
                    <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>Alex is typing...</div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', padding: '0.4rem 0.75rem', borderRadius: '10px 10px 10px 4px', display: 'flex', gap: '0.2rem' }}>
                        {[0,1,2].map(dot => (
                          <span 
                            key={dot} 
                            style={{ 
                              width: 6, 
                              height: 6, 
                              borderRadius: '50%', 
                              background: 'var(--text-muted)', 
                              display: 'inline-block',
                              animation: 'bounce 1s infinite',
                              animationDelay: `${dot * 0.2}s`
                            }} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Chat Buttons */}
                <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
                  {["I am ready! 🔥", "Lock in! 🧠", "EZ win! 🏆"].map((phrase, i) => (
                    <button
                      key={i}
                      onClick={() => clickQuickChat(phrase)}
                      className="btn btn-ghost btn-xs"
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 10,
                        fontSize: '0.7rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* Form input send message */}
                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type Gen-Z trash talk..."
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.45rem 0.85rem',
                      borderRadius: 12,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1.5px solid var(--border)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      outline: 'none',
                      color: 'white'
                    }}
                  />
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      padding: '0.45rem 0.75rem',
                      borderRadius: 12,
                      background: 'var(--primary)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

              {/* Ready State controllers */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button 
                  onClick={() => { triggerClick(); setChatMessages(prev => [...prev, { name: 'Rohan (Host)', msg: "Leaving room lobby.", own: true }]); }}
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '0.65rem', borderRadius: 12, fontSize: '0.8rem' }}
                >
                  🚪 Leave Lobby
                </button>
                <button 
                  onClick={() => {
                    audioEngine.playReady();
                    setLobbyReady(prev => !prev);
                  }}
                  className="btn btn-primary" 
                  style={{ 
                    flex: 2, 
                    padding: '0.65rem', 
                    background: lobbyReady ? 'linear-gradient(135deg,#00E676,#00B0FF)' : 'linear-gradient(135deg,#FF9100,#FF3D00)', 
                    border: 'none', 
                    color: 'white', 
                    fontWeight: 900,
                    borderRadius: 12,
                    fontSize: '0.8rem',
                    boxShadow: lobbyReady ? '0 4px 12px rgba(0, 230, 118, 0.25)' : '0 4px 12px rgba(255, 145, 0, 0.25)'
                  }}
                >
                  {lobbyReady ? "🏁 Ready! Launching..." : "🏁 Set Ready Toggles"}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <span style={{ padding: '0.3rem 0.8rem', background: '#FF910020', color: '#FF9100', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>⚔️ LOBBY CODES</span>
                <span style={{ padding: '0.3rem 0.8rem', background: '#FF408120', color: '#FF4081', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>💬 LIVE CHAT</span>
                <span style={{ padding: '0.3rem 0.8rem', background: '#00E67620', color: '#00E676', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800 }}>🎖️ PODIUM ARCADES</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                Compete, Climb, and Conquer
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem', fontWeight: 500 }}>
                Lobbies are fully integrated with our Socket.IO server backend. No lags, no drops. Challenge your study circle to immediate battles and claim local leaderboard dominance.
              </p>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', borderRadius: 14, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <Zap size={16} /> Enter Battle Lobby
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── SaaS Previews (Bento Row 2) ────────────────────────── */}
      <section style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#7C4DFF15', color: '#7C4DFF',
              border: '1.5px solid #7C4DFF40', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>📊 ANALYTICS & SAAS DASHBOARDS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Dual Dashboards: <span className="gradient-text">Student & Teacher</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 580, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Tailored portals designed specifically to serve the academic cycle: transparent insights for students, and full-featured quiz analytics for teachers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
            
            {/* Student Preview */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{
                background: 'var(--gradient-card)',
                border: '2px solid var(--border)',
                borderRadius: 32,
                padding: '2.5rem',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                <span style={{ padding: '0.25rem 0.625rem', background: '#00E67620', color: '#00E676', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>STUDENT PORTAL</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>Student Performance Dashboard</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                Includes gamified widgets like streak counters (🔥), circular accuracy charts, accumulated XP points, and dynamic performance feedback cards.
              </p>
              {/* Graphic with interactive Claim Streak Simulator */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', position: 'relative' }}>
                <div style={{ padding: '1rem', borderRadius: 18, background: 'var(--bg-glass)', border: '1.5px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <motion.div 
                    onClick={handleClaimStreak}
                    whileHover={{ scale: streakClaimed ? 1 : 1.05 }}
                    whileTap={{ scale: streakClaimed ? 1 : 0.95 }}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      background: streakClaimed ? 'rgba(255, 107, 0, 0.08)' : 'var(--bg-secondary)', 
                      borderRadius: 12, 
                      textAlign: 'center', 
                      border: `1.5px solid ${streakClaimed ? 'var(--primary)' : 'var(--border)'}`,
                      cursor: streakClaimed ? 'default' : 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s'
                    }}
                  >
                    {/* Floating claimed pop-badge */}
                    <AnimatePresence>
                      {streakClaimed && showStreakConfetti && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.8 }}
                          animate={{ opacity: 1, y: -45, scale: 1.1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute', left: '15%', right: '15%',
                            background: 'var(--gradient-primary)', color: 'white',
                            padding: '0.2rem 0.5rem', borderRadius: '10px',
                            fontSize: '0.75rem', fontWeight: 900,
                            boxShadow: 'var(--shadow-md)',
                            zIndex: 10
                          }}
                        >
                          🔥 +100 XP!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem', animation: streakClaimed ? 'bounce 1s infinite' : 'pulse 2s infinite' }}>🔥</div>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#FF9100' }}>{streakCount} Days</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>ACTIVE STREAK</div>
                  </motion.div>

                  <div style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>⭐</div>
                    <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#FFD600' }}>{streakClaimed ? '2,550' : '2,450'} XP</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL POINTS</div>
                  </div>
                </div>

                <button
                  onClick={handleClaimStreak}
                  disabled={streakClaimed}
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 14,
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: streakClaimed ? 'rgba(0, 230, 118, 0.12)' : 'var(--gradient-primary)',
                    border: 'none',
                    borderBottom: streakClaimed ? 'none' : '3px solid var(--primary-dark)',
                    color: streakClaimed ? '#00E676' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: streakClaimed ? 'none' : '0 4px 15px rgba(255, 107, 0, 0.2)',
                    cursor: streakClaimed ? 'default' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  {streakClaimed ? (
                    <>
                      <CheckCircle size={14} /> Daily Streak Reward Secured!
                    </>
                  ) : (
                    <>
                      ⚡ Claim Today's Streak Reward
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Teacher Preview */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{
                background: 'var(--gradient-card)',
                border: '2px solid var(--border)',
                borderRadius: 32,
                padding: '2.5rem',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>👨‍🏫</span>
                <span style={{ padding: '0.25rem 0.625rem', background: '#7C4DFF20', color: '#7C4DFF', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800 }}>TEACHER DASHBOARD</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem' }}>Teacher Management Console</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                Allows teachers to design manual exam structures, invite students via code tags, track group pass-rates, and export detailed reports.
              </p>
              {/* Graphic */}
              <div style={{ padding: '1rem', borderRadius: 18, background: 'var(--bg-glass)', border: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800 }}>
                  <span>Class Average Accuracy</span>
                  <span style={{ color: '#00E676' }}>84.5%</span>
                </div>
                <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '84.5%', background: '#00E676', borderRadius: 3 }} />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Daily Challenges (Duolingo Gamification Style) ────── */}
      <section style={{ padding: '7rem 0', background: 'var(--bg-glass)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem', display: 'flex', justifyContent: 'center' }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{
              width: '100%', maxWidth: 750,
              background: 'linear-gradient(135deg, rgba(255,214,0,0.15), rgba(124,77,255,0.06))',
              border: '2px solid rgba(255,214,0,0.4)',
              borderRadius: 32,
              padding: '3rem 2.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
            <div style={{ position: 'absolute', top: -15, left: -15, fontSize: '3rem', opacity: 0.15 }}>⚡</div>
            <div style={{ position: 'absolute', bottom: -15, right: -15, fontSize: '3rem', opacity: 0.15 }}>🔥</div>
            
            <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', background: '#FBC02D20', color: '#FBC02D', border: '1.5px solid #FBC02D40', borderRadius: 20, fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              ⚡ DAILY CHALLENGE
            </div>
            
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Complete & Earn <span style={{ color: '#FBC02D' }}>+150 XP</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem', fontWeight: 500 }}>
              Solve 5 hard-difficulty DBMS questions today to maintain your streak and secure the Daily Booster Badge!
            </p>
            
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.875rem 2rem', borderRadius: 16, fontWeight: 800, textDecoration: 'none', background: 'var(--gradient-secondary)', border: 'none', color: '#1A0D3F', boxShadow: '0 6px 20px rgba(255,214,0,0.25)' }}>
              Accept Challenge ⚔️
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Leaderboard Section (podium esport animation) ────── */}
      <section style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)', position: 'relative' }}>
        {/* Spotlighting design blob */}
        <div className="glow-blob" style={{ width: 300, height: 300, background: 'rgba(255, 64, 129, 0.05)', top: '10%', left: '10%' }} />
        
        <div className="container" style={{ padding: '0 1.5rem', position: 'relative', zIndex: 2 }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#FF408115', color: '#FF4081',
              border: '1.5px solid #FF408140', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>🏆 GLOBAL RANKS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Hall of <span className="gradient-text">Champions</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 2.5rem', fontSize: '1.05rem', fontWeight: 500 }}>
              Compete globally or scale the weekly charts. The top three scorers claim premium badges on their public student profiles.
            </p>

            {/* Leaderboard Tab Switcher */}
            <div style={{ 
              display: 'inline-flex', 
              background: 'var(--bg-glass)', 
              border: '2px solid var(--border)', 
              borderRadius: 20, 
              padding: '0.35rem',
              gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {[
                { id: 'weekly', label: '⚡ Weekly Arena' },
                { id: 'all-time', label: '👑 All-Time Legends' },
                { id: 'squad', label: '🎮 Squad Battle' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { triggerClick(); setLeaderboardTab(tab.id); }}
                  className="btn btn-ghost btn-sm"
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 14,
                    background: leaderboardTab === tab.id ? 'var(--primary)' : 'transparent',
                    border: 'none',
                    color: leaderboardTab === tab.id ? 'white' : 'var(--text-secondary)',
                    fontWeight: 800,
                    boxShadow: leaderboardTab === tab.id ? '0 4px 12px rgba(255, 107, 0, 0.25)' : 'none',
                    transition: 'all 0.25s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Podium layout */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            
            {/* Rank 2 (Silver) */}
            {currentRankings[1] && (
              <motion.div 
                layout
                key={`${leaderboardTab}-rank-2-${currentRankings[1].name}`}
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ type: 'spring', damping: 15 }}
                style={{
                  width: 200, padding: '2rem 1.5rem 1.5rem', background: 'var(--gradient-card)', 
                  border: currentRankings[1].isOwn ? '2.5px solid var(--primary)' : '2px solid var(--border)',
                  borderRadius: '24px 24px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: currentRankings[1].isOwn ? 'var(--shadow-glow-sm)' : 'var(--shadow-sm)',
                  position: 'relative'
                }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥈</span>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{currentRankings[1].name}</h4>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-light)', marginTop: '0.25rem' }}>{currentRankings[1].score.toLocaleString()} pts</span>
                <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'var(--bg-glass)', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--border)' }}>RANK #2</div>
              </motion.div>
            )}

            {/* Rank 1 (Gold) */}
            {currentRankings[0] && (
              <motion.div 
                layout
                key={`${leaderboardTab}-rank-1-${currentRankings[0].name}`}
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ type: 'spring', damping: 12 }}
                style={{
                  width: 220, padding: '2.5rem 1.5rem 1.5rem', background: 'var(--gradient-card)', 
                  border: '3.5px solid #FFD600',
                  borderRadius: '28px 28px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: '0 12px 30px rgba(255, 214, 0, 0.25)',
                  position: 'relative'
                }}>
                {/* Crown effect */}
                <div style={{ position: 'absolute', top: '-18px', fontSize: '1.5rem' }}>👑</div>
                <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥇</span>
                <h4 style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{currentRankings[0].name}</h4>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFD600', marginTop: '0.25rem' }}>{currentRankings[0].score.toLocaleString()} pts</span>
                <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'rgba(255,214,0,0.15)', color: '#FFD600', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1.5px solid rgba(255,214,0,0.3)' }}>RANK #1</div>
              </motion.div>
            )}

            {/* Rank 3 (Bronze) */}
            {currentRankings[2] && (
              <motion.div 
                layout
                key={`${leaderboardTab}-rank-3-${currentRankings[2].name}`}
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ type: 'spring', damping: 15 }}
                style={{
                  width: 200, padding: '1.75rem 1.5rem 1.5rem', background: 'var(--gradient-card)', 
                  border: currentRankings[2].isOwn ? '2.5px solid var(--primary)' : '2px solid var(--border)',
                  borderRadius: '24px 24px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  boxShadow: currentRankings[2].isOwn ? 'var(--shadow-glow-sm)' : 'var(--shadow-sm)',
                  position: 'relative'
                }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥉</span>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{currentRankings[2].name}</h4>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FF4081', marginTop: '0.25rem' }}>{currentRankings[2].score.toLocaleString()} pts</span>
                <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'var(--bg-glass)', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--border)' }}>RANK #3</div>
              </motion.div>
            )}

          </div>

          {/* Leaderboard Table List (Ranks 4+) */}
          {currentRankings.length > 3 && (
            <motion.div 
              layout
              style={{
                maxWidth: 640,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border)',
                borderRadius: 24,
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {currentRankings.slice(3).map((item, idx) => (
                <motion.div
                  layout
                  key={item.name}
                  whileHover={{ x: 4, background: 'rgba(255,107,0,0.04)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: 14,
                    background: item.isOwn ? 'rgba(255, 107, 0, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                    border: `1px solid ${item.isOwn ? 'var(--primary)' : 'var(--border)'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 900, 
                      color: 'var(--text-muted)',
                      width: 20
                    }}>#{item.rank}</span>
                    <span style={{ fontSize: '1.1rem' }}>{item.badge}</span>
                    <span style={{ 
                      fontWeight: 800, 
                      fontSize: '0.9rem',
                      color: item.isOwn ? 'var(--primary-light)' : 'var(--text-primary)'
                    }}>{item.name}</span>
                  </div>
                  <span style={{ 
                    fontWeight: 900, 
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)'
                  }}>{item.score.toLocaleString()} pts</span>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* ── Testimonials Section ───────────────────────────── */}
      <section style={{ padding: '7rem 0', background: 'var(--bg-glass)', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#00E67615', color: '#00E676',
              border: '1.5px solid #00E67640', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>💖 STUDENT LOVE</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Hear from our <span style={{ color: 'var(--primary)' }}>QuizVersers</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Join thousands of engineering, medical, and competitive exam students scaling their metrics.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { text: "“The AI quiz generator is ridiculously good. I entered 'Organic Chemistry isomerism' and it spat out NEET-level questions in 5 seconds!”", name: "Aarav Mehta", role: "Medical Student" },
              { text: "“Real-time multiplayer lobbies are perfect for test preparation with my study circle. It makes solving GATE math algorithms genuinely fun.”", name: "Simran Kaur", role: "Engineering Student" },
              { text: "“I maintained a 14-day streak and saw a huge boost in my accuracy graphs. The personalized AI feedback is like having a private tutor.”", name: "Simba Davis", role: "Competitive Aspirant" }
            ].map((t, idx) => (
              <motion.div key={idx} className="glass-card" style={{
                padding: '2.25rem', borderRadius: 24, border: '2px solid var(--border)', background: 'var(--gradient-card)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', boxShadow: 'var(--shadow-sm)'
              }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text-primary)', fontWeight: 600 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '0.85rem' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <h5 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.name}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800 }}>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Section (Bento layout) ─────────────────────── */}
      <section style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#00B0FF15', color: '#00B0FF',
              border: '1.5px solid #00B0FF40', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>📚 KNOWLEDGE HUB</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Read our <span style={{ color: '#00B0FF' }}>Academic Blog</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Stay updated with top study strategies, AI learning techniques, and tech tutorials.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { title: "How to Hack Your Attention Span: A Duolingo Vibe Study Guide", desc: "Gamifying your daily revision loops is proven to boost recall by up to 40%.", date: "May 24, 2026", read: "4 min read" },
              { title: "Demystifying Google Gemini 2.5 Flash for Adaptive Learning", desc: "Understanding the neural token systems that create adaptive MCQ questions.", date: "May 18, 2026", read: "6 min read" },
              { title: "Top 5 Strategies to Crack JEE & NEET Without Overburn", desc: "Practical timetables, concept maps, and smart revision practices.", date: "May 12, 2026", read: "5 min read" }
            ].map((blog, idx) => (
              <motion.div key={idx} className="glass-card" onMouseMove={handleMouseMove} style={{
                borderRadius: 24, border: '2px solid var(--border)', background: 'var(--gradient-card)', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', height: '100%',
                boxShadow: 'var(--shadow-sm)'
              }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <span>{blog.date}</span>
                    <span>• {blog.read}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{blog.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500 }}>{blog.desc}</p>
                </div>
                <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-light)' }}>Read Article</span>
                  <ChevronRight size={16} style={{ color: 'var(--primary-light)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Premium CTA Section ────────────────────────────── */}
      <section style={{ padding: '7rem 0', position: 'relative' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(124,77,255,0.22), rgba(255,64,129,0.06))',
              border: '2.5px solid rgba(124,77,255,0.4)',
              borderRadius: 36,
              padding: '6rem 2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div className="glow-blob" style={{ width: 450, height: 450, background: 'rgba(124,77,255,0.25)', top: -150, left: '50%', transform: 'translateX(-50%)' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 64, marginBottom: '1rem' }}>🎓</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
                  Ready to <span style={{ color: 'var(--primary)' }}>dominate</span> your exams?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: 520, margin: '0 auto 2.5rem', fontWeight: 500 }}>
                  Join 50,000+ top-ranking students learning smarter with the most beautiful EdTech platform on earth.
                </p>
                <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: 18, fontSize: '1.1rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 30px rgba(124,77,255,0.35)' }}>
                  Start Learning for Free ⚡
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '2.5px solid var(--border)', padding: '4rem 2rem 3rem', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white'
              }}>⚡</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>
                Quiz<span style={{ color: 'var(--primary)' }}>Verse</span> AI
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {['Home', 'Categories', 'Leaderboard', 'Multiplayer', 'Dashboard'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                   onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 800 }}>
              © 2026 QuizVerse AI. Designed with premium educational aesthetics. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>🐦</span>
              <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>💬</span>
              <span style={{ fontSize: '1.2rem', cursor: 'pointer' }}>💼</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
