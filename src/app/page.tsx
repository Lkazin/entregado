"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Screen1Login } from "@/components/screens/Screen1Login";
import { Screen2Home } from "@/components/screens/Screen2Home";
import { Screen3NewOrderAlert } from "@/components/screens/Screen3NewOrderAlert";
import { Screen4OrderDetails } from "@/components/screens/Screen4OrderDetails";
import { Screen5RouteMap } from "@/components/screens/Screen5RouteMap";
import { Screen6ConfirmCode } from "@/components/screens/Screen6ConfirmCode";
import { Screen7DeliveredSuccess } from "@/components/screens/Screen7DeliveredSuccess";
import { Screen8DeliveryHistory } from "@/components/screens/Screen8DeliveryHistory";
import { ScreenReviews } from "@/components/screens/ScreenReviews";
import { ScreenProfile } from "@/components/screens/ScreenProfile";
import { ScreenLinkStore } from "@/components/screens/ScreenLinkStore";
import { BackgroundNeonGlow } from "@/components/BackgroundNeonGlow";
import { Order, DeliveryStats, MotoboyProfile, Store, StoreCourierLink } from "@/types/delivery";
import { Volume2, VolumeX, Database, RefreshCw, KeyRound, Building2 } from "lucide-react";

export default function DeliveryAppMain() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // App Navigation States
  const [activeTab, setActiveTab] = useState<"inicio" | "entregas" | "avaliacoes" | "perfil">("inicio");
  const [activeScreen, setActiveScreen] = useState<
    "tab_view" | "vincular_loja" | "nova_entrega" | "detalhes" | "rota" | "confirmacao" | "concluida"
  >("tab_view");

  // Operational Data from Backend Database
  const [motoboy, setMotoboy] = useState<MotoboyProfile | null>(null);
  const [storesList, setStoresList] = useState<Store[]>([]);
  const [courierLinks, setCourierLinks] = useState<StoreCourierLink[]>([]);
  const [activeStore, setActiveStore] = useState<Store | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Load initial session and database records
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [resAuth, resStores, resLinks] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()).catch(() => null),
        fetch("/api/stores").then((r) => r.json()).catch(() => null),
        fetch("/api/courier/stores").then((r) => r.json()).catch(() => null),
      ]);

      let courierId = "mb-001";
      if (resAuth?.motoboy) {
        setMotoboy(resAuth.motoboy);
        courierId = resAuth.motoboy.id;
      }

      let allStores: Store[] = [];
      if (resStores?.stores) {
        setStoresList(resStores.stores);
        allStores = resStores.stores;
      }

      let currentLinks: StoreCourierLink[] = [];
      if (resLinks?.links) {
        setCourierLinks(resLinks.links);
        currentLinks = resLinks.links;
      }

      // Determine active store from active links
      let selectedStore: Store | null = null;
      if (currentLinks.length > 0) {
        selectedStore = allStores.find((s) => s.id === currentLinks[0].storeId) || allStores[0] || null;
      } else if (allStores.length > 0) {
        selectedStore = allStores[0];
      }
      setActiveStore(selectedStore);

      // If active store found, fetch isolated orders and stats for this courier + store
      if (selectedStore) {
        const [resOrders, resStats] = await Promise.all([
          fetch(`/api/orders?courierId=${courierId}&storeId=${selectedStore.id}`).then((r) => r.json()).catch(() => null),
          fetch(`/api/stats?courierId=${courierId}&storeId=${selectedStore.id}`).then((r) => r.json()).catch(() => null),
        ]);

        if (resOrders?.orders) {
          setOrders(resOrders.orders);
          const activeOrWaiting =
            resOrders.orders.find(
              (o: Order) => o.status === "em_rota" || o.status === "aguardando_retirada"
            ) || resOrders.orders[0];
          setCurrentOrder(activeOrWaiting || null);
        } else {
          setOrders([]);
          setCurrentOrder(null);
        }

        if (resStats) {
          setStats(resStats);
        }
      }
    } catch (err) {
      console.error("Falha ao carregar dados do banco:", err);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem("novaesweb_session");
    if (session) {
      setIsAuthenticated(true);
    }
    loadData();
  }, [loadData]);

  // Handle Login with strict password validation
  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("novaesweb_session", "active");
        setIsAuthenticated(true);
        await loadData();
        return { success: true };
      }
      return { success: false, error: data.error || "Credenciais inválidas" };
    } catch {
      return { success: false, error: "Falha na conexão com o servidor" };
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("novaesweb_session");
    setIsAuthenticated(false);
    setActiveScreen("tab_view");
    setActiveTab("inicio");
  };

  // Start route API call
  const handleStartRoute = async () => {
    if (currentOrder) {
      try {
        await fetch(`/api/orders/${currentOrder.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "em_rota" }),
        });
      } catch (err) {
        console.error(err);
      }
    }
    setActiveScreen("rota");
  };

  // Confirm delivery OTP API call
  const handleConfirmDelivery = async (code: string): Promise<boolean> => {
    if (!currentOrder) return false;
    try {
      const res = await fetch(`/api/orders/${currentOrder.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        setActiveScreen("concluida");
        return true;
      }
      return false;
    } catch {
      setActiveScreen("concluida");
      return true;
    }
  };

  // Switch Active Store
  const handleSwitchStore = async (storeId: string) => {
    try {
      const res = await fetch("/api/stores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId }),
      });
      const data = await res.json();
      if (data.activeStore) {
        setActiveStore(data.activeStore);
      }
      await loadData();
      setActiveScreen("tab_view");
    } catch (err) {
      console.error("Erro ao alternar loja:", err);
    }
  };

  // When a store is newly linked via Invite Code
  const handleLinkSuccess = async (link: StoreCourierLink) => {
    await loadData();
    const store = storesList.find((s) => s.id === link.storeId);
    if (store) {
      setActiveStore(store);
    }
    setActiveScreen("tab_view");
  };

  // When Lojista dispatches an order
  const handleOrderDispatched = async (newOrder: Order) => {
    setCurrentOrder(newOrder);
    await loadData();
    setActiveScreen("nova_entrega");
  };

  // Update profile
  const handleUpdateProfile = async (updates: Partial<MotoboyProfile>) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.motoboy) {
        setMotoboy(data.motoboy);
      }
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07040d] text-white flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-[#fa0079] selection:text-white">
      {/* Background ambient lighting */}
      <BackgroundNeonGlow />

      {/* Top Functional Control & Database Info Bar */}
      <header className="w-full max-w-md bg-[#130f22]/95 backdrop-blur-md border-b border-[#2d2242] px-3.5 py-2 flex items-center justify-between z-30 shrink-0 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[10px] font-bold tracking-tight text-white/90 uppercase flex items-center gap-1">
            <Database className="w-3 h-3 text-[#38bdf8]" /> Supabase Conectado
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Link store button shortcut */}
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setActiveScreen("vincular_loja")}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all flex items-center gap-1 ${
                activeScreen === "vincular_loja"
                  ? "bg-[#fa0079] text-white"
                  : "bg-[#1f1932] text-white/80 hover:text-white"
              }`}
              title="Vincular a nova loja"
            >
              <KeyRound className="w-2.5 h-2.5 text-[#fa0079]" />
              <span>Código</span>
            </button>
          )}

          {/* Refresh DB state */}
          <button
            type="button"
            onClick={loadData}
            className={`p-1 rounded-lg bg-[#1f1932] text-white/70 hover:text-white transition-all ${
              isRefreshing ? "animate-spin text-[#fa0079]" : ""
            }`}
            title="Sincronizar banco de dados"
          >
            <RefreshCw className="w-3 h-3" />
          </button>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded-lg bg-[#1f1932] text-white/70 hover:text-white"
            title={soundEnabled ? "Som ativado" : "Som mudo"}
          >
            {soundEnabled ? (
              <Volume2 className="w-3 h-3 text-[#fa0079]" />
            ) : (
              <VolumeX className="w-3 h-3 text-white/40" />
            )}
          </button>
        </div>
      </header>

      {/* Main Delivery Mobile App Container (390px to 430px standard mobile container) */}
      <main className="w-full max-w-md h-[calc(100dvh-44px)] sm:h-[844px] flex flex-col bg-[#0b0813] relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-x border-b border-[#2d2242] sm:rounded-b-3xl">
        {/* VIEW 1: Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <Screen1Login interactive={true} onLogin={handleLogin} />
        ) : (
          <>
            {/* VIEW 2: Link Store Screen (when requested or when 0 active links) */}
            {activeScreen === "vincular_loja" && (
              <ScreenLinkStore
                linkedStores={courierLinks}
                activeStore={activeStore}
                onLinkSuccess={handleLinkSuccess}
                onSelectStore={handleSwitchStore}
                onSkip={() => setActiveScreen("tab_view")}
              />
            )}

            {/* VIEW 3: Operational Delivery Flow Screens */}
            {activeScreen === "nova_entrega" && (
              <Screen3NewOrderAlert
                order={currentOrder}
                soundEnabled={soundEnabled}
                onAccept={() => setActiveScreen("detalhes")}
                onLater={() => setActiveScreen("tab_view")}
              />
            )}

            {activeScreen === "detalhes" && (
              <Screen4OrderDetails
                order={currentOrder}
                onBack={() => setActiveScreen("tab_view")}
                onStartRoute={handleStartRoute}
              />
            )}

            {activeScreen === "rota" && (
              <Screen5RouteMap
                order={currentOrder}
                onBack={() => setActiveScreen("detalhes")}
                onArrived={() => setActiveScreen("confirmacao")}
              />
            )}

            {activeScreen === "confirmacao" && (
              <Screen6ConfirmCode
                order={currentOrder}
                onBack={() => setActiveScreen("rota")}
                onConfirm={handleConfirmDelivery}
              />
            )}

            {activeScreen === "concluida" && (
              <Screen7DeliveredSuccess
                order={currentOrder}
                onNextOrder={() => {
                  setActiveScreen("tab_view");
                  setActiveTab("entregas");
                }}
                onGoHome={() => {
                  setActiveScreen("tab_view");
                  setActiveTab("inicio");
                }}
              />
            )}

            {/* VIEW 4: Main Tabs View (Início, Entregas, Avaliações, Perfil) */}
            {activeScreen === "tab_view" && (
              <>
                {activeTab === "inicio" && (
                  <Screen2Home
                    order={currentOrder}
                    stats={stats}
                    motoboy={motoboy}
                    activeStore={activeStore}
                    storesList={storesList}
                    courierLinks={courierLinks}
                    activeTab="inicio"
                    onViewDetails={() => setActiveScreen("detalhes")}
                    onNavigateTab={(tab) =>
                      setActiveTab(tab as "inicio" | "entregas" | "avaliacoes" | "perfil")
                    }
                    onSwitchStore={handleSwitchStore}
                    onOpenLinkStore={() => setActiveScreen("vincular_loja")}
                    onOrderDispatched={handleOrderDispatched}
                  />
                )}

                {activeTab === "entregas" && (
                  <Screen8DeliveryHistory
                    orders={orders}
                    activeTab="entregas"
                    onBack={() => setActiveTab("inicio")}
                    onSelectOrder={(sel) => {
                      setCurrentOrder(sel);
                      setActiveScreen("detalhes");
                    }}
                    onNavigateTab={(tab) =>
                      setActiveTab(tab as "inicio" | "entregas" | "avaliacoes" | "perfil")
                    }
                  />
                )}

                {activeTab === "avaliacoes" && (
                  <ScreenReviews
                    activeTab="avaliacoes"
                    onBack={() => setActiveTab("inicio")}
                    onNavigateTab={(tab) =>
                      setActiveTab(tab as "inicio" | "entregas" | "avaliacoes" | "perfil")
                    }
                  />
                )}

                {activeTab === "perfil" && (
                  <ScreenProfile
                    motoboy={motoboy}
                    activeStore={activeStore}
                    stats={stats}
                    activeTab="perfil"
                    onLogout={handleLogout}
                    onUpdateProfile={handleUpdateProfile}
                    onNavigateTab={(tab) =>
                      setActiveTab(tab as "inicio" | "entregas" | "avaliacoes" | "perfil")
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
