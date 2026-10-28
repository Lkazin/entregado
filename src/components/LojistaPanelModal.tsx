"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Users,
  KeyRound,
  Package,
  Plus,
  Trash2,
  Copy,
  Check,
  Send,
  Building2,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Bike
} from "lucide-react";
import { Store, StoreInvite, StoreCourierLink, Order } from "@/types/delivery";

interface LojistaPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStore: Store | null;
  onOrderDispatched?: (order: Order) => void;
}

export function LojistaPanelModal({
  isOpen,
  onClose,
  activeStore,
  onOrderDispatched,
}: LojistaPanelModalProps) {
  const [activeTab, setActiveTab] = useState<"entregadores" | "convites" | "despachar">("entregadores");
  const [couriers, setCouriers] = useState<StoreCourierLink[]>([]);
  const [invites, setInvites] = useState<StoreInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form for new order dispatch
  const [customerName, setCustomerName] = useState("Mariana Souza");
  const [customerPhone, setCustomerPhone] = useState("(51) 98765-4321");
  const [destinationAddress, setDestinationAddress] = useState("Rua das Flores, 456");
  const [destinationNeighborhood, setDestinationNeighborhood] = useState("Bairro Centro - Canoas/RS");
  const [orderValue, setOrderValue] = useState("48.90");
  const [deliveryFee, setDeliveryFee] = useState("8.00");
  const [selectedCourierId, setSelectedCourierId] = useState<string>("mb-001");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storeId = activeStore?.id || "store-acai-01";
  const storeName = activeStore?.name || "Açaí do Rei";

  const loadLojistaData = async () => {
    if (!storeId) return;
    setIsLoading(true);
    try {
      const [resCouriers, resInvites] = await Promise.all([
        fetch(`/api/stores/${storeId}/couriers`).then((r) => r.json()),
        fetch(`/api/stores/${storeId}/invites`).then((r) => r.json()),
      ]);

      if (resCouriers?.couriers) {
        setCouriers(resCouriers.couriers);
        if (resCouriers.couriers.length > 0 && !selectedCourierId) {
          setSelectedCourierId(resCouriers.couriers[0].courierId);
        }
      }
      if (resInvites?.invites) {
        setInvites(resInvites.invites);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do lojista:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadLojistaData();
      setActionMsg(null);
    }
  }, [isOpen, storeId]);

  const handleGenerateInvite = async () => {
    try {
      const res = await fetch(`/api/stores/${storeId}/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxUses: 1, validityHours: 48 }),
      });
      const data = await res.json();
      if (data.success && data.invite) {
        setInvites([data.invite, ...invites]);
        setActionMsg({ text: `Novo código gerado: ${data.invite.code}`, type: "success" });
      } else {
        setActionMsg({ text: data.error || "Erro ao gerar código.", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Erro ao conectar com o servidor.", type: "error" });
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/invites`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });
      const data = await res.json();
      if (data.success) {
        setInvites(invites.map((i) => (i.id === inviteId ? { ...i, isRevoked: true } : i)));
        setActionMsg({ text: "Código revogado com sucesso.", type: "success" });
      }
    } catch {
      setActionMsg({ text: "Erro ao revogar código.", type: "error" });
    }
  };

  const handleRevokeCourier = async (courierId: string) => {
    try {
      const res = await fetch(`/api/stores/${storeId}/couriers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courierId }),
      });
      const data = await res.json();
      if (data.success) {
        setCouriers(
          couriers.map((c) => (c.courierId === courierId ? { ...c, status: "revoked" } : c))
        );
        setActionMsg({ text: "Acesso do entregador revogado.", type: "success" });
      }
    } catch {
      setActionMsg({ text: "Erro ao revogar acesso.", type: "error" });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setActionMsg(null);

    try {
      const res = await fetch(`/api/stores/${storeId}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          destinationAddress,
          destinationNeighborhood,
          orderValue: Number(orderValue),
          deliveryFee: Number(deliveryFee),
          assignedCourierId: selectedCourierId || "mb-001",
          confirmationCode: "1742",
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setActionMsg({
          text: `Pedido ${data.order.orderNumber} despachado com sucesso!`,
          type: "success",
        });
        if (onOrderDispatched) {
          onOrderDispatched(data.order);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setActionMsg({ text: data.error || "Erro ao despachar pedido.", type: "error" });
      }
    } catch {
      setActionMsg({ text: "Falha na comunicação com o servidor.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] bg-[#130f22] border border-[#3b2a59] rounded-3xl flex flex-col overflow-hidden shadow-2xl mx-auto">
        {/* Header */}
        <div className="p-4 border-b border-[#2b1f42] flex items-center justify-between bg-[#19132c]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fa0079]/20 border border-[#fa0079]/40 flex items-center justify-center text-[#fa0079]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                Painel do Lojista • {storeName}
              </h2>
              <p className="text-[10px] text-white/50">Gerenciar entregadores, convites e despachos</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="grid grid-cols-3 p-1 bg-[#0d0918] border-b border-[#2b1f42] text-center text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("entregadores")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "entregadores"
                ? "bg-[#fa0079] text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Meus Entregadores
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("convites")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "convites"
                ? "bg-[#fa0079] text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Códigos Convite
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("despachar")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "despachar"
                ? "bg-[#fa0079] text-white shadow-md"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Despachar
          </button>
        </div>

        {/* Action message banner */}
        {actionMsg && (
          <div
            className={`mx-4 mt-3 p-2.5 rounded-xl border text-[10px] flex items-center gap-2 ${
              actionMsg.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/80 border-red-500/40 text-red-300"
            }`}
          >
            {actionMsg.type === "success" ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            )}
            <span>{actionMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Meus Entregadores */}
        {activeTab === "entregadores" && (
          <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh] custom-scrollbar text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Entregadores Vinculados ({couriers.filter((c) => c.status === "active").length})
              </span>
              <button
                type="button"
                onClick={loadLojistaData}
                className="text-[9px] text-[#fa0079] hover:underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} /> Atualizar
              </button>
            </div>

            {couriers.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#19142b] border border-[#2e204a] text-center text-white/60 text-[11px]">
                Nenhum entregador vinculado a esta loja ainda.
                <div className="mt-2 text-[10px] text-white/40">
                  Gere um código de convite na aba "Códigos Convite" e compartilhe com seu entregador!
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {couriers.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#181329] border border-[#2f2249] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Bike className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{item.courierName}</span>
                          <span
                            className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              item.status === "active"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {item.status === "active" ? "Ativo" : "Revogado"}
                          </span>
                        </div>
                        <div className="text-[9.5px] text-white/50">
                          {item.courierVehicle} • Placa {item.courierPlate}
                        </div>
                        <div className="text-[9px] text-white/40">Tel: {item.courierPhone}</div>
                      </div>
                    </div>

                    {item.status === "active" ? (
                      <button
                        type="button"
                        onClick={() => handleRevokeCourier(item.courierId)}
                        className="px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900/60 text-[9.5px] font-bold flex items-center gap-1 transition-all"
                        title="Revogar acesso do entregador"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" /> Desvincular
                      </button>
                    ) : (
                      <span className="text-[9px] text-red-400/70 italic">Acesso Revogado</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Códigos de Convite */}
        {activeTab === "convites" && (
          <div className="p-4 overflow-y-auto space-y-3 max-h-[60vh] custom-scrollbar text-left">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                Códigos de Acesso
              </span>
              <button
                type="button"
                onClick={handleGenerateInvite}
                className="px-2.5 py-1.5 bg-[#fa0079] hover:bg-[#e6006e] text-white rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Gerar Novo Convite
              </button>
            </div>

            <p className="text-[10px] text-white/50">
              Copie o código abaixo e envie pelo WhatsApp para o seu entregador vincular o aplicativo à sua loja.
            </p>

            <div className="space-y-2">
              {invites.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-2xl bg-[#181329] border border-[#2f2249] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-white tracking-wider">
                        {inv.code}
                      </span>
                      {inv.isRevoked ? (
                        <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold uppercase">
                          Revogado
                        </span>
                      ) : (
                        <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                          Disponível
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-white/50 mt-0.5">
                      Usos: {inv.usedCount}/{inv.maxUses} • Válido por 48h
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(inv.code)}
                      className="p-1.5 rounded-lg bg-[#2b1f42] text-white/80 hover:text-white transition-colors"
                      title="Copiar código"
                    >
                      {copiedCode === inv.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {!inv.isRevoked && (
                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(inv.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-colors"
                        title="Revogar este código"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Despachar Pedido */}
        {activeTab === "despachar" && (
          <form
            onSubmit={handleDispatchOrder}
            className="p-4 overflow-y-auto space-y-2.5 max-h-[60vh] custom-scrollbar text-left"
          >
            <div>
              <label className="text-[9.5px] font-bold text-white/70 uppercase">
                Selecionar Entregador da Loja
              </label>
              <select
                value={selectedCourierId}
                onChange={(e) => setSelectedCourierId(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
              >
                {couriers
                  .filter((c) => c.status === "active")
                  .map((c) => (
                    <option key={c.courierId} value={c.courierId}>
                      {c.courierName} ({c.courierVehicle} - {c.courierPlate})
                    </option>
                  ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Telefone WhatsApp</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[9.5px] font-bold text-white/70 uppercase">Endereço de Entrega</label>
              <input
                type="text"
                required
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[9.5px] font-bold text-white/70 uppercase">Bairro / Cidade</label>
              <input
                type="text"
                required
                value={destinationNeighborhood}
                onChange={(e) => setDestinationNeighborhood(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Valor do Pedido (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={orderValue}
                  onChange={(e) => setOrderValue(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold text-white/70 uppercase">Taxa de Entrega (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#1b152b] border border-[#32234c] focus:border-[#fa0079] rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-3 bg-gradient-to-r from-[#fa0079] to-[#d60065] text-white text-xs font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enviando Pedido...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Pedido ao Entregador
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
