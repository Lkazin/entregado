import React from "react";
import { ScooterLogo } from "./icons";
import { CheckCircle2, ShieldCheck, Zap, Smartphone, MapPin, Database } from "lucide-react";

export function FooterSpecs() {
  return (
    <footer className="w-full relative z-20 mt-16 pt-12 pb-16 px-4 sm:px-8 border-t border-[#291f3d] bg-[#090712]/90 backdrop-blur-md text-white/70">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top summary grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {/* Col 1: Project Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ScooterLogo className="w-8 h-6 text-[#fa0079]" />
              <div className="text-base font-black">
                <span className="text-white">NOVAES</span>
                <span className="text-[#fa0079]">WEB</span>
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              <strong>Projeto 01 — Novaes Entregador Exclusivo</strong>: Ambiente exclusivo para os motoboys próprios de cada loja com vínculo direto, seguro e sem compartilhamento com concorrentes.
            </p>
          </div>

          {/* Col 2: Regras Definidas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#fa0079]" />
              Diretrizes de Negócio
            </h4>
            <ul className="text-xs text-white/60 space-y-1.5">
              <li>• Sem botão disponível/indisponível (mitigação de vínculo trabalhista).</li>
              <li>• Sem busca automática: o lojista faz a atribuição manual.</li>
              <li>• Não duplica sistema de pedidos; integra ao checkout da loja.</li>
            </ul>
          </div>

          {/* Col 3: Tecnologias & Segurança */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#fa0079]" />
              Stack & Performance
            </h4>
            <ul className="text-xs text-white/60 space-y-1.5">
              <li>• Next.js App Router, TypeScript & Tailwind CSS.</li>
              <li>• Notificações Web Push com alerta sonoro e vibração.</li>
              <li>• Suporte a PWA instalável offline-first.</li>
            </ul>
          </div>

          {/* Col 4: Roadmap Futuro */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#fa0079]" />
              Adicional Premium Futuro
            </h4>
            <p className="text-xs text-white/60 leading-relaxed">
              <strong>Novaes GPS Live</strong>: Rastreamento em tempo real do motoboy no mapa para o cliente com previsão de chegada, acionado somente durante a corrida com desligamento automático.
            </p>
          </div>
        </div>

        {/* Bottom copyright and status */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <span>
            © 2026 NovaesWeb • Planejamento e Design de Interfaces Profissionais
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Reconstrução de Interface 100% Conforme Imagem de Referência
          </span>
        </div>
      </div>
    </footer>
  );
}
