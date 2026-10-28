"use client";

import React, { useState } from "react";
import { Store as StoreIcon, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, KeyRound, Building2 } from "lucide-react";
import { ScooterLogo } from "../icons";
import { Store, StoreCourierLink } from "@/types/delivery";

interface ScreenLinkStoreProps {
  linkedStores: StoreCourierLink[];
  activeStore: Store | null;
  onLinkSuccess: (link: StoreCourierLink) => void;
  onSelectStore: (storeId: string) => void;
  onSkip?: () => void;
}

export function ScreenLinkStore({
  linkedStores,
  activeStore,
  onLinkSuccess,
  onSelectStore,
  onSkip,
}: ScreenLinkStoreProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLinkStore = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg("Informe o código da loja fornecido pelo lojista.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: cleanCode }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Código inválido, expirado ou revogado.");
      } else {
        setSuccessMsg(data.message || `Vinculado com sucesso à ${data.link.storeName}!`);
        setCode("");
        if (onLinkSuccess) {
          onLinkSuccess(data.link);
        }
      }
    } catch {
      setErrorMsg("Falha na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-8 pb-4 relative overflow-y-auto text-center bg-[#07040d] custom-scrollbar">
      {/* Background soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#fa0079]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Branding */}
      <div className="flex flex-col items-center mt-2 z-10">
        <div className="mb-2 drop-shadow-[0_0_15px_rgba(250,0,121,0.6)]">
          <ScooterLogo className="w-16 h-10 text-[#fa0079]" />
        </div>
        <div className="flex items-center justify-center gap-1 leading-none">
          <span className="text-xl font-extrabold tracking-tight text-white">NOVAES</span>
          <span className="text-xl font-black tracking-tight text-[#fa0079]">WEB</span>
        </div>
        <span className="text-[10px] font-bold tracking-[0.35em] text-[#fa0079] uppercase mt-1">
          ENTREGADOR
        </span>

        <h1 className="text-sm font-bold text-white mt-4">Vincular a um Estabelecimento</h1>
        <p className="text-[11px] text-white/70 mt-1 px-4 leading-snug">
          Insira o código de convite fornecido pelo lojista para liberar o recebimento de pedidos.
        </p>
      </div>

      {/* Invite Code Form */}
      <form onSubmit={handleLinkStore} className="flex flex-col gap-3 my-4 z-10 text-left">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-[#fa0079]" /> Código da Loja
          </label>
          <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#171524] border border-[#2b253e] rounded-xl focus-within:border-[#fa0079] transition-colors">
            <Building2 className="w-4 h-4 text-white/60 shrink-0" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex: NX-ACAI-7821"
              className="w-full bg-transparent text-xs font-bold text-white uppercase tracking-wider placeholder-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] text-white/40">Códigos ativos:</span>
          <button
            type="button"
            onClick={() => setCode("NX-ACAI-7821")}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1e1730] border border-[#3b2b5a] text-[#fa0079] hover:bg-[#fa0079] hover:text-white transition-all"
          >
            NX-ACAI-7821 (Açaí do Rei)
          </button>
          <button
            type="button"
            onClick={() => setCode("NX-BURGER-4512")}
            className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1e1730] border border-[#3b2b5a] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-black transition-all"
          >
            NX-BURGER-4512 (Burger House)
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <div className="leading-tight">{errorMsg}</div>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <div className="leading-tight font-medium">{successMsg}</div>
          </div>
        )}

        {/* Link Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-[#fa0079] to-[#d60065] text-white text-xs font-bold rounded-xl shadow-[0_4px_15px_rgba(250,0,121,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Validando e Vinculando...
            </>
          ) : (
            <>
              Vincular à Loja
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* List of currently linked stores */}
      {linkedStores && linkedStores.length > 0 && (
        <div className="z-10 text-left my-2 p-3 bg-[#120e21] border border-[#2b2245] rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 flex items-center gap-1.5">
              <StoreIcon className="w-3.5 h-3.5 text-[#fa0079]" /> Suas Lojas Vinculadas ({linkedStores.length})
            </span>
          </div>
          <div className="space-y-2">
            {linkedStores.map((item) => {
              const isSelected = activeStore?.id === item.storeId;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectStore(item.storeId)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#1f1738] border-[#fa0079] shadow-[0_0_10px_rgba(250,0,121,0.2)]"
                      : "bg-[#18142a] border-[#2b2245] hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{item.storeName}</span>
                      {isSelected && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#fa0079]/20 text-[#fa0079] font-bold">
                          Ativa
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-white/50">{item.storeAddress}</div>
                  </div>
                  <button
                    type="button"
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all ${
                      isSelected
                        ? "bg-[#fa0079] text-white"
                        : "bg-[#251f38] text-white/70 hover:text-white"
                    }`}
                  >
                    {isSelected ? "Selecionada" : "Usar"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security and Info Footer */}
      <div className="z-10 mt-2 pt-2 border-t border-[#1d1730]">
        <div className="flex items-center justify-center gap-1.5 text-[9px] text-white/50">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Isolamento seguro: você só acessa pedidos das lojas autorizadas.</span>
        </div>
        {onSkip && linkedStores.length > 0 && (
          <button
            type="button"
            onClick={onSkip}
            className="mt-2 text-[10px] font-semibold text-white/70 hover:text-white underline underline-offset-2"
          >
            Voltar ao Painel Principal
          </button>
        )}
      </div>
    </div>
  );
}
