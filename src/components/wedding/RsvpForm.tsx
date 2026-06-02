import { useState, useEffect } from 'react';

const RSVP_URL = 'https://functions.poehali.dev/0fcb315f-5249-458d-a19c-400faf0409d6';

interface RsvpFormProps {
  photos: string[];
}

export default function RsvpForm({ photos }: RsvpFormProps) {
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
        {photos.map((src, i) => (
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
  );
}
