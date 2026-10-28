"use client";

import React, { useEffect } from "react";
import { Check, Coins, Clock, Route } from "lucide-react";
import confetti from "canvas-confetti";
import { Order } from "@/types/delivery";

interface Screen7DeliveredSuccessProps {
  order?: Order | null;
  onNextOrder?: () => void;
  onGoHome?: () => void;
  triggerConfetti?: boolean;
}

export function Screen7DeliveredSuccess({
  order,
  onNextOrder,
  onGoHome,
  triggerConfetti = true,
}: Screen7DeliveredSuccessProps) {
  const currentOrder = order || {
    id: "ord-0482",
    orderNumber: "#0482",
    deliveryFee: 8.0,
    distanceKm: 2.8,
    estimatedMinutes: 7,
  };

  useEffect(() => {
    if (triggerConfetti) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#fa0079", "#38bdf8", "#10b981", "#facc15", "#a855f7"],
        });
      } catch {
        // no-op if unsupported
      }
    }
  }, [triggerConfetti]);

  return (
    <div className="flex-1 flex flex-col justify-between text-center relative overflow-hidden bg-[#0d0a17] px-4 py-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fa0079]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Celebration Checkmark Section */}
      <div className="flex flex-col items-center mt-2 relative z-10">
        {/* Confetti / Sparkle accents around the checkmark */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Decorative Sparkle dots */}
          <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-cyan-400"></span>
          <span className="absolute bottom-2 left-4 w-2 h-2 rounded-full bg-purple-400"></span>
          <span className="absolute bottom-4 right-2 w-1.5 h-1.5 rounded-full bg-[#fa0079]"></span>
          <span className="absolute top-1/2 -left-2 w-2 h-1 rounded-full bg-amber-300 rotate-45"></span>
          <span className="absolute top-1/2 -right-2 w-2 h-1 rounded-full bg-emerald-400 -rotate-45"></span>

          {/* Glowing Aura Ring */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#99004d] via-[#fa0079] to-[#c026d3] opacity-40 blur-md"></div>

          {/* Main Gradient Circle */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#9333ea] via-[#fa0079] to-[#f43f5e] flex items-center justify-center shadow-[0_0_25px_rgba(250,0,121,0.6)]">
            <Check className="w-10 h-10 text-white stroke-[3.5]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-base font-extrabold text-white mt-1">Entrega concluída!</h2>
        <span className="text-xs text-white/60 font-medium">Pedido {currentOrder.orderNumber}</span>
      </div>

      {/* Earnings & Stats */}
      <div className="space-y-2.5 my-auto z-10">
        {/* Earnings Card */}
        <div className="p-3 bg-[#171424] border border-[#2e2343] rounded-2xl flex items-center gap-3 shadow-md text-left">
          <div className="w-10 h-10 rounded-xl bg-[#2e1944] border border-[#502476] flex items-center justify-center text-[#c084fc] shrink-0">
            <Coins className="w-5 h-5 text-[#c084fc]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/60 font-medium">Valor da entrega</span>
            <span className="text-base font-black text-emerald-400 tracking-tight leading-none mt-0.5">
              R$ {currentOrder.deliveryFee.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* 2 Stats: Total Time & Distance */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 bg-[#171424] border border-[#2a213a] rounded-2xl flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/60 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] text-white/50">Tempo total</span>
              <span className="text-xs font-bold text-white">18 min</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#171424] border border-[#2a213a] rounded-2xl flex items-center gap-2">
            <Route className="w-4 h-4 text-white/60 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] text-white/50">Distância</span>
              <span className="text-xs font-bold text-white">
                {currentOrder.distanceKm.toString().replace(".", ",")} km
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-auto z-10">
        <button
          type="button"
          onClick={onNextOrder}
          className="w-full py-2.5 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(250,0,121,0.45)] transition-all cursor-pointer"
        >
          Ver próximo pedido
        </button>

        <button
          type="button"
          onClick={onGoHome}
          className="w-full py-2 bg-[#1b172a] hover:bg-[#251f38] text-white/70 hover:text-white text-[11px] font-semibold rounded-xl border border-[#2d2242] transition-colors cursor-pointer"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  );
}
