"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Bike,
  DollarSign,
  LogOut,
  ShieldCheck,
  Home,
  ClipboardList,
  Star,
  Lock,
  Edit2,
  Check,
  AlertCircle
} from "lucide-react";
import { MotoboyProfile, DeliveryStats } from "@/types/delivery";

interface ScreenProfileProps {
  motoboy?: MotoboyProfile | null;
  activeStore?: { name: string; address?: string } | null;
  stats?: DeliveryStats | null;
  onLogout?: () => void;
  onUpdateProfile?: (updates: Partial<MotoboyProfile>) => Promise<void>;
  onNavigateTab?: (tab: string) => void;
  activeTab?: string;
}

export function ScreenProfile({
  motoboy,
  activeStore,
  stats,
  onLogout,
  onUpdateProfile,
  onNavigateTab,
  activeTab = "perfil",
}: ScreenProfileProps) {
  const profile = motoboy || {
    name: "Carlos Silva",
    email: "motoboy@loja.com",
    phone: "(11) 97123-4567",
    vehicleModel: "Honda CG 160 Fan",
    vehiclePlate: "BRA-2E19",
    rating: 4.9,
  };
  const storeName = activeStore?.name || "Açaí do Rei";

  const todayEarnings = stats?.todayEarnings ?? 96.0;

  // Editable fields by the motoboy
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile.phone || "(11) 97123-4567");
  const [vehicleModel, setVehicleModel] = useState(profile.vehicleModel || "Honda CG 160 Fan");
  const [vehiclePlate, setVehiclePlate] = useState(profile.vehiclePlate || "BRA-2E19");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile({
        phone,
        vehicleModel,
        vehiclePlate,
      });
    }
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-left relative overflow-hidden bg-[#0c0a16]">
      {/* Top Bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between z-10 shrink-0 bg-[#0f0d1c]">
        <div className="w-5"></div>
        <span className="text-xs font-bold text-white">Meu Perfil</span>
        <button
          type="button"
          onClick={onLogout}
          className="p-1 -mr-1 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-none">
        {/* Motoboy Badge & Permissions Summary Alert */}
        <div className="p-2.5 bg-[#171328] border border-[#382650] rounded-xl flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[9.5px] leading-tight text-white/70">
            <span className="font-bold text-white block">Perfil do Entregador</span>
            Você pode atualizar seu telefone e veículo. Taxas e vínculos com a loja são gerenciados pelo painel do lojista.
          </div>
        </div>

        {/* Motoboy Header Card */}
        <div className="p-4 bg-[#171424] border border-[#2b223c] rounded-2xl flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#fa0079]/20 border border-[#fa0079]/40 flex items-center justify-center text-[#fa0079] shrink-0 font-bold text-base shadow-sm">
            {profile.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white">{profile.name}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 text-[8px] font-bold border border-emerald-500/30">
                Ativo
              </span>
            </div>
            <span className="text-[10px] text-white/50">{profile.email}</span>
            <span className="text-[10px] text-white/70 mt-0.5 font-medium">{phone}</span>
          </div>
        </div>

        {/* Vehicle Info Card (Editable by Motoboy) */}
        <div className="p-3 bg-[#171424] border border-[#2b223c] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-[#fa0079]" /> Dados do Veículo
            </span>
            <button
              type="button"
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="text-[9px] font-bold text-[#fa0079] hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isEditing ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Salvar</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3" />
                  <span>Editar</span>
                </>
              )}
            </button>
          </div>

          {savedSuccess && (
            <div className="px-2 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold">
              ✓ Dados do veículo atualizados com sucesso!
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-[#1f1930] rounded-xl flex flex-col">
              <span className="text-white/40 text-[9px]">Modelo da Moto</span>
              {isEditing ? (
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="bg-transparent text-white font-semibold text-[10px] border-b border-[#fa0079] focus:outline-none mt-0.5"
                />
              ) : (
                <span className="text-white font-semibold">{vehicleModel}</span>
              )}
            </div>

            <div className="p-2 bg-[#1f1930] rounded-xl flex flex-col">
              <span className="text-white/40 text-[9px]">Placa</span>
              {isEditing ? (
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="bg-transparent text-white font-semibold text-[10px] border-b border-[#fa0079] focus:outline-none mt-0.5"
                />
              ) : (
                <span className="text-white font-semibold">{vehiclePlate}</span>
              )}
            </div>
          </div>
        </div>

        {/* Store Connection (LOCKED FOR MOTOBOY - Controlled by Store) */}
        <div className="p-3 bg-[#171424] border border-[#2b223c] rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" /> Vínculo da Loja
            </span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[8px] font-bold">
              🔒 Gerenciado pelo Lojista
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] pt-1">
            <span className="text-white/80 font-semibold">{storeName}</span>
            <span className="text-emerald-400 text-[9px] font-bold">Conectado</span>
          </div>
          <p className="text-[8.5px] text-white/40">
            A troca de loja ou cancelamento de vínculo só pode ser autorizada pelo painel do lojista.
          </p>
        </div>

        {/* Earnings & Rates (LOCKED FOR MOTOBOY - Fixed by Store Policy) */}
        <div className="p-3 bg-[#171424] border border-[#2b223c] rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Ganhos & Repasses
            </span>
            <span className="text-[8.5px] text-white/40 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-white/40" /> Taxa Fixa da Loja
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2.5 bg-[#14231b] border border-emerald-500/20 rounded-xl flex flex-col">
              <span className="text-emerald-400/60 text-[9px]">Ganhos de Hoje</span>
              <span className="text-sm font-extrabold text-emerald-400">
                R$ {todayEarnings.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="p-2.5 bg-[#1f1930] rounded-xl flex flex-col">
              <span className="text-white/40 text-[9px]">Esta semana</span>
              <span className="text-sm font-extrabold text-white">R$ 540,00</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 mt-2 bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair da Conta</span>
        </button>
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
