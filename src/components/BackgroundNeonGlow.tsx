import React from "react";

export function BackgroundNeonGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#07040d]">
      {/* Top Center Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#fa0079]/20 via-[#a21caf]/10 to-transparent rounded-full blur-[120px]"></div>

      {/* Side Glows */}
      <div className="absolute top-1/4 -left-48 w-[600px] h-[600px] bg-[#e11d48]/15 rounded-full blur-[140px]"></div>
      <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-[#fa0079]/15 rounded-full blur-[140px]"></div>
      <div className="absolute bottom-10 left-1/3 w-[800px] h-[400px] bg-[#701a75]/15 rounded-full blur-[150px]"></div>

      {/* Elegant Neon Ribbon Wave Lines (SVG matching reference) */}
      <svg
        className="absolute top-0 left-0 w-full h-[600px] opacity-40 mix-blend-screen"
        viewBox="0 0 1920 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-100 120 C 350 -40, 800 240, 1300 80 C 1600 -10, 1850 160, 2100 110"
          stroke="url(#neon-pink-grad-1)"
          strokeWidth="3.5"
          filter="url(#glow-1)"
        />
        <path
          d="M-50 180 C 400 40, 900 300, 1400 140 C 1700 40, 1900 220, 2150 160"
          stroke="url(#neon-pink-grad-2)"
          strokeWidth="2.5"
          filter="url(#glow-1)"
        />
        <path
          d="M-150 80 C 250 -90, 750 150, 1200 40 C 1500 -40, 1750 90, 2050 50"
          stroke="#fa0079"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        <defs>
          <linearGradient id="neon-pink-grad-1" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fa0079" stopOpacity="0.1" />
            <stop offset="30%" stopColor="#fa0079" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#ff2e93" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fa0079" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="neon-pink-grad-2" x1="0" y1="0" x2="1920" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c026d3" stopOpacity="0.1" />
            <stop offset="40%" stopColor="#fa0079" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#e11d48" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glow-1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Grid Pattern with subtle opacity */}
      <div
        className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      ></div>
    </div>
  );
}
