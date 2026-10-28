"use client";

import React, { useState } from "react";
import { PhoneMockup } from "./PhoneMockup";
import { Screen1Login } from "./screens/Screen1Login";
import { Screen2Home } from "./screens/Screen2Home";
import { Screen3NewOrderAlert } from "./screens/Screen3NewOrderAlert";
import { Screen4OrderDetails } from "./screens/Screen4OrderDetails";
import { Screen5RouteMap } from "./screens/Screen5RouteMap";
import { Screen6ConfirmCode } from "./screens/Screen6ConfirmCode";
import { Screen7DeliveredSuccess } from "./screens/Screen7DeliveredSuccess";
import { Screen8DeliveryHistory } from "./screens/Screen8DeliveryHistory";
import { Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight, Play } from "lucide-react";

interface InteractiveSimulatorProps {
  initialStep?: number;
}

export function InteractiveSimulator({ initialStep = 1 }: InteractiveSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synthesize sound alert using Web Audio API for step 3 (New order)
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.2); // D6

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    if (step === 3) {
      playAlertSound();
    }
  };

  const stepsList = [
    { num: 1, title: "Login", desc: "Acesso rápido e seguro" },
    { num: 2, title: "Tela inicial", desc: "Visão geral do dia" },
    { num: 3, title: "Nova entrega", desc: "Notificação sonoro/vibração" },
    { num: 4, title: "Detalhes", desc: "Dados do pedido e rota" },
    { num: 5, title: "Rota GPS", desc: "Navegação Waze/Maps" },
    { num: 6, title: "Confirmação", desc: "Código OTP do cliente" },
    { num: 7, title: "Concluída", desc: "Registro e remuneração" },
    { num: 8, title: "Histórico", desc: "Todas as entregas" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-8 px-4">
      {/* Controls Bar */}
      <div className="w-full bg-[#151125]/80 backdrop-blur-md border border-[#2d2242] rounded-3xl p-4 mb-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        {/* Step navigation pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {stepsList.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => goToStep(s.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === s.num
                  ? "bg-[#fa0079] text-white shadow-[0_0_12px_rgba(250,0,121,0.5)]"
                  : "bg-[#1f1934] text-white/60 hover:text-white hover:bg-[#282142]"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                {s.num}
              </span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? "bg-[#1f1934] text-white/90 border-[#382b52] hover:text-white"
                : "bg-red-950/40 text-red-300 border-red-500/30"
            }`}
            title={soundEnabled ? "Som ativado" : "Som desativado"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#fa0079]" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            <span className="text-[11px] hidden sm:inline">{soundEnabled ? "Som ligado" : "Mudo"}</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="p-2 rounded-xl bg-[#1f1934] hover:bg-[#282142] border border-[#382b52] text-white/80 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Reiniciar Simulação"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[11px] hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Interactive Arena */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
        {/* Step Info Panel */}
        <div className="flex-1 max-w-sm text-left bg-gradient-to-br from-[#161226] to-[#0e0c1a] border border-[#2c2242] p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fa0079] text-white font-black text-lg flex items-center justify-center shadow-[0_0_20px_rgba(250,0,121,0.6)]">
              {currentStep}
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#fa0079] tracking-wider uppercase">
                Passo {currentStep} de 8
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {stepsList[currentStep - 1].title}
              </h2>
            </div>
          </div>

          <p className="text-sm text-white/70 leading-relaxed mb-6">
            {stepsList[currentStep - 1].desc}
          </p>

          <div className="p-3.5 bg-[#1b152d] border border-[#34274e] rounded-2xl mb-6">
            <h4 className="text-xs font-bold text-white mb-1">Como interagir nesta tela:</h4>
            <p className="text-xs text-white/60 leading-snug">
              {currentStep === 1 && "Clique em 'Entrar' ou ajuste os campos para acessar a conta do motoboy."}
              {currentStep === 2 && "Visualize os totais e clique no botão 'Ver detalhes' do Pedido #0482."}
              {currentStep === 3 && "Ouça o sinal de despacho e clique em 'Ver detalhes' para aceitar."}
              {currentStep === 4 && "Confira o endereço, cliente e clique em 'Iniciar rota' para navegar."}
              {currentStep === 5 && "Visualize a rota no mapa e clique em 'Cheguei ao destino'."}
              {currentStep === 6 && "Insira o código de 4 dígitos ou clique em 'Confirmar entrega'."}
              {currentStep === 7 && "Veja a celebração com o valor ganho e clique em 'Ver próximo pedido'."}
              {currentStep === 8 && "Filtre as entregas pelas abas e veja o histórico completo."}
            </p>
          </div>

          {/* Quick Prev / Next Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => goToStep(currentStep - 1)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#201a35] hover:bg-[#2c2448] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              type="button"
              disabled={currentStep === 8}
              onClick={() => goToStep(currentStep + 1)}
              className="flex-1 py-2 px-3 rounded-xl bg-[#fa0079] hover:bg-[#e6006e] disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(250,0,121,0.4)] transition-all cursor-pointer"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Live Interactive Phone Frame */}
        <div className="relative">
          <PhoneMockup>
            {currentStep === 1 && (
              <Screen1Login
                interactive={true}
                onLogin={() => goToStep(2)}
              />
            )}
            {currentStep === 2 && (
              <Screen2Home
                onViewDetails={() => goToStep(3)}
                onNavigateTab={(tab) => {
                  if (tab === "entregas") goToStep(8);
                  if (tab === "inicio") goToStep(2);
                }}
              />
            )}
            {currentStep === 3 && (
              <Screen3NewOrderAlert
                onAccept={() => goToStep(4)}
                onLater={() => goToStep(2)}
              />
            )}
            {currentStep === 4 && (
              <Screen4OrderDetails
                onBack={() => goToStep(2)}
                onStartRoute={() => goToStep(5)}
              />
            )}
            {currentStep === 5 && (
              <Screen5RouteMap
                onBack={() => goToStep(4)}
                onArrived={() => goToStep(6)}
              />
            )}
            {currentStep === 6 && (
              <Screen6ConfirmCode
                interactive={true}
                onBack={() => goToStep(5)}
                onConfirm={() => goToStep(7)}
              />
            )}
            {currentStep === 7 && (
              <Screen7DeliveredSuccess
                triggerConfetti={true}
                onNextOrder={() => goToStep(8)}
                onGoHome={() => goToStep(2)}
              />
            )}
            {currentStep === 8 && (
              <Screen8DeliveryHistory
                onBack={() => goToStep(2)}
                onNavigateTab={(tab) => {
                  if (tab === "inicio") goToStep(2);
                }}
              />
            )}
          </PhoneMockup>

          {/* Interactive Mode Pulsing Tag */}
          <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-[#fa0079] to-[#9333ea] rounded-full text-[10px] font-black text-white shadow-[0_0_15px_rgba(250,0,121,0.6)] flex items-center gap-1.5 animate-bounce">
            <Play className="w-2.5 h-2.5 fill-current" />
            SIMULADOR ATIVO
          </div>
        </div>
      </div>
    </div>
  );
}
