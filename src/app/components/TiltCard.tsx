import { useRef, useCallback } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function TiltCard({ children, intensity = 12, style = {}, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rX = -y * intensity;
    const rY = x * intensity;
    el.style.transform = `perspective(700px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.025,1.025,1.025)`;
    el.style.transition = 'transform 0.08s ease-out';
  }, [intensity]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    el.style.transition = 'transform 0.8s cubic-bezier(0.23,1,0.32,1)';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ willChange: 'transform', transformStyle: 'preserve-3d', ...style }}>
      {children}
    </div>
  );
}
