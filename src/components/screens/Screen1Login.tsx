"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { ScooterLogo } from "../icons";

interface Screen1LoginProps {
  onLogin?: (credentials: { email: string; password: string }) => Promise<boolean | { success: boolean; error?: string }> | void;
  interactive?: boolean;
}

export function Screen1Login({ onLogin }: Screen1LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("motoboy@loja.com");
  const [password, setPassword] = useState("615210");
  const [remember, setRemember] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg("Informe seu e-mail ou telefone.");
      return;
    }

    if (!password.trim()) {
      setErrorMsg("Digite sua senha de 6 dígitos.");
      return;
    }

    if (password.trim() !== "615210") {
      setErrorMsg("Senha incorreta. A senha é de 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      if (onLogin) {
        const res = await onLogin({ email, password });
        if (res && typeof res === "object" && !res.success) {
          setErrorMsg(res.error || "Erro ao entrar.");
        }
      }
    } catch {
      setErrorMsg("Erro ao conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-5 pt-8 pb-4 relative overflow-hidden text-center bg-[#07040d]">
      {/* Background soft magenta glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#fa0079]/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Branding Section */}
      <div className="flex flex-col items-center mt-2 z-10">
        <div className="mb-2 drop-shadow-[0_0_15px_rgba(250,0,121,0.6)]">
          <ScooterLogo className="w-16 h-10 text-[#fa0079]" />
        </div>
        <div className="flex items-center justify-center gap-1 leading-none">
          <span className="text-xl font-extrabold tracking-tight text-white">NOVAES</span>
          <span className="text-xl font-black tracking-tight text-[#fa0079]">WEB</span>
        </div>
        <span className="text-[9px] font-semibold tracking-[0.35em] text-white/90 uppercase mt-1">
          ENTREGADOR
        </span>

        <p className="text-[11px] text-white/70 mt-5 px-3 leading-snug">
          Faça login para começar a receber suas entregas.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 my-auto z-10 text-left">
        {/* Email Field */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171524] border border-[#2b253e] rounded-xl focus-within:border-[#fa0079] transition-colors">
          <Mail className="w-4 h-4 text-white/60 shrink-0" />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail ou telefone"
            autoComplete="username"
            className="w-full bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none"
          />
        </div>

        {/* 6-Digit Password Field */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171524] border border-[#2b253e] rounded-xl focus-within:border-[#fa0079] transition-colors">
          <Lock className="w-4 h-4 text-white/60 shrink-0" />
          <input
            type={showPassword ? "text" : "password"}
            maxLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de 6 dígitos"
            autoComplete="current-password"
            className="w-full bg-transparent text-[11px] text-white placeholder-white/40 focus:outline-none tracking-widest"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-white/60 hover:text-white shrink-0 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-2 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] flex items-center gap-1.5 animate-shake">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Remember Me */}
        <label className="flex items-center gap-2 cursor-pointer mt-0.5 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-[#fa0079] w-3.5 h-3.5 rounded"
          />
          <span className="text-[10px] text-white/80">Lembrar de mim</span>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 mt-2 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_16px_rgba(250,0,121,0.45)] cursor-pointer disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {/* Forgot password */}
        <button
          type="button"
          onClick={() => alert("Para redefinir sua senha, solicite ao lojista ou administrador da sua loja na plataforma NovaesWeb.")}
          className="text-center text-[10px] text-[#fa0079] hover:underline mt-1 font-medium cursor-pointer"
        >
          Esqueci minha senha
        </button>
      </form>

      {/* Decorative Wave Trails at Bottom */}
      <div className="relative w-full h-10 mt-auto pointer-events-none opacity-40">
        <svg viewBox="0 0 200 40" fill="none" className="w-full h-full">
          <path
            d="M-20 30 C 50 10, 120 45, 220 20"
            stroke="#fa0079"
            strokeWidth="2"
            strokeOpacity="0.4"
          />
          <path
            d="M-10 35 C 60 15, 140 40, 210 25"
            stroke="#fa0079"
            strokeWidth="1"
            strokeOpacity="0.25"
          />
        </svg>
      </div>

      {/* Home Indicator */}
      <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-2"></div>
    </div>
  );
}
