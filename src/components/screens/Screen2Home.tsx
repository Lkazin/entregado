"use client";

import React, { useState } from "react";
import {
  Bell,
  Store as StoreIcon,
  MapPin,
  Package,
  Home,
  ClipboardList,
  Star,
  User,
  ChevronDown,
  Building2,
  KeyRound,
  ExternalLink,
  Navigation,
  Clock,
  Sparkles
} from "lucide-react";
import { ScooterLogo } from "../icons";
import { Order, DeliveryStats, MotoboyProfile, Store, StoreCourierLink } from "@/types/delivery";
import { LojistaPanelModal } from "../LojistaPanelModal";

interface Screen2HomeProps {
  order?: Order | null;
  stats?: DeliveryStats | null;
  motoboy?: MotoboyProfile | null;
  activeStore?: Store | null;
  storesList?: Store[];
  courierLinks?: StoreCourierLink[];
  activeTab?: string;
  onViewDetails?: () => void;
  onNavigateTab?: (tab: string) => void;
  onSwitchStore?: (storeId: string) => Promise<void>;
  onOpenLinkStore?: () => void;
  onOrderDispatched?: (order: Order) => void;
}

export function Screen2Home({
  order,
  stats,
  motoboy,
  activeStore,
  storesList = [],
  courierLinks = [],
  activeTab = "inicio",
  onViewDetails,
  onNavigateTab,
  onSwitchStore,
  onOpenLinkStore,
  onOrderDispatched,
}: Screen2HomeProps) {
  const pendingCount = stats?.pendingCount ?? 0;
  const inProgressCount = stats?.inProgressCount ?? 0;
  const completedCount = stats?.completedCount ?? 0;

  // Lojista Panel Modal state
  const [showLojistaModal, setShowLojistaModal] = useState(false);
  const [showStoreSwitcher, setShowStoreSwitcher] = useState(false);

  const storeDisplayName = activeStore?.name || "Nenhuma loja vinculada";
  const storeDisplayAddress = activeStore?.address || "Insira um código de convite para conectar";

  return (
    <div className="flex-1 flex flex-col justify-between text-left relative overflow-hidden bg-[#0c0a16]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-2.5 pb-2 space-y-3.5 custom-scrollbar">
        {/* Universal Brand & Store Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#261f38]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9333ea] via-[#fa0079] to-[#fb7185] flex items-center justify-center text-white shadow-md">
              <ScooterLogo className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="text-xs font-black tracking-tight text-white">NOVAES</span>
                <span className="text-xs font-black tracking-tight text-[#fa0079]">WEB</span>
              </div>
              <span className="text-[8.5px] font-bold tracking-[0.25em] text-[#fa0079] uppercase">
                ENTREGADOR
              </span>
            </div>
          </div>

          {/* Lojista Management Trigger */}
          <button
            type="button"
            onClick={() => setShowLojistaModal(true)}
            className="px-2.5 py-1.5 rounded-xl bg-[#231b38] hover:bg-[#fa0079] border border-[#3b2d5a] text-white text-[9.5px] font-bold flex items-center gap-1.5 transition-all shadow-sm group"
            title="Acessar painel do lojista para gerenciar entregadores e despachos"
          >
            <Building2 className="w-3.5 h-3.5 text-[#fa0079] group-hover:text-white" />
            <span>Painel do Lojista</span>
          </button>
        </div>

        {/* Active Store Badge / Selector */}
        <div className="p-3 bg-[#161226] border border-[#2d2244] rounded-2xl flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#fa0079]/15 border border-[#fa0079]/30 flex items-center justify-center text-[#fa0079] shrink-0">
              <StoreIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-tight">{storeDisplayName}</span>
                <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  Conectado
                </span>
              </div>
              <p className="text-[9.5px] text-white/50 truncate max-w-[200px]">{storeDisplayAddress}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenLinkStore) onOpenLinkStore();
              else setShowStoreSwitcher(!showStoreSwitcher);
            }}
            className="p-1.5 rounded-lg bg-[#241c38] text-white/70 hover:text-white text-[9.5px] font-bold flex items-center gap-1"
            title="Trocar loja ou vincular novo código"
          >
            <KeyRound className="w-3 h-3 text-[#fa0079]" />
            <span>Trocar</span>
          </button>
        </div>

        {/* Entregas de hoje */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[11px] font-bold text-white">Entregas de hoje</h3>
            <span className="text-[9px] text-white/40">{storeDisplayName}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-2 bg-[#171424] border border-[#2b223c] rounded-2xl text-center shadow-inner">
            <div
              onClick={() => onNavigateTab?.("entregas")}
              className="flex flex-col py-1 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
            >
              <span className="text-base font-extrabold text-white leading-tight">
                {pendingCount}
              </span>
              <span className="text-[9px] text-white/60 font-medium">Pendentes</span>
            </div>
            <div
              onClick={() => onNavigateTab?.("entregas")}
              className="flex flex-col py-1 border-x border-white/5 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
            >
              <span className="text-base font-extrabold text-white leading-tight">
                {inProgressCount}
              </span>
              <span className="text-[9px] text-white/60 font-medium">Em andamento</span>
            </div>
            <div
              onClick={() => onNavigateTab?.("entregas")}
              className="flex flex-col py-1 cursor-pointer hover:bg-white/5 rounded-xl transition-colors"
            >
              <span className="text-base font-extrabold text-white leading-tight">
                {completedCount}
              </span>
              <span className="text-[9px] text-white/60 font-medium">Concluídas</span>
            </div>
          </div>
        </div>

        {/* Próxima entrega */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-[11px] font-bold text-white">Próxima entrega</h3>
            <span className="text-[9px] text-white/40">Destinada a {motoboy?.name || "Entregador"}</span>
          </div>

          {order ? (
            <div className="p-3 bg-[#171424] border border-[#2d223f] rounded-2xl space-y-2.5 shadow-md">
              {/* Header info */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#fa0079]/20 border border-[#fa0079]/40 flex items-center justify-center text-[#fa0079]">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Pedido {order.orderNumber}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#facc15]">
                  R$ {order.orderValue.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {/* Retirada */}
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 text-[#fa0079] shrink-0">
                  <StoreIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-[10px] leading-tight">
                  <span className="text-white font-semibold">Retirada</span>
                  <span className="text-white/70 font-normal">{order.storeName}</span>
                  <span className="text-white/40 text-[9px]">{order.storeAddress}</span>
                </div>
              </div>

              {/* Destino */}
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 text-[#fa0079] shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-[10px] leading-tight">
                  <span className="text-white font-semibold">Destino</span>
                  <span className="text-white/70 font-normal">
                    {order.destinationAddress}
                  </span>
                  <span className="text-white/40 text-[9px]">
                    {order.destinationNeighborhood}
                  </span>
                </div>
              </div>

              {/* Info Badges & Action */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9.5px] text-white/60">
                  <span className="flex items-center gap-1 font-medium">
                    <Navigation className="w-3 h-3 text-[#38bdf8]" /> {order.distanceKm} km
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-[#facc15]" /> ~{order.estimatedMinutes} min
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onViewDetails}
                  className="px-3.5 py-1.5 bg-[#fa0079] hover:bg-[#d60065] text-white text-[10px] font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Ver Detalhes</span>
                  <ChevronDown className="w-3 h-3 -rotate-90" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#140f22] border border-[#2a1d40] rounded-2xl text-center space-y-2">
              <div className="w-9 h-9 rounded-full bg-[#1e1533] mx-auto flex items-center justify-center text-white/40">
                <Package className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-white/70">Nenhuma entrega em andamento</p>
              <p className="text-[10px] text-white/40 max-w-[240px] mx-auto">
                Aguardando novo pedido despachado pelo lojista de {storeDisplayName}.
              </p>
              <button
                type="button"
                onClick={() => setShowLojistaModal(true)}
                className="mt-1 px-3 py-1.5 rounded-xl bg-[#fa0079]/20 hover:bg-[#fa0079] border border-[#fa0079]/40 text-[#fa0079] hover:text-white text-[9.5px] font-bold transition-all"
              >
                Abrir Painel do Lojista e Despachar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lojista Management Modal */}
      <LojistaPanelModal
        isOpen={showLojistaModal}
        onClose={() => setShowLojistaModal(false)}
        activeStore={activeStore || null}
        onOrderDispatched={(newOrder) => {
          if (onOrderDispatched) onOrderDispatched(newOrder);
        }}
      />

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
