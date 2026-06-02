import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

const MUSIC_SRC = 'https://cdn.poehali.dev/projects/9a81503f-12b5-425e-b745-f171500d6f22/bucket/5875f233-ccdf-495a-8d9f-799eaf85bc6e.mp3';

export interface MusicPlayerHandle {
  handlePageClick: () => void;
}

const MusicPlayer = forwardRef<MusicPlayerHandle>((_, ref) => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showMusicHint, setShowMusicHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  useImperativeHandle(ref, () => ({ handlePageClick }), [handlePageClick]);

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

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} loop />

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
    </>
  );
});

MusicPlayer.displayName = 'MusicPlayer';

export default MusicPlayer;
