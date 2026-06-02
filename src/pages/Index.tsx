import { useState, useEffect, useRef, useCallback } from 'react';

const RSVP_URL = 'https://functions.poehali.dev/0fcb315f-5249-458d-a19c-400faf0409d6';

const PHOTO_MAIN = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/files/fa0f3bbf-4509-4a48-9c32-f3f1e7824421.jpg';
const PHOTO_1 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/files/61448095-4160-45f9-b430-6adf876885f0.jpg';
const PHOTO_2 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/files/df448562-2a73-4f48-ad7d-e5a6e9878c00.jpg';
const PHOTO_3 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/files/bfdcead5-c612-498a-9a97-bbefbe53127b.jpg';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

interface BlockProps {
  photoSrc: string;
  photoLeft: boolean;
  children: React.ReactNode;
}

function Block({ photoSrc, photoLeft, children }: BlockProps) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: photoLeft ? 'row' : 'row-reverse',
        minHeight: '100vh',
        transition: 'opacity 0.9s ease, transform 0.9s ease',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
      }}
      className="wedding-block"
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <img
          src={photoSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(100%) brightness(0.75)',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%)',
          pointerEvents: 'none',
        }} />
      </div>
      <div style={{
        flex: 1,
        background: '#0e0e0e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 56px',
      }}>
        {children}
      </div>
    </div>
  );
}

