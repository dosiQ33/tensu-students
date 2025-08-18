import React, { useEffect, useRef, useState } from 'react';

type SliderCheckInProps = {
  enabled: boolean;
  onConfirm: () => void;
  label?: string;
  disabledHint?: string;
};

export const SliderCheckIn: React.FC<SliderCheckInProps> = ({ enabled, onConfirm, label = 'Slide to Check-In', disabledHint }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent | MouseEvent) => {
      const container = containerRef.current;
      const knob = knobRef.current;
      if (!container || !knob) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      setProgress(x / rect.width);
      e.preventDefault();
    };
    const end = () => setDragging(false);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchend', end);
    window.addEventListener('mouseup', end);
    return () => {
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('mousemove', onMove as any);
      window.removeEventListener('touchend', end as any);
      window.removeEventListener('mouseup', end as any);
    };
  }, [dragging]);

  useEffect(() => {
    if (!dragging && progress >= 0.98) {
      onConfirm();
      setTimeout(() => setProgress(0), 200);
    }
  }, [dragging, progress, onConfirm]);

  useEffect(() => {
    if (!enabled) setProgress(0);
  }, [enabled]);

  const start = () => {
    if (!enabled) return;
    setDragging(true);
    window.Telegram?.WebApp?.HapticFeedback?.selectionChanged();
  };

  return (
    <div className="w-full select-none">
      <div ref={containerRef} className={`relative h-14 rounded-full overflow-hidden border ${enabled ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-200 opacity-70'} touch-none`}
        onMouseDown={start}
        onTouchStart={start}
      >
        <div className="absolute inset-y-0 left-0 bg-green-100" style={{ width: `${progress * 100}%`, transition: dragging ? 'none' : 'width 200ms ease' }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-sm font-medium ${enabled ? 'text-gray-700' : 'text-gray-400'}`}>
            {enabled ? label : (disabledHint || 'Check-in unavailable')}
          </span>
        </div>
        <div ref={knobRef} className={`absolute top-1 left-1 h-12 w-12 rounded-full flex items-center justify-center shadow-md ${enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`} style={{ transform: `translateX(${progress * ((containerRef.current?.clientWidth || 0) - 56)}px)` }}>
          ➤
        </div>
      </div>
      <div style={{ height: '12px' }} />
    </div>
  );
};

export default SliderCheckIn;


