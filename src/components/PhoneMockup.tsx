import React from "react";
import { Wifi, Battery } from "lucide-react";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className = "" }: PhoneMockupProps) {
  return (
    <div
      className={`relative w-[285px] sm:w-[305px] h-[610px] sm:h-[630px] rounded-[44px] bg-[#0c0a14] border-[5px] border-[#2c223c] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(250,0,121,0.18)] flex flex-col overflow-hidden select-none transition-transform duration-300 hover:scale-[1.01] hover:border-[#fa0079]/40 ${className}`}
    >
      {/* Dynamic Island / Notch */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[85px] h-[20px] bg-black rounded-full z-30 flex items-center justify-end px-2 gap-1 border border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#151522] border border-[#2b253b] mr-auto ml-1"></div>
        <div className="w-2 h-2 rounded-full bg-[#1b253b]/80"></div>
      </div>

      {/* Top Status Bar (iOS Style) */}
      <div className="w-full pt-3 px-6 pb-1.5 flex items-center justify-between text-[11px] font-semibold text-white/90 z-20 shrink-0">
        <span className="tracking-tight pl-1">9:41</span>
        <div className="flex items-center gap-1.5 pr-1">
          {/* Signal bars */}
          <div className="flex items-end gap-[2px] h-2.5">
            <span className="w-[2.5px] h-1 bg-white rounded-xs"></span>
            <span className="w-[2.5px] h-1.5 bg-white rounded-xs"></span>
            <span className="w-[2.5px] h-2 bg-white rounded-xs"></span>
            <span className="w-[2.5px] h-2.5 bg-white rounded-xs"></span>
          </div>
          <Wifi className="w-3 h-3 text-white" />
          <div className="flex items-center">
            <Battery className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Screen Content */}
      <div className="relative flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-[#110e1c] via-[#0d0b17] to-[#090711] text-white">
        {children}
      </div>

      {/* Bottom Home Indicator */}
      <div className="w-full pb-2 pt-1 flex justify-center bg-[#090711] z-20 shrink-0">
        <div className="w-28 h-1 bg-white/40 rounded-full"></div>
      </div>
    </div>
  );
}
