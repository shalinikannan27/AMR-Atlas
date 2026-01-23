import React, { useState, useEffect } from 'react';

import img1 from './GettyImages-944106856.jpg';
import img2 from './Gemini_Generated_Image_bvpqj1bvpqj1bvpq.png';
import img3 from './shutterstock_273641858.webp';

const IMAGES = [
  // 1. Petri dish / bacterial culture
  img1,
  // 2. Antibiotic capsules closeup
  img2,
  // 3. Scientific molecular modeling
  img3
];

const PostcardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center perspective-1000">
      {IMAGES.map((src, index) => {
        const offset = (index - currentIndex + IMAGES.length) % IMAGES.length;
        const isActive = offset === 0;
        const isNext = offset === 1;
        const isPrev = offset === IMAGES.length - 1;

        let transform = 'scale(0.8) translateY(120px) rotate(0deg)';
        let zIndex = 0;
        let opacity = 0;

        if (isActive) {
          transform = 'scale(1) translateY(0) rotate(-2deg)';
          zIndex = 50;
          opacity = 1;
        } else if (isNext) {
          transform = 'scale(0.92) translateX(60px) translateY(30px) rotate(4deg)';
          zIndex = 40;
          opacity = 0.8;
        } else if (isPrev && IMAGES.length > 2) {
          transform = 'scale(0.88) translateX(-60px) translateY(-30px) rotate(-6deg)';
          zIndex = 20;
          opacity = 0.4;
        }

        return (
          <div
            key={index}
            className="absolute w-[85%] aspect-[4/3] max-w-[500px] bg-white rounded-3xl p-4 shadow-2xl transition-all duration-1500 ease-in-out border border-gray-100"
            style={{ transform, zIndex, opacity }}
          >
            <div className="w-full h-full overflow-hidden rounded-2xl bg-gray-50">
              <img
                src={src}
                alt={`Medical insight ${index + 1}`}
                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              />
            </div>
            <div className="mt-4 flex justify-between items-center px-1">
              <div className="flex gap-2">
                <div className="w-12 h-1.5 bg-gray-100 rounded-full"></div>
                <div className="w-6 h-1.5 bg-gray-50 rounded-full"></div>
              </div>
              <div className="w-4 h-4 rounded-full border border-teal-500/20 bg-teal-500/5"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostcardStack;