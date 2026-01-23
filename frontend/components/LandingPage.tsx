import React, { useState, useEffect } from 'react';
import BackgroundMicrobes from './BackgroundMicrobes';
import PostcardStack from './PostcardStack';
import ScientificPill from './ScientificPill';

interface LandingPageProps {
  onCtaClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCtaClick }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    // 1. Initial State: Closed pill pops out into the center prominently
    const t1 = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Was 500

    // 2. Opening Animation: Separates slowly and professionally
    const t2 = setTimeout(() => {
      setIsOpened(true);
    }, 500); // Was 1500

    // 3. Reveal details while split
    const t3 = setTimeout(() => {
      setContentVisible(true);
    }, 800); // Was 2400

    // 4. Closing & Final Position: Rejoin, move up, and settle above heading
    const t4 = setTimeout(() => {
      setIsOpened(false); // Rejoin halves

      // Delay settling slightly to allow closing animation to feel grounded
      setTimeout(() => {
        setIsSettled(true);
      }, 300); // Was 800
    }, 1200); // Was 3800

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <BackgroundMicrobes />

      {/* The Scientific Pill - Orchestrated via wrapper classes in index.html */}
      <ScientificPill
        isVisible={isVisible}
        isOpened={isOpened}
        isSettled={isSettled}
      />

      {/* Main Hero Container */}
      <div className={`container mx-auto px-6 relative z-20 transition-all duration-700 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">

          {/* Left Column: Information (AMR Atlas) */}
          <div className="relative pt-20 lg:pt-0">
            {/* Reduced height space for the pill to settle in */}
            <div className="h-20 w-48 mb-6 md:mb-10"></div>

            <div className="relative z-10">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#0F4C75] leading-none mb-4 tracking-tight">
                AMR Atlas
              </h1>

              <div className="text-lg md:text-xl text-[#547D9A] font-light leading-relaxed mb-10 max-w-lg">
                <p>
                  Antimicrobial resistance occurs when bacteria evolve to survive antibiotics, making infections harder to treat.
                  This platform explores resistance trends and responsible antibiotic use through data-driven insights.
                </p>
              </div>

              <button
                onClick={onCtaClick}
                className="group relative inline-flex items-center justify-center px-10 py-4 bg-[#0FA3B1] text-white font-bold text-lg rounded-full overflow-hidden shadow-xl transition-all duration-300 hover:bg-[#12B4C3] hover:shadow-[0_20px_40px_rgba(15,163,177,0.3)] hover:-translate-y-1 active:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Check Resistance Risk
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Right Column: Visual System (Postcard Stack) */}
          <div className="w-full h-full flex items-center justify-center relative mt-12 lg:mt-0">
            <PostcardStack />

            {/* Visual filler / dot pattern */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] opacity-[0.04] pointer-events-none -z-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dotPatternHero" width="50" height="50" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#0FA3B1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotPatternHero)" />
              </svg>
            </div>

            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-[#0FA3B1]/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LandingPage;