"use client";

import React from "react";
import { StepCard } from "./StepCard";
import { Screen1Login } from "./screens/Screen1Login";
import { Screen2Home } from "./screens/Screen2Home";
import { Screen3NewOrderAlert } from "./screens/Screen3NewOrderAlert";
import { Screen4OrderDetails } from "./screens/Screen4OrderDetails";
import { Screen5RouteMap } from "./screens/Screen5RouteMap";
import { Screen6ConfirmCode } from "./screens/Screen6ConfirmCode";
import { Screen7DeliveredSuccess } from "./screens/Screen7DeliveredSuccess";
import { Screen8DeliveryHistory } from "./screens/Screen8DeliveryHistory";

interface ShowcaseGridProps {
  activeGroup: "all" | "part1" | "part2";
  onSelectStep?: (step: number) => void;
}

export function ShowcaseGrid({ activeGroup, onSelectStep }: ShowcaseGridProps) {
  // Steps definitions matching the exact text in reference images
  const stepItems = [
    {
      num: 1,
      title: "Login",
      desc: "Acesso rápido e seguro para o motoboy da loja.",
      group: "part1",
      component: <Screen1Login onLogin={() => onSelectStep?.(2)} />,
    },
    {
      num: 2,
      title: "Tela inicial",
      desc: "Visão geral das entregas do dia.",
      group: "part1",
      component: (
        <Screen2Home
          onViewDetails={() => onSelectStep?.(3)}
          onNavigateTab={(tab) => {
            if (tab === "entregas") onSelectStep?.(8);
          }}
        />
      ),
    },
    {
      num: 3,
      title: "Nova entrega",
      desc: "Notificação automática com som e vibração.",
      group: "part1",
      component: (
        <Screen3NewOrderAlert
          onAccept={() => onSelectStep?.(4)}
          onLater={() => onSelectStep?.(2)}
        />
      ),
    },
    {
      num: 4,
      title: "Detalhes do pedido",
      desc: "Endereço completo, cliente e tempo estimado.",
      group: "part1",
      component: (
        <Screen4OrderDetails
          onBack={() => onSelectStep?.(2)}
          onStartRoute={() => onSelectStep?.(5)}
        />
      ),
    },
    {
      num: 5,
      title: "Rota da entrega",
      desc: "Navegação com um toque no Waze ou Google Maps.",
      group: "part2",
      component: (
        <Screen5RouteMap
          onBack={() => onSelectStep?.(4)}
          onArrived={() => onSelectStep?.(6)}
        />
      ),
    },
    {
      num: 6,
      title: "Confirmação",
      desc: "Cliente informa o código e o motoboy confirma.",
      group: "part2",
      component: (
        <Screen6ConfirmCode
          onBack={() => onSelectStep?.(5)}
          onConfirm={() => onSelectStep?.(7)}
        />
      ),
    },
    {
      num: 7,
      title: "Entrega concluída",
      desc: "Registro da entrega e valor, se configurado pela loja.",
      group: "part2",
      component: (
        <Screen7DeliveredSuccess
          onNextOrder={() => onSelectStep?.(8)}
          onGoHome={() => onSelectStep?.(2)}
        />
      ),
    },
    {
      num: 8,
      title: "Histórico de entregas",
      desc: "Todas as entregas realizadas com status e valores.",
      group: "part2",
      component: (
        <Screen8DeliveryHistory
          onBack={() => onSelectStep?.(2)}
          onNavigateTab={(tab) => {
            if (tab === "inicio") onSelectStep?.(2);
          }}
        />
      ),
    },
  ];

  const visibleSteps = stepItems.filter((item) => {
    if (activeGroup === "all") return true;
    return item.group === activeGroup;
  });

  return (
    <div className="w-full relative z-20 py-8 px-4 sm:px-6">
      {/* Visual Indicator of banner parts */}
      <div className="max-w-7xl mx-auto mb-6 text-center">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#fa0079] bg-[#fa0079]/10 px-3 py-1 rounded-full border border-[#fa0079]/30">
          {activeGroup === "part1"
            ? "Módulo 1: Do Acesso ao Despacho (Passos 1 ao 4)"
            : activeGroup === "part2"
            ? "Módulo 2: Da Rota à Finalização (Passos 5 ao 8)"
            : "Fluxo Completo de Entrega (Passos 1 ao 8)"}
        </span>
      </div>

      {/* Grid of Phone Mockups */}
      <div
        className={`grid gap-8 justify-center mx-auto max-w-[1500px] ${
          activeGroup === "all"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {visibleSteps.map((step) => (
          <StepCard
            key={step.num}
            number={step.num}
            title={step.title}
            description={step.desc}
            onActivateInteractive={() => onSelectStep?.(step.num)}
          >
            {step.component}
          </StepCard>
        ))}
      </div>
    </div>
  );
}
