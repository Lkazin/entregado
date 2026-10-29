"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, KeyRound, Building2, ArrowRight, RefreshCw } from "lucide-react";
import { ScooterLogo } from "../icons";

interface Screen1LoginProps {
  onLogin?: (credentials: {
    email: string;
    password: string;
    storeCode: string;
  }) => Promise<boolean | { success: boolean; error?: string }> | void;
  interactive?: boolean;
}

export function Screen1Login({ onLogin }: Screen1LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("615210");
  const [storeCode, setStoreCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!storeCode.trim()) {
      setErrorMsg("Informe o Código da Loja para ser direcionado ao painel correspondente.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Informe seu e-mail ou telefone.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Digite sua senha de 6 dígitos.");
      return;
    }

    if (password.trim() !== "615210") {
      setErrorMsg("Senha incorreta. A senha obrigatória é 615210.");
      return;
    }

    setLoading(true);
    try {
      if (onLogin) {
        const res = await onLogin({
          email: email.trim(),
          password: password.trim(),
          storeCode: storeCode.trim().toUpperCase(),
        });
        if (res && typeof res === "object" && !res.success) {
          setErrorMsg(res.error || "Erro ao autenticar e vincular loja.");
        }
      }
    } catch {
      setErrorMsg("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-7 pb-4 relative overflow-y-auto text-center bg-[#07040d] custom-scrollbar">
      {/* Background soft glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 bg-[#fa0079]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Universal Branding */}
      <div className="flex flex-col items-center mt-1 z-10">
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

        <p className="text-[11px] text-white/70 mt-3 px-3 leading-snug">
          Insira o código de convite da loja para entrar diretamente no painel dela.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 my-3 z-10 text-left">
        {/* Field 1: Código da Loja (Primary Key) */}
        <div className="flex flex-col gap-1">
          <label className="text-[9.5px] font-bold text-[#fa0079] uppercase tracking-wider flex items-center gap-1">
            <KeyRound className="w-3 h-3 text-[#fa0079]" /> Código da Loja (Convite do Lojista)
          </label>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171426] border-2 border-[#fa0079]/60 focus-within:border-[#fa0079] rounded-xl transition-all shadow-[0_0_12px_rgba(250,0,121,0.2)]">
            <Building2 className="w-4 h-4 text-[#fa0079] shrink-0" />
            <input
              type="text"
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value.toUpperCase())}
              placeholder="Ex: Digite o código da loja"
              autoComplete="off"
              className="w-full bg-transparent text-xs font-mono font-bold text-white uppercase tracking-wider placeholder-white/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Field 2: Email or Phone */}
        <div className="flex flex-col gap-1">
          <label className="text-[9.5px] font-bold text-white/60 uppercase tracking-wider">
            Identificação do Entregador
          </label>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171524] border border-[#2b253e] rounded-xl focus-within:border-[#fa0079] transition-colors">
            <Mail className="w-4 h-4 text-white/50 shrink-0" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail ou telefone"
              autoComplete="username"
              className="w-full bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Field 3: 6-Digit Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[9.5px] font-bold text-white/60 uppercase tracking-wider">
            Senha de 6 Dígitos
          </label>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171524] border border-[#2b253e] rounded-xl focus-within:border-[#fa0079] transition-colors">
            <Lock className="w-4 h-4 text-white/50 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              maxLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="615210"
              autoComplete="current-password"
              className="w-full bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none tracking-widest font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/60 hover:text-white shrink-0 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span className="leading-tight">{errorMsg}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 bg-gradient-to-r from-[#fa0079] to-[#d60065] text-white text-xs font-bold rounded-xl shadow-[0_4px_15px_rgba(250,0,121,0.4)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Validando e Acessando Loja...
            </>
          ) : (
            <>
              Vincular e Acessar Loja
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Info */}
      <div className="z-10 text-[9px] text-white/40 pt-2 border-t border-[#1d1730]">
        <span>Solicite o código de convite ao lojista para liberar o recebimento de corridas daquela loja.</span>
      </div>
    </div>
  );
}
