import React, { useState, useRef } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Initial Study / Sketch',
  afterLabel = 'Completed Masterwork',
  className = ''
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSliderPosition(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSliderPosition(prev => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Compare artwork stages before and after"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(sliderPosition)}
      onKeyDown={handleKeyDown}
      onMouseDown={e => {
        isDragging.current = true;
        handleMove(e.clientX);
      }}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className={`relative overflow-hidden rounded-xl select-none cursor-ew-resize border border-white/15 shadow-2xl ${className}`}
    >
      <img
        src={afterImage}
        alt={afterLabel}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover pointer-events-none"
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none filter sepia contrast-125"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
        />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-black/80 text-xs uppercase tracking-wider text-[#d4af37] font-semibold border border-white/15">
          {beforeLabel}
        </span>
      </div>

      <span className="absolute top-3 right-3 px-3 py-1 rounded-md bg-black/80 text-xs uppercase tracking-wider text-[#d8cbb7] font-semibold border border-white/15">
        {afterLabel}
      </span>

      <div
        className="absolute top-0 bottom-0 w-0.5 bg-[#d4af37] cursor-ew-resize shadow-[0_0_12px_rgba(212,175,55,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#111116] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3m0 0l3 3m-3-3h14m-3-3l3 3m0 0l-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
};
