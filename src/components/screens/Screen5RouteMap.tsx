"use client";

import React from "react";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
import { WazeIcon, GoogleMapsIcon } from "../icons";
import { Order } from "@/types/delivery";

interface Screen5RouteMapProps {
  order?: Order | null;
  onBack?: () => void;
  onArrived?: () => void;
}

export function Screen5RouteMap({ order, onBack, onArrived }: Screen5RouteMapProps) {
  const currentOrder = order || {
    id: "ord-0482",
    orderNumber: "#0482",
    destinationAddress: "Rua das Flores, 456",
    destinationNeighborhood: "Bairro Centro - Cidade/UF",
    distanceKm: 2.8,
    estimatedMinutes: 7,
  };

  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(
    currentOrder.destinationAddress + " " + currentOrder.destinationNeighborhood
  )}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    currentOrder.destinationAddress + " " + currentOrder.destinationNeighborhood
  )}`;

  return (
    <div className="flex-1 flex flex-col justify-between text-left relative overflow-hidden bg-[#0c0a16]">
      {/* Top Bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between z-20 shrink-0 bg-[#0f0d1c]">
        <button
          type="button"
          onClick={onBack}
          className="p-1 -ml-1 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-white">Pedido {currentOrder.orderNumber}</span>
        <div className="w-5"></div>
      </div>

      {/* Top Floating Destination Info */}
      <div className="px-3 pt-2 z-20">
        <div className="p-2.5 bg-[#171424]/95 backdrop-blur-md border border-[#2d223f] rounded-2xl flex items-center gap-2.5 shadow-lg">
          <div className="w-8 h-8 rounded-xl bg-[#fa0079] flex items-center justify-center text-white shrink-0 shadow-sm">
            <MapPin className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col text-[10px] leading-tight overflow-hidden">
            <span className="text-white font-bold">Rota para entrega</span>
            <span className="text-white/80 truncate">{currentOrder.destinationAddress}</span>
            <span className="text-white/45 text-[9px] truncate">
              {currentOrder.destinationNeighborhood}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Styled Dark Map Canvas */}
      <div className="flex-1 relative my-2 overflow-hidden bg-[#0f0c1a] border-y border-white/5 flex items-center justify-center">
        {/* City Streets / Grid Simulation SVG */}
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1c162e"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Major avenue blocks */}
          <rect x="20" y="30" width="90" height="50" fill="#151125" rx="6" />
          <rect x="130" y="20" width="80" height="70" fill="#151125" rx="6" />
          <rect x="230" y="40" width="100" height="80" fill="#151125" rx="6" />
          <rect x="30" y="140" width="100" height="70" fill="#151125" rx="6" />
          <rect x="150" y="160" width="80" height="80" fill="#151125" rx="6" />

          {/* Animated Neon Route Path */}
          <path
            d="M 60 210 L 90 120 L 170 120 L 190 60"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]"
          />
        </svg>

        {/* Start Point: Blue Pulse Circle (Motoboy) */}
        <div className="absolute left-[52px] top-[198px] z-10">
          <div className="w-5 h-5 rounded-full bg-[#0ea5e9] border-2 border-white flex items-center justify-center shadow-[0_0_12px_rgba(14,165,233,1)]">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <div className="absolute -inset-1 rounded-full bg-[#0ea5e9] animate-ping opacity-40 pointer-events-none"></div>
        </div>

        {/* Destination Pin: Hot Pink */}
        <div className="absolute left-[180px] top-[40px] z-10 flex flex-col items-center">
          <div className="p-1 rounded-full bg-[#fa0079] border-2 border-white shadow-[0_0_15px_rgba(250,0,121,0.9)] animate-bounce">
            <MapPin className="w-4 h-4 text-white fill-current" />
          </div>
        </div>

        {/* Floating Route ETA Pill */}
        <div className="absolute left-[135px] top-[100px] z-20 px-2 py-1 bg-[#120e20]/95 border border-[#0ea5e9]/50 rounded-xl flex items-center gap-1.5 shadow-lg">
          <span className="text-[10px] font-bold text-white">
            {currentOrder.estimatedMinutes} min
          </span>
          <span className="text-[8px] text-white/50">•</span>
          <span className="text-[9px] text-[#0ea5e9] font-medium">
            {currentOrder.distanceKm.toString().replace(".", ",")} km
          </span>
        </div>
      </div>

      {/* Destination Card & Action Bar */}
      <div className="p-3 bg-[#110e1e] border-t border-[#261f38] space-y-2 z-20 shrink-0">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#fa0079] shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] font-bold text-white">Destino</span>
              <span className="text-[9px] text-white/60">
                {currentOrder.destinationAddress}, {currentOrder.destinationNeighborhood}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation App Direct Triggers */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-[#191527] hover:bg-[#231e34] border border-[#2d2242] rounded-xl text-[10px] font-semibold text-white/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <WazeIcon className="w-3.5 h-3.5" />
            <span>Abrir no Waze</span>
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-[#191527] hover:bg-[#231e34] border border-[#2d2242] rounded-xl text-[10px] font-semibold text-white/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <GoogleMapsIcon className="w-3.5 h-3.5" />
            <span>Abrir no Maps</span>
          </a>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onArrived}
          className="w-full py-2.5 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(250,0,121,0.45)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
          <span>Cheguei ao destino</span>
        </button>
      </div>
    </div>
  );
}
