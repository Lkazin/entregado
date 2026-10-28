"use client";

import React, { useState } from "react";
import { ChevronLeft, Package, ChevronRight, Home, ClipboardList, Star, User } from "lucide-react";
import { Order } from "@/types/delivery";

interface Screen8DeliveryHistoryProps {
  orders?: Order[];
  activeTab?: string;
  onBack?: () => void;
  onSelectOrder?: (order: Order) => void;
  onNavigateTab?: (tab: string) => void;
}

export function Screen8DeliveryHistory({
  orders = [],
  activeTab = "entregas",
  onBack,
  onSelectOrder,
  onNavigateTab,
}: Screen8DeliveryHistoryProps) {
  const [filter, setFilter] = useState<"todas" | "andamento" | "concluidas">("todas");

  const filteredOrders = orders.filter((o) => {
    if (filter === "andamento") {
      return o.status === "aguardando_retirada" || o.status === "em_rota";
    }
    if (filter === "concluidas") {
      return o.status === "concluida";
    }
    return true;
  });

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
        <span className="text-xs font-bold text-white">Minhas entregas</span>
        <div className="w-5"></div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setFilter("todas")}
          className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
            filter === "todas"
              ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
              : "bg-[#181427] text-white/60 hover:text-white border border-[#2c223e]"
          }`}
        >
          Todas
        </button>

        <button
          type="button"
          onClick={() => setFilter("andamento")}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
            filter === "andamento"
              ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
              : "bg-[#181427] text-white/60 hover:text-white border border-[#2c223e]"
          }`}
        >
          Em andamento
        </button>

        <button
          type="button"
          onClick={() => setFilter("concluidas")}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
            filter === "concluidas"
              ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
              : "bg-[#181427] text-white/60 hover:text-white border border-[#2c223e]"
          }`}
        >
          Concluídas
        </button>
      </div>

      {/* Delivery Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-none">
        {filteredOrders.length === 0 ? (
          <div className="py-12 text-center text-white/40 text-xs">
            Nenhuma entrega encontrada neste filtro.
          </div>
        ) : (
          filteredOrders.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectOrder?.(item)}
              className="p-2.5 bg-[#171424] hover:bg-[#1f1a30] border border-[#29203c] rounded-2xl flex items-center justify-between transition-colors shadow-sm cursor-pointer"
            >
              {/* Left: Icon and ID + Status */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#231a34] border border-[#392953] flex items-center justify-center text-white/80 shrink-0">
                  <Package className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-white leading-tight">
                    {item.orderNumber}
                  </span>
                  <span
                    className={`inline-block px-1.5 py-0.2 mt-0.5 text-[8px] font-bold rounded-sm border w-max ${
                      item.status === "concluida"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : item.status === "em_rota"
                        ? "bg-sky-950/80 text-sky-400 border-sky-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {item.status === "concluida"
                      ? "Concluída"
                      : item.status === "em_rota"
                      ? "Em rota"
                      : "Aguardando"}
                  </span>
                </div>
              </div>

              {/* Right: Value, Time and Chevron */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-right leading-tight">
                  <span className="text-xs font-extrabold text-white">
                    R$ {(item.deliveryFee || 7).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-[9px] text-white/40 mt-0.5">
                    {item.deliveredAt || "Hoje"}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="h-14 px-3 bg-[#110e1e] border-t border-[#261f38] flex items-center justify-around z-20 shrink-0">
        <button
          type="button"
          onClick={() => onNavigateTab?.("inicio")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === "inicio" ? "text-[#fa0079]" : "text-white/45 hover:text-white/70"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-[9px] font-semibold">Início</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab?.("entregas")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === "entregas" ? "text-[#fa0079]" : "text-white/45 hover:text-white/70"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-[9px] font-semibold">Entregas</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab?.("avaliacoes")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === "avaliacoes" ? "text-[#fa0079]" : "text-white/45 hover:text-white/70"
          }`}
        >
          <Star className="w-4 h-4" />
          <span className="text-[9px] font-semibold">Avaliações</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab?.("perfil")}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === "perfil" ? "text-[#fa0079]" : "text-white/45 hover:text-white/70"
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[9px] font-semibold">Perfil</span>
        </button>
      </nav>
    </div>
  );
}
