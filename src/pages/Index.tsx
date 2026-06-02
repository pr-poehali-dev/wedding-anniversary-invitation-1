import { useRef } from 'react';
import Block from '@/components/wedding/Block';
import RsvpForm from '@/components/wedding/RsvpForm';
import MusicPlayer, { type MusicPlayerHandle } from '@/components/wedding/MusicPlayer';

const PHOTO_MAIN = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/bucket/52dff103-8c40-4c0b-ad10-2d638fffa7f0.jpg';
const PHOTO_1 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/bucket/14c685f4-2682-47ee-b642-4aaf05f8ab3a.jpg';
const PHOTO_2 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/bucket/edeaffe4-a385-49e5-bad5-5ae803ae6696.jpg';
const PHOTO_3 = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/bucket/2e43721b-2d98-4819-939f-add8445d0443.jpg';

const ALL_PHOTOS = [PHOTO_MAIN, PHOTO_1, PHOTO_2, PHOTO_3];

export default function Index() {
  const musicRef = useRef<MusicPlayerHandle>(null);

  const handlePageClick = () => {
    musicRef.current?.handlePageClick();
  };

  return (
    <div onClick={handlePageClick} style={{ background: '#0e0e0e', fontFamily: "'Cormorant Garamond', serif" }}>
      <MusicPlayer ref={musicRef} />

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
          }}>26 сентября 2026 · 17:00</p>
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
            Сбор с 16:30<br />
            Начало в 17:00
          </p>
        </div>
      </Block>

      {/* BLOCK 4 — RSVP */}
      <Block photoSrc={PHOTO_3} photoLeft={false}>
        <RsvpForm photos={ALL_PHOTOS} />
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
