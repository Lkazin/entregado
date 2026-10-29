import React from "react";

// NovaesWeb Stylized Scooter Logo with Speed Lines
export function ScooterLogo({ className = "w-12 h-12 text-[#fa0079]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Motion Speed Lines */}
      <line x1="2" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="8" y1="36" x2="26" y2="36" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="46" x2="20" y2="46" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />

      {/* Driver Head / Helmet */}
      <circle cx="56" cy="14" r="8" fill="currentColor" />

      {/* Back Wheel */}
      <circle cx="44" cy="50" r="10" stroke="currentColor" strokeWidth="5" fill="#0b0813" />
      <circle cx="44" cy="50" r="4" fill="currentColor" />

      {/* Front Wheel */}
      <circle cx="86" cy="50" r="10" stroke="currentColor" strokeWidth="5" fill="#0b0813" />
      <circle cx="86" cy="50" r="4" fill="currentColor" />

      {/* Scooter Body & Chassis */}
      <path
        d="M38 38H56L66 48H76L82 32H72"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handlebar & Windshield column */}
      <path
        d="M82 32L78 20H84"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Delivery Box / Seat */}
      <path
        d="M40 38V24H54V38"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Generic Store Avatar
export function BurgerHouseLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`rounded-full border-2 border-[#fa0079] bg-[#1e1530] flex items-center justify-center p-1 text-center shadow-[0_0_10px_rgba(250,0,121,0.3)] ${className}`}
    >
      <div className="flex flex-col items-center justify-center leading-none">
        <span className="text-[7px] font-black tracking-tight text-[#fa0079] uppercase">LOJA</span>
        <span className="text-[6px] font-bold text-white uppercase">PARCEIRA</span>
      </div>
    </div>
  );
}

// Waze App Icon
export function WazeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#33CCFF" />
      <path
        d="M24 10C15.7 10 9 16.7 9 25C9 28.5 10.2 31.7 12.3 34.2L11 38.5L16 37C18.4 38.9 21.1 40 24 40C32.3 40 39 33.3 39 25C39 16.7 32.3 10 24 10Z"
        fill="white"
      />
      <circle cx="19" cy="24" r="2.5" fill="#1C355E" />
      <circle cx="29" cy="24" r="2.5" fill="#1C355E" />
      <path
        d="M20 29C21 31 27 31 28 29"
        stroke="#1C355E"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="38" r="3" fill="#1C355E" />
      <circle cx="30" cy="38" r="3" fill="#1C355E" />
    </svg>
  );
}

// Google Maps App Icon
export function GoogleMapsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#ffffff" />
      <path
        d="M24 10C17.4 10 12 15.4 12 22C12 30.5 24 39 24 39C24 39 36 30.5 36 22C36 15.4 30.6 10 24 10Z"
        fill="#EA4335"
      />
      <circle cx="24" cy="22" r="5" fill="#FFFFFF" />
      <path d="M12 22C12 25.5 14 29 17 32L24 39V29L16 21C13.5 21 12 22 12 22Z" fill="#FBBC04" opacity="0.9" />
      <path d="M24 39C24 39 31 34 34 29L26 21V39H24Z" fill="#34A853" opacity="0.9" />
      <path d="M12 22C12 15.4 17.4 10 24 10V18L18 24C14 24 12 22 12 22Z" fill="#4285F4" opacity="0.9" />
    </svg>
  );
}

// Delivery Box with Checkmark Icon for Confirmation Step
export function DeliveryBoxCheckIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#99004d] to-[#fa0079] p-3 flex items-center justify-center shadow-[0_0_25px_rgba(250,0,121,0.5)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
          <path d="m3.3 7 8.7 5 8.7-5" />
          <path d="M12 22V12" />
        </svg>
      </div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#161622] flex items-center justify-center shadow-md">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>
  );
}