export default function Index() {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [form, setForm] = useState({
    name: '',
    attending: '',
    drinks: [] as string[],
    meal: '',
  });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wedding_rsvp');
    if (saved) {
      try { setForm(JSON.parse(saved)); setSubmitted(true); } catch (_e) { /* invalid saved data */ }
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.loop = true;
    const tryPlay = async () => {
      try {
        await audio.play();
        setMusicPlaying(true);
      } catch {
        setShowMusicHint(true);
      }
    };
    tryPlay();
  }, []);

  const handlePageClick = useCallback(() => {
    if (showMusicHint && audioRef.current) {
      audioRef.current.play().then(() => {
        setMusicPlaying(true);
        setShowMusicHint(false);
      }).catch(() => {});
    }
  }, [showMusicHint]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => {
        setMusicPlaying(true);
        setShowMusicHint(false);
      }).catch(() => {});
    }
  };

  const toggleDrink = (drink: string) => {
    setForm(f => ({
      ...f,
      drinks: f.drinks.includes(drink) ? f.drinks.filter(d => d !== drink) : [...f.drinks, drink],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setFormError('Пожалуйста, введите имя и фамилию'); return; }
    if (!form.attending) { setFormError('Пожалуйста, укажите присутствие'); return; }
    if (form.attending === 'yes' && !form.meal) { setFormError('Пожалуйста, выберите блюдо'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      await fetch(RSVP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      localStorage.setItem('wedding_rsvp', JSON.stringify(form));
      setSubmitted(true);
      const msg = form.attending === 'yes'
        ? `${form.name.split(' ')[0]}, спасибо, ждём!`
        : `${form.name.split(' ')[0]}, жаль, увидимся в другой раз`;
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch {
      setFormError('Ошибка отправки. Попробуйте снова.');
    }
    setSubmitting(false);
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    letterSpacing: '0.18em',
    color: '#888',
    textTransform: 'uppercase' as const,
    marginBottom: '10px',
    display: 'block',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '2px',
    padding: '12px 16px',
    color: '#f0f0f0',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const radioStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap' as const,
  };

  return (
    <div onClick={handlePageClick} style={{ background: '#0e0e0e', fontFamily: "'Cormorant Garamond', serif" }}>
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* BLOCK 1 */}
      <Block photoSrc={PHOTO_MAIN} photoLeft={true}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: '#aaa',
            marginBottom: '28px',
            textTransform: 'uppercase',
          }}>Десять лет</p>
          <h1 style={{
            fontSize: 'clamp(56px, 8vw, 96px)',
            fontWeight: 300,
            color: '#f5f5f5',
            lineHeight: 1.05,
            letterSpacing: '0.05em',
            margin: 0,
          }}>
            Егор<br />
            <span style={{ fontStyle: 'italic' }}>и</span><br />
            Диана
          </h1>
          <div style={{
            width: '48px',
            height: '1px',
            background: 'rgba(255,255,255,0.3)',
            margin: '32px auto',
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: '#ccc',
            textTransform: 'uppercase',
          }}>26 сентября 2026 · 18:00</p>
        </div>
      </Block>

      {/* BLOCK 2 */}
      <Block photoSrc={PHOTO_1} photoLeft={false}>
        <div style={{ maxWidth: 460 }}>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#e8e8e8',
            lineHeight: 1.85,
            fontWeight: 300,
            fontStyle: 'italic',
          }}>
            Десять лет назад мы сказали «Да», глядя друг другу в глаза. Мы не знали, как повернётся жизнь.
          </p>
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            color: '#c0c0c0',
            lineHeight: 1.9,
            fontWeight: 300,
            marginTop: '24px',
          }}>
            Были моменты, когда нам было тяжело. Мы спорили, ошибались, иногда казалось, что мы идём разными дорогами. Но именно в этих испытаниях мы научились ценить то, что имеем.
          </p>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: '#e8e8e8',
            lineHeight: 1.85,
            fontWeight: 300,
            fontStyle: 'italic',
            marginTop: '24px',
          }}>
            Мы выбирали друг друга. Снова и снова.
          </p>
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            color: '#c0c0c0',
            lineHeight: 1.9,
            fontWeight: 300,
            marginTop: '24px',
          }}>
            Эти годы научили нас главному — любить не только в радости, но и в преодолении. Мы стали настоящей семьёй, одним целым.
          </p>
          <p style={{
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            color: '#c0c0c0',
            lineHeight: 1.9,
            fontWeight: 300,
            marginTop: '24px',
          }}>
            26 сентября мы просто хотим быть рядом с теми, кто проходил этот путь с нами. Вы для нас важны.
          </p>
        </div>
      </Block>

      {/* BLOCK 3 */}
      <Block photoSrc={PHOTO_2} photoLeft={true}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}>Место и время</p>
          <h2 style={{
            fontSize: 'clamp(38px, 5vw, 64px)',
            fontWeight: 300,
            color: '#f5f5f5',
            lineHeight: 1.1,
            letterSpacing: '0.03em',
            margin: '0 0 16px',
          }}>Премьер холл</h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.15em',
            color: '#bbb',
            marginBottom: '40px',
            textTransform: 'uppercase',
          }}>Ленина, 58</p>
          <div style={{
            width: '48px',
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
            margin: '0 auto 40px',
          }} />
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.2em',
            color: '#ccc',
            textTransform: 'uppercase',
            lineHeight: 2,
          }}>
            26 сентября 2026<br />
            Сбор с 17:30<br />
            Начало в 18:00
          </p>
        </div>
      </Block>

      {/* BLOCK 4 — RSVP */}
      <Block photoSrc={PHOTO_3} photoLeft={false}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '32px',
          }}>Подтверждение</p>

          {/* Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Имя и фамилия *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ваше имя и фамилия"
            />
          </div>

          {/* Attending */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Присутствие *</label>
            <div style={radioStyle}>
              {['yes', 'no'].map(val => (
                <button
                  key={val}
                  onClick={() => setForm(f => ({ ...f, attending: val, meal: val === 'no' ? '' : f.meal }))}
                  style={{
                    padding: '10px 24px',
                    border: `1px solid ${form.attending === val ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)'}`,
                    background: form.attending === val ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: form.attending === val ? '#f0f0f0' : '#888',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'all 0.2s',
                  }}
                >
                  {val === 'yes' ? 'Да, буду' : 'Не смогу'}
                </button>
              ))}
            </div>
          </div>

          {/* Drinks */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Что буду пить</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Водка', 'Коньяк', 'Белое полусладкое', 'Красное полусладкое'].map(drink => (
                <label key={drink} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '13px',
                  color: '#ccc',
                  letterSpacing: '0.05em',
                }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: `1px solid ${form.drinks.includes(drink) ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'}`,
                    background: form.drinks.includes(drink) ? 'rgba(255,255,255,0.12)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '2px',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }} onClick={() => toggleDrink(drink)}>
                    {form.drinks.includes(drink) && (
                      <span style={{ color: '#f0f0f0', fontSize: '11px', lineHeight: 1 }}>✓</span>
                    )}
                  </span>
                  <span onClick={() => toggleDrink(drink)}>{drink}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Meal — only when attending */}
          {form.attending === 'yes' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Блюдо *</label>
              <div style={radioStyle}>
                {['Мясо', 'Рыба'].map(m => (
                  <button
                    key={m}
                    onClick={() => setForm(f => ({ ...f, meal: m }))}
                    style={{
                      padding: '10px 24px',
                      border: `1px solid ${form.meal === m ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)'}`,
                      background: form.meal === m ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: form.meal === m ? '#f0f0f0' : '#888',
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '12px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: '2px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {formError && (
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              color: '#e08080',
              marginBottom: '16px',
              letterSpacing: '0.05em',
            }}>{formError}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#f0f0f0',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: submitting ? 'not-allowed' : 'pointer',
              borderRadius: '2px',
              transition: 'all 0.25s',
              opacity: submitting ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; }}
          >
            {submitting ? 'Отправляю...' : submitted ? 'Обновить ответ' : 'Отправить ответ'}
          </button>

          {/* Success message */}
          {successMsg && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '2px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '18px',
              color: '#e8e8e8',
              fontStyle: 'italic',
              textAlign: 'center',
              animation: 'fadeIn 0.4s ease',
            }}>
              {successMsg}
            </div>
          )}

          {/* Gallery */}
          <div style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
          }}>
            {[PHOTO_MAIN, PHOTO_1, PHOTO_2, PHOTO_3].map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noopener noreferrer" style={{ display: 'block', overflow: 'hidden', aspectRatio: '1' }}>
                <img
                  src={src}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(100%) brightness(0.7)',
                    transition: 'transform 0.35s ease, filter 0.35s ease',
                    display: 'block',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.85)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%) brightness(0.7)';
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </Block>

      {/* Footer */}
      <div style={{
        background: '#080808',
        padding: '32px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.2em',
          color: '#555',
          textTransform: 'uppercase',
        }}>
          Премьер холл · Ленина, 58 · 26 сентября 2026
        </p>
      </div>

      {/* Music hint */}
      {showMusicHint && (
        <div style={{
          position: 'fixed',
          bottom: '72px',
          right: '24px',
          background: 'rgba(20,20,20,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '12px 18px',
          borderRadius: '4px',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: '#aaa',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          animation: 'fadeIn 0.4s ease',
        }}>
          Нажмите в любом месте для музыки
        </div>
      )}

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(20,20,20,0.88)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#ccc',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '10px 18px',
          cursor: 'pointer',
          borderRadius: '2px',
          backdropFilter: 'blur(8px)',
          zIndex: 101,
          transition: 'all 0.2s',
        }}
      >
        {musicPlaying ? '⏸ Выкл' : '▶ Вкл'}
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .wedding-block {
            flex-direction: column !important;
          }
          .wedding-block > div:first-child {
            min-height: 50vh;
          }
          .wedding-block > div:last-child {
            padding: 48px 28px !important;
          }
        }
        input::placeholder { color: #555; }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}