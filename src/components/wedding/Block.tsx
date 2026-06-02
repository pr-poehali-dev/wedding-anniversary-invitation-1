import { useState, useEffect, useRef } from 'react';

export function useInView(threshold = 0.15) {
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

export default function Block({ photoSrc, photoLeft, children }: BlockProps) {
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
