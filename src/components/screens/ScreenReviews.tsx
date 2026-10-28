"use client";

import React from "react";
import { ChevronLeft, Star, Home, ClipboardList, User } from "lucide-react";

interface ScreenReviewsProps {
  onBack?: () => void;
  onNavigateTab?: (tab: string) => void;
  activeTab?: string;
}

const reviews = [
  { name: "Maria Souza", rating: 5, date: "Hoje, 15:45", comment: "Muito educado e a comida chegou super quentinha!" },
  { name: "Lucas Mendes", rating: 5, date: "Hoje, 13:20", comment: "Entrega rápida demais, parabéns!" },
  { name: "Camila Rocha", rating: 5, date: "Ontem, 20:15", comment: "Excelente motoboy, muito cuidadoso." },
  { name: "Rodrigo A.", rating: 4, date: "Ontem, 18:30", comment: "Tudo certo e rápido." },
];

export function ScreenReviews({ onBack, onNavigateTab, activeTab = "avaliacoes" }: ScreenReviewsProps) {
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
        <span className="text-xs font-bold text-white">Minhas Avaliações</span>
        <div className="w-5"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
        {/* Score Card */}
        <div className="p-4 bg-gradient-to-br from-[#1d1630] to-[#140e22] border border-[#3b2b54] rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">
              Nota Geral
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-white">4.9</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <span className="text-[9px] text-white/50 mt-1">Baseado em 142 entregas</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              98% Positivas
            </span>
          </div>
        </div>

        {/* Customer Feedbacks */}
        <h4 className="text-[11px] font-bold text-white mt-2">Últimos comentários</h4>
        <div className="space-y-2">
          {reviews.map((r, i) => (
            <div key={i} className="p-3 bg-[#171424] border border-[#2b223c] rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">{r.name}</span>
                <span className="text-[9px] text-white/40">{r.date}</span>
              </div>
              <div className="flex text-amber-400">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-2.5 h-2.5 fill-current" />
                ))}
              </div>
              <p className="text-[10px] text-white/70 italic mt-0.5">"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
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
