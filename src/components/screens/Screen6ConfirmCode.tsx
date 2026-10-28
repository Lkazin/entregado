"use client";

import React, { useState } from "react";
import { ChevronLeft, QrCode, AlertTriangle, Lock, ShieldCheck } from "lucide-react";
import { DeliveryBoxCheckIcon } from "../icons";
import { Order } from "@/types/delivery";

interface Screen6ConfirmCodeProps {
  order?: Order | null;
  interactive?: boolean;
  onBack?: () => void;
  onConfirm?: (code: string) => Promise<boolean> | boolean | void;
}

export function Screen6ConfirmCode({ order, onBack, onConfirm }: Screen6ConfirmCodeProps) {
  const currentOrder = order || {
    id: "ord-0482",
    orderNumber: "#0482",
    confirmationCode: "1742",
  };

  const [otp, setOtp] = useState<string[]>(["1", "7", "4", "2"]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  const handleDigitChange = (index: number, val: string) => {
    setErrorMessage(null);
    const char = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto focus next input
    if (char && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = otp.join("");
    if (fullCode.length < 4) {
      setErrorMessage("Digite os 4 dígitos informados pelo cliente");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (onConfirm) {
        const res = await onConfirm(fullCode);
        if (res === false) {
          setErrorMessage("Código incorreto. Peça o código correto ao cliente ou contate a loja.");
        }
      }
    } catch {
      setErrorMessage("Erro ao validar código. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillQr = () => {
    const validCode = (currentOrder.confirmationCode || "1742").split("");
    setOtp(validCode);
    setShowQrModal(false);
  };

  return (
    <div className="flex-1 flex flex-col justify-between text-center relative overflow-hidden bg-[#0c0a16]">
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col items-center justify-between scrollbar-none z-10">
        {/* Central Box Icon with Green Check */}
        <div className="mt-1">
          <DeliveryBoxCheckIcon className="w-16 h-16 drop-shadow-[0_0_15px_rgba(250,0,121,0.4)]" />
        </div>

        {/* Title and Instruction */}
        <div className="space-y-1 mt-2">
          <h2 className="text-sm font-extrabold text-white">Confirmar entrega</h2>
          <p className="text-[10px] text-white/60 max-w-[220px] leading-snug">
            Peça ao cliente o código de confirmação de 4 dígitos gerado pelo lojista.
          </p>
        </div>

        {/* Security badge: OTP Mandatory */}
        <div className="px-2.5 py-1 rounded-full bg-[#1b152b] border border-[#372652] flex items-center gap-1.5 text-[9px] text-white/60 my-1">
          <Lock className="w-2.5 h-2.5 text-amber-400" />
          <span>Entrega protegida contra fraudes</span>
        </div>

        {/* 4 Digit OTP Inputs */}
        <div className="flex items-center justify-center gap-2.5 my-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-12 bg-[#171424] border-2 border-[#33264c] focus:border-[#fa0079] rounded-xl text-center text-lg font-black text-white shadow-inner focus:outline-none transition-all"
            />
          ))}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-500/40 text-red-300 text-[10px] font-medium animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Confirm Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full py-2.5 bg-[#fa0079] hover:bg-[#e6006e] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-[0_4px_16px_rgba(250,0,121,0.45)] transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? "Validando no banco..." : "Confirmar entrega"}
        </button>

        {/* QR Code Alternative Card */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="w-full mt-3 p-2 bg-[#171424] hover:bg-[#201c32] border border-[#2b223c] rounded-xl flex items-center gap-2.5 text-left transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-[#fa0079]/15 border border-[#fa0079]/30 flex items-center justify-center text-[#fa0079] shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-[10px] leading-tight">
            <span className="text-white font-bold">Escanear código QR</span>
            <span className="text-white/50 text-[9px]">Se o cliente apresentar o código em QR Code.</span>
          </div>
        </button>

        {/* Issue / Support Card (Notifies the Store Manager) */}
        <button
          type="button"
          onClick={() => setShowIssueModal(true)}
          className="w-full mt-2 p-2 bg-[#1e1927] hover:bg-[#252031] border border-[#3e2e28] rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="flex flex-col text-[9px] leading-tight">
              <span className="text-amber-200 font-bold">Problemas na entrega?</span>
              <span className="text-amber-200/50">Cliente sem código, ausente ou endereço errado.</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-amber-400">Avisar Loja &gt;</span>
        </button>
      </div>

      {/* QR Code Scanner Simulation Modal */}
      {showQrModal && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-5 animate-in fade-in">
          <div className="w-full max-w-xs bg-[#161224] border border-[#382650] rounded-2xl p-4 flex flex-col items-center text-center">
            <h3 className="text-xs font-bold text-white mb-2">Escanear QR Code do Cliente</h3>
            <div className="w-44 h-44 bg-black/60 rounded-xl border-2 border-dashed border-[#fa0079] flex items-center justify-center relative overflow-hidden my-2">
              <div className="absolute inset-x-0 h-0.5 bg-[#fa0079] animate-bounce"></div>
              <QrCode className="w-20 h-20 text-white/20" />
            </div>
            <p className="text-[10px] text-white/60 mb-3">
              Aponte a câmera para o QR Code no celular do cliente.
            </p>
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={handleFillQr}
                className="flex-1 py-1.5 bg-[#fa0079] text-white text-[11px] font-bold rounded-xl cursor-pointer"
              >
                Validar Leitura QR
              </button>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="py-1.5 px-3 bg-[#241e34] text-white/70 text-[11px] rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Issue Reporting Modal */}
      {showIssueModal && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-5 animate-in fade-in">
          <div className="w-full max-w-xs bg-[#161224] border border-[#382650] rounded-2xl p-4 flex flex-col text-left">
            <h3 className="text-xs font-bold text-white mb-1">Relatar Ocorrência ao Lojista</h3>
            <p className="text-[9px] text-white/50 mb-2">
              O gerente da loja será alertado imediatamente no Painel do Lojista:
            </p>
            <div className="space-y-1.5 my-1">
              {[
                "Cliente não tem o código (Solicitar liberação)",
                "Cliente ausente no endereço",
                "Endereço incorreto / Não localizado",
                "Cliente recusou receber o pedido",
              ].map((reason, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    alert(`Alerta enviado ao Lojista: "${reason}". O painel da loja foi atualizado.`);
                    setShowIssueModal(false);
                  }}
                  className="w-full p-2 rounded-xl bg-[#201830] hover:bg-[#2c2242] text-[10px] text-white/80 hover:text-white text-left transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowIssueModal(false)}
              className="w-full mt-2 py-1.5 bg-[#251e36] text-white/70 text-[11px] rounded-xl font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
