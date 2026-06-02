import { useState, useEffect } from 'react';

const TARGET = new Date('2026-09-26T17:00:00');

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Pad({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ textAlign: 'center', minWidth: '64px' }}>
      <div style={{
        fontSize: 'clamp(40px, 7vw, 72px)',
        fontWeight: 300,
        color: '#f5f5f5',
        lineHeight: 1,
        letterSpacing: '0.02em',
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <div style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '10px',
        letterSpacing: '0.25em',
        color: '#666',
        textTransform: 'uppercase',
        marginTop: '8px',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      background: '#0a0a0a',
      minHeight: '40vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '11px',
        letterSpacing: '0.3em',
        color: '#555',
        textTransform: 'uppercase',
        marginBottom: '48px',
      }}>До встречи осталось</p>

      <div style={{
        display: 'flex',
        gap: 'clamp(16px, 4vw, 48px)',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        <Pad value={time.days} label="дней" />
        <div style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: 'rgba(255,255,255,0.2)', lineHeight: 1, paddingTop: '4px', fontFamily: "'Cormorant Garamond', serif" }}>·</div>
        <Pad value={time.hours} label="часов" />
        <div style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: 'rgba(255,255,255,0.2)', lineHeight: 1, paddingTop: '4px', fontFamily: "'Cormorant Garamond', serif" }}>·</div>
        <Pad value={time.minutes} label="минут" />
        <div style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: 'rgba(255,255,255,0.2)', lineHeight: 1, paddingTop: '4px', fontFamily: "'Cormorant Garamond', serif" }}>·</div>
        <Pad value={time.seconds} label="секунд" />
      </div>

      <p style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: '11px',
        letterSpacing: '0.2em',
        color: '#444',
        textTransform: 'uppercase',
        marginTop: '48px',
      }}>26 сентября 2026 · 17:00</p>
    </div>
  );
}
