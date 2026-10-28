"use client";

import React from "react";
import { ChevronLeft, Store, MapPin, User, Phone, Navigation, Lock, ShieldAlert, DollarSign } from "lucide-react";
import { WazeIcon, GoogleMapsIcon } from "../icons";
import { Order } from "@/types/delivery";

interface Screen4OrderDetailsProps {
  order?: Order | null;
  onBack?: () => void;
  onStartRoute?: () => void;
}

export function Screen4OrderDetails({ order, onBack, onStartRoute }: Screen4OrderDetailsProps) {
  const currentOrder = order || {
    id: "ord-0101",
    orderNumber: "#0101",
    orderValue: 38.5,
    deliveryFee: 8.0,
    storeName: "Açaí do Rei",
    storeAddress: "Av. Boqueirão, 1200 - Canoas/RS",
    customerName: "Mariana Souza",
    customerPhone: "(51) 98765-4321",
    destinationAddress: "Rua das Flores, 456",
    destinationNeighborhood: "Bairro Centro - Canoas/RS",
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
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between z-10 shrink-0 bg-[#0f0d1c]">
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2.5 space-y-2.5 scrollbar-none">
        {/* Status Banner */}
        <div className="p-2.5 bg-[#20152e] border border-[#3f1f58] rounded-2xl flex items-center gap-2.5 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-[#fa0079] flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="text-white font-bold">Aguardando retirada</span>
            <span className="text-white/60 text-[9px]">Vá até a loja para retirar o pedido.</span>
          </div>
        </div>

        {/* Financial info locked by store */}
        <div className="p-2.5 bg-[#171424] border border-[#2d223f] rounded-2xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/40 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-amber-400" /> Valor do Pedido (Lojista)
            </span>
            <span className="text-xs font-black text-[#facc15] mt-0.5">
              R$ {currentOrder.orderValue.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[9px] text-white/40 flex items-center justify-end gap-1">
              <DollarSign className="w-2.5 h-2.5 text-emerald-400" /> Sua Taxa (Repasse)
            </span>
            <span className="text-xs font-black text-emerald-400 mt-0.5">
              R$ {(currentOrder.deliveryFee || 8.0).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        {/* Addresses Card */}
        <div className="p-3 bg-[#171424] border border-[#2d223f] rounded-2xl space-y-2.5">
          {/* Retirada */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 text-[#fa0079] shrink-0">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-[10px] leading-tight">
              <span className="text-white font-semibold">Retirada</span>
              <span className="text-white/70">{currentOrder.storeName}</span>
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
              <span className="text-white/70">{currentOrder.destinationAddress}</span>
              <span className="text-white/40 text-[9px]">{currentOrder.destinationNeighborhood}</span>
            </div>
          </div>

          <div className="border-t border-white/5"></div>

          {/* Cliente */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 text-[#fa0079] shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-[10px] leading-tight">
                <span className="text-white font-semibold">Cliente</span>
                <span className="text-white/70">{currentOrder.customerName}</span>
                <span className="text-white/40 text-[9px]">{currentOrder.customerPhone}</span>
              </div>
            </div>

            <a
              href={`tel:${currentOrder.customerPhone.replace(/\D/g, "")}`}
              className="w-8 h-8 rounded-full bg-[#40194e] border border-[#642378] text-[#fa0079] flex items-center justify-center hover:bg-[#521e64] transition-colors cursor-pointer"
              title="Ligar para o cliente"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
            </a>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 bg-[#171424] border border-[#2b223c] rounded-2xl flex flex-col">
            <span className="text-[9px] text-white/50 font-medium">Distância</span>
            <span className="text-sm font-extrabold text-white mt-0.5">
              {currentOrder.distanceKm.toString().replace(".", ",")} km
            </span>
          </div>

          <div className="p-2.5 bg-[#171424] border border-[#2b223c] rounded-2xl flex flex-col">
            <span className="text-[9px] text-white/50 font-medium">Tempo estimado</span>
            <span className="text-sm font-extrabold text-white mt-0.5">
              {currentOrder.estimatedMinutes} min
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="p-3 bg-[#110e1e] border-t border-[#261f38] space-y-2 z-20 shrink-0">
        <button
          type="button"
          onClick={onStartRoute}
          className="w-full py-2.5 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(250,0,121,0.45)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 rotate-45" />
          <span>Iniciar rota</span>
        </button>

        {/* Waze & Google Maps External App Links */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={wazeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-[#191527] hover:bg-[#231e34] border border-[#2d2242] rounded-xl text-[10px] font-semibold text-white/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <WazeIcon className="w-4 h-4" />
            <span>Abrir no Waze</span>
          </a>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-1.5 px-2 bg-[#191527] hover:bg-[#231e34] border border-[#2d2242] rounded-xl text-[10px] font-semibold text-white/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <GoogleMapsIcon className="w-4 h-4" />
            <span>Abrir no Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
