// Spinner component
export default function Spinner({ size = 'md', color = 'var(--primary)' }) {
  const sizes = { sm: 20, md: 32, lg: 48, xl: 64 };
  const s = sizes[size] || 32;
  return (
    <div style={{ width: s, height: s, flexShrink: 0 }}>
      <svg viewBox="0 0 50 50" style={{ animation: 'spin 0.8s linear infinite', width: '100%', height: '100%' }}>
        <circle cx="25" cy="25" r="20" fill="none" stroke={color} strokeWidth="4"
          strokeDasharray="80 40" strokeLinecap="round" />
      </svg>
    </div>
  );
}
