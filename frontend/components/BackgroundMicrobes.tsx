import React from 'react';

const Microbe: React.FC<{ type: number; size: number; top: string; left: string; delay: string; opacity: number; color: string }> = ({ type, size, top, left, delay, opacity, color }) => {
  const renderShape = () => {
    switch (type % 6) {
      case 0: // Complex flagellated rod
        return (
          <g fill="none" stroke={color} strokeWidth="2.5">
            <rect x="20" y="40" width="60" height="20" rx="10" />
            <path d="M80 45 Q 100 20 110 50 Q 120 80 140 40" strokeWidth="1.5" opacity="0.6" />
            <path d="M80 55 Q 100 80 110 50 Q 120 20 140 60" strokeWidth="1.5" opacity="0.6" />
            <circle cx="35" cy="50" r="3" fill={color} />
          </g>
        );
      case 1: // Nucleated blob
        return (
          <g fill={color}>
            <path d="M30 40 C 10 60 20 90 50 85 C 80 80 95 60 80 30 C 65 10 45 25 30 40" opacity="0.4" />
            <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="4" />
          </g>
        );
      case 2: // Spiky Virus-like
        return (
          <g stroke={color} strokeWidth="2" fill="none">
            <circle cx="50" cy="50" r="22" stroke={color} fill={`${color}22`} />
            {[...Array(16)].map((_, i) => {
              const ang = (i * Math.PI) / 8;
              return (
                <line 
                  key={i} 
                  x1={50 + 22 * Math.cos(ang)} 
                  y1={50 + 22 * Math.sin(ang)} 
                  x2={50 + 40 * Math.cos(ang)} 
                  y2={50 + 40 * Math.sin(ang)} 
                />
              );
            })}
          </g>
        );
      case 3: // Spirillum / Squiggle
        return (
          <path 
            d="M10 50 Q 25 20 40 50 T 70 50 T 100 50" 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        );
      case 4: // Diplo-chain
        return (
          <g fill={color}>
            <circle cx="30" cy="50" r="12" />
            <circle cx="55" cy="50" r="12" />
            <circle cx="42" cy="50" r="4" fill="white" />
          </g>
        );
      case 5: // Star-burst organic
        return (
          <g fill={color}>
            <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" opacity="0.6" />
            <circle cx="50" cy="50" r="8" />
          </g>
        );
      default: return null;
    }
  };

  return (
    <div 
      className="absolute animate-microbe-slow pointer-events-none" 
      style={{ top, left, animationDelay: delay, opacity }}
    >
      <svg width={size} height={size} viewBox="0 0 140 100">
        {renderShape()}
      </svg>
    </div>
  );
};

const BackgroundMicrobes: React.FC = () => {
  const microbes = [
    { type: 0, size: 90, top: '5%', left: '5%', delay: '0s', opacity: 0.15, color: '#0FA3B1' },
    { type: 1, size: 120, top: '15%', left: '75%', delay: '-5s', opacity: 0.2, color: '#0F4C75' },
    { type: 2, size: 80, top: '40%', left: '45%', delay: '-10s', opacity: 0.1, color: '#1B9AAA' },
    { type: 3, size: 130, top: '70%', left: '10%', delay: '-15s', opacity: 0.12, color: '#0FA3B1' },
    { type: 4, size: 100, top: '80%', left: '85%', delay: '-20s', opacity: 0.18, color: '#0F4C75' },
    { type: 5, size: 110, top: '50%', left: '2%', delay: '-2s', opacity: 0.15, color: '#1B9AAA' },
    { type: 0, size: 70, top: '10%', left: '30%', delay: '-25s', opacity: 0.1, color: '#0FA3B1' },
    { type: 2, size: 140, top: '60%', left: '60%', delay: '-12s', opacity: 0.12, color: '#0F4C75' },
    { type: 1, size: 95, top: '30%', left: '90%', delay: '-8s', opacity: 0.14, color: '#0FA3B1' },
    { type: 3, size: 110, top: '85%', left: '35%', delay: '-30s', opacity: 0.1, color: '#1B9AAA' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#fafdfe]">
      {microbes.map((m, i) => <Microbe key={i} {...m} />)}
    </div>
  );
};

export default BackgroundMicrobes;