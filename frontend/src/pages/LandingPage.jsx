// ============================================================
// QuizVerse AI — Premium Gen-Z Playful Landing Page
// ============================================================
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, Moon, Zap, Brain, Users, Trophy, ChevronRight, Star, 
  ArrowRight, Shield, BookOpen, Clock, Heart, Award, Sparkles, Plus, Play, CheckCircle
} from 'lucide-react';

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
  { name: 'Aptitude', icon: '🧮', desc: 'Logical, Math, Quant', color: '#FFD600', gradient: 'linear-gradient(135deg, rgba(255, 214, 0, 0.15), rgba(255, 234, 0, 0.05))', tag: 'Brainiacs' },
  { name: 'UPSC & Civil', icon: '🏛️', desc: 'History, Polity, GK', color: '#2979FF', gradient: 'linear-gradient(135deg, rgba(41, 121, 255, 0.15), rgba(124, 77, 255, 0.05))', tag: 'Officers' },
  { name: 'NEET Special', icon: '🧬', desc: 'Biology, Genetics, Physio', color: '#00E676', gradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.15), rgba(255, 64, 129, 0.05))', tag: 'Top Ranks' },
  { name: 'JEE Special', icon: '📐', desc: 'Physics, Calculus, Chem', color: '#7C4DFF', gradient: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15), rgba(0, 176, 255, 0.05))', tag: 'Main & Adv' },
  { name: 'Cloud Computing', icon: '☁️', desc: 'AWS, Azure, DevOps', color: '#9C27B0', gradient: 'linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(124, 77, 255, 0.05))', tag: 'Architects' },
];

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-sans)', color: 'var(--text-primary)', transition: 'background 0.4s' }}>
      
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.25rem 2rem',
        background: isDark ? 'rgba(12, 10, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" style={{ padding: '0.45rem', borderRadius: 10 }}>
            {isDark ? <Sun size={20} style={{ color: '#FFD600' }} /> : <Moon size={20} style={{ color: '#7C4DFF' }} />}
          </button>
          <Link to="/login" style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.625rem 1.5rem', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 6px 20px rgba(124, 77, 255, 0.25)' }}>Get Started</Link>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        paddingTop: '120px',
        paddingBottom: '80px',
        overflow: 'hidden',
      }}>
        {/* Floating Shapes and Abstract Blobs */}
        <div className="glow-blob animate-float" style={{ width: 550, height: 550, background: 'rgba(124, 77, 255, 0.18)', top: -150, left: -150 }} />
        <div className="glow-blob animate-float" style={{ width: 450, height: 450, background: 'rgba(255, 64, 129, 0.1)', bottom: -100, right: -150, animationDelay: '3s' }} />
        <div className="glow-blob" style={{ width: 350, height: 350, background: 'rgba(255, 235, 59, 0.08)', top: '25%', right: '15%', animationDelay: '1.5s' }} />
        
        {/* Cute hand-drawn circles and stickers */}
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', top: '15%', left: '10%', fontSize: '3rem', zIndex: 2 }}>🎓</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', bottom: '25%', left: '8%', fontSize: '3.5rem', zIndex: 2, animationDelay: '2s' }}>🩺</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', top: '20%', right: '8%', fontSize: '3.2rem', zIndex: 2, animationDelay: '1s' }}>🚀</motion.div>
        <motion.div variants={floatAnimation} animate="animate" style={{ position: 'absolute', bottom: '15%', right: '12%', fontSize: '2.8rem', zIndex: 2, animationDelay: '2.5s' }}>🤖</motion.div>

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
                {/* Mock quiz UI */}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ background: '#7C4DFF20', color: '#7C4DFF', border: '1px solid #7C4DFF40', fontSize: '0.75rem', fontWeight: 800 }}>AI GEN</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700 }}>Category: Computer Science</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#FF174415', border: '1.5px solid #FF174440', padding: '0.3rem 0.75rem', borderRadius: 20 }}>
                      <span style={{ color: '#FF1744', fontSize: '0.85rem', fontWeight: 800 }}>⏱ 24s left</span>
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
                    ].map((opt, i) => (
                      <div key={i} className={`quiz-option ${opt.select ? 'selected' : ''}`} style={{
                        padding: '1rem 1.25rem', borderRadius: 16, border: '2px solid',
                        borderColor: opt.select ? 'var(--primary)' : 'var(--border)',
                        background: opt.select ? 'rgba(124, 77, 255, 0.1)' : 'var(--bg-glass)',
                        display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer'
                      }}>
                        <span style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: opt.select ? 'var(--primary)' : 'var(--border)',
                          color: opt.select ? 'white' : 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem'
                        }}>{opt.key}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: opt.select ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{opt.val}</span>
                      </div>
                    ))}
                  </div>
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
              <motion.div key={i} className="glass-card" style={{
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
      <section style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)' }}>
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
                position: 'relative'
              }}>
              <div style={{ position: 'absolute', top: -15, right: -15, width: 50, height: 50, borderRadius: '50%', background: '#7C4DFF20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '1.25rem' }}>AI Setup Panel</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.875rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>ENTER TOPIC</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Anatomy & Neuropathology</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1, padding: '0.875rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>DIFFICULTY</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FF1744' }}>🔴 Hard Mode</div>
                  </div>
                  <div style={{ flex: 1, padding: '0.875rem', borderRadius: 14, background: 'var(--bg-glass)', border: '1.5px solid var(--border)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>QUESTIONS</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>10 MCQs</div>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.875rem', borderRadius: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} disabled>
                  <Sparkles size={16} /> Generating AI Quiz...
                </button>
              </div>
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
                background: 'linear-gradient(135deg, rgba(20,18,51,0.9), rgba(12,10,31,0.9))',
                border: '2px solid #FF910050',
                borderRadius: 28,
                padding: '2rem',
                boxShadow: 'var(--shadow-lg)'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1.5px solid #FF910020', paddingBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#FF9100', fontSize: '0.9rem' }}>🎮 ROOM LOBBY // active</span>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E676' }} />)}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { name: 'Rohan (Host)', score: 320, isHost: true, isReady: true },
                  { name: 'Alex (Coder)', score: 280, isHost: false, isReady: true },
                  { name: 'Sneha (Med)', score: 140, isHost: false, isReady: false },
                ].map((player, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: 'white' }}>
                      {player.name[0]}
                    </div>
                    <div style={{ flex: 1, fontWeight: 700, fontSize: '0.9rem' }}>{player.name}</div>
                    <span style={{ fontWeight: 800, color: '#FF9100', fontSize: '0.9rem' }}>{player.score} pts</span>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: player.isReady ? '#00E676' : '#FF1744' }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }} disabled>🚪 Leave</button>
                <button className="btn btn-primary" style={{ flex: 2, padding: '0.75rem', background: 'linear-gradient(135deg,#FF9100,#FF3D00)', border: 'none', color: 'white', fontWeight: 800 }} disabled>🏁 Start (Ready)</button>
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
              {/* Graphic */}
              <div style={{ padding: '1rem', borderRadius: 18, background: 'var(--bg-glass)', border: '1.5px solid var(--border)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔥</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF9100' }}>7 Days</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>ACTIVE STREAK</div>
                </div>
                <div style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⭐</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFD600' }}>2,450 XP</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>TOTAL POINTS</div>
                </div>
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
      <section style={{ padding: '7rem 0', borderBottom: '2px solid var(--border)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', padding: '0.4rem 1rem', background: '#FF408115', color: '#FF4081',
              border: '1.5px solid #FF408140', borderRadius: 20, fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem'
            }}>🏆 GLOBAL RANKS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Hall of <span className="gradient-text">Champions</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', fontSize: '1.05rem', fontWeight: 500 }}>
              Compete globally or scale the weekly charts. The top three scorers claim premium badges on their public student profiles.
            </p>
          </div>

          {/* Podium layout */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            
            {/* Rank 2 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{
                width: 200, padding: '2rem 1.5rem 1.5rem', background: 'var(--gradient-card)', border: '2px solid var(--border)',
                borderRadius: '24px 24px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥈</span>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Alex Chen</h4>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C7C3FA', marginTop: '0.25rem' }}>4,820 pts</span>
              <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'var(--bg-glass)', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--border)' }}>RANK #2</div>
            </motion.div>

            {/* Rank 1 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{
                width: 220, padding: '2.5rem 1.5rem 1.5rem', background: 'var(--gradient-card)', border: '3.5px solid #FFD600',
                borderRadius: '28px 28px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
                boxShadow: 'var(--shadow-lg)'
              }}>
              <span style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🥇</span>
              <h4 style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-primary)' }}>Rohan Sharma</h4>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFD600', marginTop: '0.25rem' }}>5,240 pts</span>
              <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'rgba(255,214,0,0.15)', color: '#FFD600', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1.5px solid rgba(255,214,0,0.3)' }}>RANK #1</div>
            </motion.div>

            {/* Rank 3 */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              style={{
                width: 200, padding: '1.75rem 1.5rem 1.5rem', background: 'var(--gradient-card)', border: '2px solid var(--border)',
                borderRadius: '24px 24px 16px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
              <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🥉</span>
              <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>Sara Kumar</h4>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C7C3FA', marginTop: '0.25rem' }}>4,150 pts</span>
              <div style={{ marginTop: '1.5rem', padding: '0.3rem 1rem', background: 'var(--bg-glass)', borderRadius: 10, fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--border)' }}>RANK #3</div>
            </motion.div>

          </div>
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
              <motion.div key={idx} className="glass-card" style={{
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
