import React from "react";
import { PhoneMockup } from "./PhoneMockup";

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
  onActivateInteractive?: () => void;
}

export function StepCard({
  number,
  title,
  description,
  children,
  onActivateInteractive,
}: StepCardProps) {
  return (
    <div className="flex flex-col items-center group">
      {/* Step Header Badge & Texts matching reference image */}
      <div className="w-full max-w-[305px] mb-4 text-left">
        <div className="flex items-center gap-3 mb-1.5">
          {/* Magenta Circle with Number */}
          <div className="w-8 h-8 rounded-full bg-[#fa0079] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(250,0,121,0.6)]">
            {number}
          </div>
          <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h3>
        </div>
        <p className="text-xs text-white/70 pl-11 leading-snug">
          {description}
        </p>
      </div>

      {/* Phone Mockup with Screen */}
      <div className="relative">
        <PhoneMockup>
          {children}
        </PhoneMockup>

        {/* Optional Interactive Overlay Badge on Hover */}
        {onActivateInteractive && (
          <button
            type="button"
            onClick={onActivateInteractive}
            className="absolute bottom-4 right-4 z-30 px-3 py-1.5 rounded-full bg-[#fa0079]/90 hover:bg-[#fa0079] text-white text-[10px] font-bold shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            Simular este passo →
          </button>
        )}
      </div>
    </div>
  );
}
