"use client";

import React from "react";
import Link from "next/link";
import { ScooterLogo } from "./icons";
import { Smartphone, LayoutGrid, Sparkles, ExternalLink } from "lucide-react";

interface HeaderProps {
  currentView: "showcase" | "simulator";
  onViewChange: (view: "showcase" | "simulator") => void;
  activeGroup: "all" | "part1" | "part2";
  onGroupChange: (group: "all" | "part1" | "part2") => void;
}

export function Header({
  currentView,
  onViewChange,
  activeGroup,
  onGroupChange,
}: HeaderProps) {
  return (
    <header className="w-full relative z-30 pt-6 pb-4 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center">
      {/* Top Bar Switcher between Showcase & Interactive Simulator */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#fa0079]/20 border border-[#fa0079]/40 text-[#fa0079] text-[11px] font-bold tracking-wide uppercase">
            Projeto 01 • NovaesWeb
          </span>
          <span className="text-white/40 text-xs hidden sm:inline">|</span>
          <span className="text-white/60 text-xs hidden sm:inline">
            Reconstrução Fiel 1:1 • Image to Website
          </span>
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#161226] border border-[#2d2242] rounded-2xl">
          <button
            type="button"
            onClick={() => onViewChange("showcase")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === "showcase"
                ? "bg-[#fa0079] text-white shadow-[0_0_12px_rgba(250,0,121,0.5)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Visão Vitrine (8 Passos)</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange("simulator")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === "simulator"
                ? "bg-[#fa0079] text-white shadow-[0_0_12px_rgba(250,0,121,0.5)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Simulador Interativo</span>
          </button>

          <Link
            href="/app"
            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-[#251b38] hover:bg-[#342450] text-[#ff70ba] border border-[#fa0079]/30 hover:border-[#fa0079]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>App Android (Tela Cheia)</span>
          </Link>
        </div>
      </div>

      {/* Main Brand Showcase matching the reference images exactly */}
      <div className="flex flex-col items-center text-center my-4">
        {/* Scooter Icon with speed lines */}
        <div className="mb-2 relative">
          <div className="absolute inset-0 bg-[#fa0079] opacity-40 blur-xl rounded-full"></div>
          <ScooterLogo className="w-20 h-14 text-[#fa0079] relative z-10 drop-shadow-[0_0_20px_rgba(250,0,121,0.8)]" />
        </div>

        {/* NOVAESWEB Text with White + Neon Pink */}
        <div className="flex items-center justify-center gap-1.5 text-3xl sm:text-5xl font-black tracking-tight drop-shadow-lg">
          <span className="text-white">NOVAES</span>
          <span className="text-[#fa0079]">WEB</span>
        </div>

        {/* ENTREGADOR Subheading with spaced tracking */}
        <h1 className="text-sm sm:text-lg font-bold tracking-[0.4em] text-white uppercase mt-1">
          ENTREGADOR
        </h1>

        {/* Slogan */}
        <p className="text-sm sm:text-base text-white/80 font-normal mt-2 max-w-xl">
          Tudo o que o motoboy precisa em um só lugar
        </p>

        {/* Filter subtabs for Showcase View */}
        {currentView === "showcase" && (
          <div className="flex items-center gap-2 mt-6 p-1 bg-[#171328]/90 border border-[#2f2246] rounded-2xl">
            <button
              type="button"
              onClick={() => onGroupChange("all")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroup === "all"
                  ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Todos os 8 Passos
            </button>

            <button
              type="button"
              onClick={() => onGroupChange("part1")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroup === "part1"
                  ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Passos 1 ao 4 (Imagem 1)
            </button>

            <button
              type="button"
              onClick={() => onGroupChange("part2")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeGroup === "part2"
                  ? "bg-[#fa0079] text-white shadow-[0_0_10px_rgba(250,0,121,0.5)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Passos 5 ao 8 (Imagem 2)
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
