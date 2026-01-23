import React from 'react';

interface ScientificPillProps {
  isOpened: boolean;
  isSettled: boolean;
  isVisible: boolean;
}

const ScientificPill: React.FC<ScientificPillProps> = ({ isOpened, isSettled, isVisible }) => {
  // During intro it's diagonal (45deg), settled state is horizontal (handled via wrapper rotation)
  const innerRotation = isSettled ? 0 : 45;

  return (
    <div className={`pill-wrapper ${isVisible ? 'pill-visible' : ''} ${isSettled ? 'pill-settled' : ''} ${isOpened ? 'pill-open' : ''} w-48 h-48 flex items-center justify-center`}>
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="pillGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0FA3B1" />
            <stop offset="100%" stopColor="#1B9AAA" />
          </linearGradient>
          <linearGradient id="pillGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F4C75" />
            <stop offset="100%" stopColor="#0FA3B1" />
          </linearGradient>
          <filter id="pillShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="14" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <g 
          className="pill-inner-group" 
          transform={`rotate(${innerRotation} 100 100)`} 
          filter="url(#pillShadow)"
        >
          {/* Top Half (The Cap) */}
          <g className="pill-half-top">
            <path d="M60,100 A40,40 0 0,1 140,100 L140,60 A40,40 0 0,0 60,60 Z" fill="url(#pillGrad1)" />
            <circle cx="85" cy="80" r="2" fill="white" opacity="0.3" />
            {/* Suggestion of activity inside */}
            <circle cx="100" cy="75" r="8" fill="white" opacity="0.05" className="animate-pulse" />
          </g>
          
          {/* Bottom Half (The Base) */}
          <g className="pill-half-bottom">
            <path d="M60,100 L140,100 L140,140 A40,40 0 0,1 60,140 Z" fill="url(#pillGrad2)" />
            <circle cx="115" cy="120" r="2" fill="white" opacity="0.2" />
          </g>
        </g>
      </svg>
      
      {/* Background glow focal point during center focus */}
      {isVisible && !isSettled && (
        <div className="absolute inset-0 bg-teal-400/20 blur-[60px] rounded-full -z-10 animate-pulse"></div>
      )}
    </div>
  );
};

export default ScientificPill;