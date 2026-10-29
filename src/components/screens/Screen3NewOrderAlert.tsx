"use client";

import React, { useEffect } from "react";
import { Store, MapPin } from "lucide-react";
import { ScooterLogo } from "../icons";
import { Order } from "@/types/delivery";

interface Screen3NewOrderAlertProps {
  order?: Order | null;
  onAccept?: () => void;
  onLater?: () => void;
  soundEnabled?: boolean;
}

export function Screen3NewOrderAlert({
  order,
  onAccept,
  onLater,
  soundEnabled = true,
}: Screen3NewOrderAlertProps) {
  const currentOrder = order || {
    id: "ord-0000",
    orderNumber: "#----",
    orderValue: 0.0,
    storeName: "Loja Parceira",
    storeAddress: "Endereço da loja",
    destinationAddress: "Endereço de entrega",
    destinationNeighborhood: "Bairro",
  };

  useEffect(() => {
    // Sound buzzer for incoming order
    if (soundEnabled && typeof window !== "undefined") {
      try {
        const audioCtx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.2); // D6

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      } catch {
        // Audio policy
      }
    }

    // Android vibration
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch {
        // Ignored
      }
    }
  }, [soundEnabled]);

  return (
    <div className="flex-1 flex flex-col justify-between text-center relative overflow-hidden bg-[#0a0715] px-4 py-5">
      {/* Background radial magenta glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#fa0079]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Central Notification Animation */}
      <div className="flex flex-col items-center mt-3 relative z-10">
        {/* Pulsing radar waves around the scooter */}
        <div className="relative w-36 h-28 flex items-center justify-center">
          {/* Wave arcs left */}
          <div className="absolute left-1 text-[#fa0079] opacity-70 animate-pulse font-light text-3xl select-none">
            ((
          </div>
          {/* Wave arcs right */}
          <div className="absolute right-1 text-[#fa0079] opacity-70 animate-pulse font-light text-3xl select-none">
            ))
          </div>

          {/* Central Animated Scooter */}
          <div className="p-3 bg-[#1d122e] border border-[#441a54] rounded-full shadow-[0_0_30px_rgba(250,0,121,0.5)]">
            <ScooterLogo className="w-14 h-9 text-[#fa0079] drop-shadow-[0_0_10px_rgba(250,0,121,0.8)]" />
          </div>
        </div>

        {/* Novo Pedido Badge */}
        <div className="mt-3 px-4 py-1 rounded-full bg-[#fa0079] text-white text-[11px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(250,0,121,0.6)]">
          NOVO PEDIDO
        </div>

        {/* Order Number & Price */}
        <h2 className="text-base font-extrabold text-white mt-2">
          Pedido {currentOrder.orderNumber}
        </h2>
        <span className="text-sm font-black text-[#facc15] mt-0.5">
          R$ {currentOrder.orderValue.toFixed(2).replace(".", ",")}
        </span>
      </div>

      {/* Order Pickup & Destination Card */}
      <div className="p-3 bg-[#161224] border border-[#2d223f] rounded-2xl space-y-2.5 text-left z-10 my-auto shadow-lg">
        {/* Retirada */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-[#fa0079] shrink-0">
            <Store className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="text-white font-semibold">Retirada</span>
            <span className="text-white/70 font-normal">{currentOrder.storeName}</span>
            <span className="text-white/40 text-[9px]">{currentOrder.storeAddress}</span>
          </div>
        </div>

        <div className="border-t border-white/5"></div>

        {/* Destino */}
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 text-[#fa0079] shrink-0">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="text-white font-semibold">Destino</span>
            <span className="text-white/70 font-normal">
              {currentOrder.destinationAddress}
            </span>
            <span className="text-white/40 text-[9px]">
              {currentOrder.destinationNeighborhood}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto z-10">
        <button
          type="button"
          onClick={onAccept}
          className="w-full py-2.5 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(250,0,121,0.45)] transition-all cursor-pointer"
        >
          Ver detalhes
        </button>

        <button
          type="button"
          onClick={onLater}
          className="w-full py-2 bg-[#1b172a] hover:bg-[#251f38] text-white/70 hover:text-white text-[11px] font-semibold rounded-xl border border-[#2d2242] transition-colors cursor-pointer"
        >
          Mais tarde
        </button>
      </div>
    </div>
  );
}
