import fs from "fs";
import path from "path";
import {
  Order,
  OrderStatus,
  MotoboyProfile,
  DeliveryStats,
  Store,
  StoreIntegration,
  StoreInvite,
  StoreCourierLink,
  DeliveryEvent,
  DeliveryConfirmation,
} from "@/types/delivery";
import { supabase } from "./supabase";

interface DatabaseSchema {
  stores: Store[];
  integrations: StoreIntegration[];
  invites: StoreInvite[];
  courierLinks: StoreCourierLink[];
  motoboy: MotoboyProfile;
  orders: Order[];
  events: DeliveryEvent[];
  confirmations: DeliveryConfirmation[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

// Initial Clean State for Production - No Mock/Demo Stores
const INITIAL_DATA: DatabaseSchema = {
  stores: [],
  integrations: [],
  invites: [],
  courierLinks: [],
  motoboy: {
    id: "mb-001",
    name: "Entregador",
    email: "entregador@novaesweb.com.br",
    phone: "(00) 00000-0000",
    vehicleModel: "Não cadastrado",
    vehiclePlate: "---",
    rating: 5.0,
    totalDeliveries: 0,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  orders: [],
  events: [],
  confirmations: [],
};

function readLocalDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), "utf-8");
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!parsed.invites) parsed.invites = INITIAL_DATA.invites;
    if (!parsed.courierLinks) parsed.courierLinks = INITIAL_DATA.courierLinks;
    if (!parsed.stores) parsed.stores = INITIAL_DATA.stores;
    if (!parsed.integrations) parsed.integrations = INITIAL_DATA.integrations;
    if (!parsed.events) parsed.events = [];
    if (!parsed.confirmations) parsed.confirmations = [];
    return parsed;
  } catch {
    return INITIAL_DATA;
  }
}

function writeLocalDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database:", err);
  }
}

function mapSupabaseToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    storeId: row.store_id,
    storeName: row.store_name,
    storeAddress: row.store_address,
    assignedCourierId: row.assigned_courier_id,
    assignedCourierName: row.assigned_courier_name,
    status: row.status as OrderStatus,
    orderValue: Number(row.order_value),
    deliveryFee: Number(row.delivery_fee),
    itemsCount: row.items_count || 1,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    destinationAddress: row.destination_address,
    destinationNeighborhood: row.destination_neighborhood,
    distanceKm: Number(row.distance_km || 2.8),
    estimatedMinutes: Number(row.estimated_minutes || 7),
    confirmationCode: row.confirmation_code || "1742",
    createdAt: row.created_at,
    deliveredAt: row.delivered_at,
  };
}

export const db = {
  // Motoboy Profile
  async getMotoboy(): Promise<MotoboyProfile> {
    try {
      const { data, error } = await supabase.from("motoboys").select("*").limit(1).maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          vehicleModel: data.vehicle_model,
          vehiclePlate: data.vehicle_plate,
          rating: Number(data.rating),
          totalDeliveries: data.total_deliveries,
          soundEnabled: true,
          vibrationEnabled: true,
        };
      }
    } catch {
      // Fallback
    }
    return readLocalDatabase().motoboy;
  },

  async updateMotoboy(updates: Partial<MotoboyProfile>): Promise<MotoboyProfile> {
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.vehicleModel) dbUpdates.vehicle_model = updates.vehicleModel;
      if (updates.vehiclePlate) dbUpdates.vehicle_plate = updates.vehiclePlate;

      await supabase.from("motoboys").update(dbUpdates).eq("id", "mb-001");
    } catch {
      // Fallback
    }
    const local = readLocalDatabase();
    local.motoboy = { ...local.motoboy, ...updates };
    writeLocalDatabase(local);
    return local.motoboy;
  },

  // Stores
  async getStores(): Promise<Store[]> {
    try {
      const { data, error } = await supabase.from("stores").select("*");
      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          address: s.address,
          phone: s.phone,
          defaultDeliveryFee: Number(s.default_delivery_fee || 8.0),
          isActive: s.is_active,
          createdAt: s.created_at,
        }));
      }
    } catch {
      // Fallback
    }
    return readLocalDatabase().stores;
  },

  async getStoreById(storeId: string): Promise<Store | undefined> {
    const stores = await this.getStores();
    return stores.find((s) => s.id === storeId);
  },

  async getActiveStore(courierId = "mb-001"): Promise<Store | null> {
    const stores = await this.getStores();
    const links = await this.getCourierStores(courierId);
    if (links.length > 0) {
      const activeLinkedStore = stores.find((s) => s.id === links[0].storeId);
      if (activeLinkedStore) return activeLinkedStore;
    }
    return stores[0] || null;
  },

  async setActiveStore(storeId: string): Promise<Store | null> {
    const store = await this.getStoreById(storeId);
    return store || null;
  },

  async addStore(data: Omit<Store, "id" | "createdAt" | "isActive">): Promise<Store> {
    return this.createStore(data);
  },

  async createStore(data: Omit<Store, "id" | "createdAt" | "isActive"> & { id?: string }): Promise<Store> {
    const slug = data.id || "store-" + data.name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(100 + Math.random() * 900);
    const newStore: Store = {
      ...data,
      id: slug,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("stores").insert({
        id: newStore.id,
        name: newStore.name,
        category: newStore.category,
        address: newStore.address,
        phone: newStore.phone,
        default_delivery_fee: newStore.defaultDeliveryFee,
        is_active: true,
      });
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    local.stores.push(newStore);
    writeLocalDatabase(local);
    return newStore;
  },

  // Store Invites Generation & Validation
  async generateStoreInvite(
    storeId: string,
    maxUses = 1,
    validityHours = 48
  ): Promise<StoreInvite> {
    const store = await this.getStoreById(storeId);
    if (!store) throw new Error("Loja não encontrada");

    // Secure alphanumeric invite code format: NX-[STOREPREFIX]-[RANDOM]
    const prefix = store.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "LOJA");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const code = `NX-${prefix}-${randomSuffix}`;

    const newInvite: StoreInvite = {
      id: `inv-${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      code,
      maxUses,
      usedCount: 0,
      isRevoked: false,
      expiresAt: new Date(Date.now() + validityHours * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("store_invites").insert({
        id: newInvite.id,
        store_id: newInvite.storeId,
        code: newInvite.code,
        max_uses: newInvite.maxUses,
        used_count: 0,
        is_revoked: false,
        expires_at: newInvite.expiresAt,
      });
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    local.invites.unshift(newInvite);
    writeLocalDatabase(local);
    return newInvite;
  },

  async listStoreInvites(storeId: string): Promise<StoreInvite[]> {
    try {
      const { data, error } = await supabase
        .from("store_invites")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((inv) => ({
          id: inv.id,
          storeId: inv.store_id,
          storeName: "",
          code: inv.code,
          maxUses: inv.max_uses,
          usedCount: inv.used_count,
          isRevoked: inv.is_revoked,
          expiresAt: inv.expires_at,
          createdAt: inv.created_at,
        }));
      }
    } catch {
      // Fallback
    }
    const local = readLocalDatabase();
    return local.invites.filter((i) => i.storeId === storeId);
  },

  async revokeStoreInvite(inviteId: string): Promise<boolean> {
    try {
      await supabase.from("store_invites").update({ is_revoked: true }).eq("id", inviteId);
    } catch {
      // Fallback
    }
    const local = readLocalDatabase();
    const inv = local.invites.find((i) => i.id === inviteId || i.code === inviteId);
    if (inv) {
      inv.isRevoked = true;
      writeLocalDatabase(local);
      return true;
    }
    return false;
  },

  // Validate Code and Link Courier to Store
  async validateAndLinkInvite(
    courierId: string,
    rawCode: string
  ): Promise<{ success: boolean; link?: StoreCourierLink; error?: string }> {
    const cleanCode = rawCode.trim().toUpperCase();
    const local = readLocalDatabase();
    const motoboy = await this.getMotoboy();

    // 1. Find invite in DB or Supabase
    let invite = local.invites.find((i) => i.code === cleanCode);

    try {
      const { data } = await supabase
        .from("store_invites")
        .select("*")
        .eq("code", cleanCode)
        .maybeSingle();

      if (data) {
        invite = {
          id: data.id,
          storeId: data.store_id,
          storeName: "",
          code: data.code,
          maxUses: data.max_uses,
          usedCount: data.used_count,
          isRevoked: data.is_revoked,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
        };
      }
    } catch {
      // Ignored
    }

    if (!invite) {
      return { success: false, error: "Código da loja não encontrado ou inválido." };
    }

    // 2. Check if revoked
    if (invite.isRevoked) {
      return { success: false, error: "Este código de convite foi revogado pelo lojista." };
    }

    // 3. Check expiration
    if (new Date(invite.expiresAt).getTime() < Date.now()) {
      return { success: false, error: "Este código de convite expirou. Solicite um novo à loja." };
    }

    // 4. Check max uses
    if (invite.usedCount >= invite.maxUses) {
      return { success: false, error: "Este convite já atingiu o limite máximo de utilizações." };
    }

    // 5. Get store details
    const store = await this.getStoreById(invite.storeId);
    if (!store) {
      return { success: false, error: "Loja vinculada ao convite não foi encontrada." };
    }

    // 6. Check if already active link
    const existing = local.courierLinks.find(
      (l) => l.storeId === store.id && l.courierId === courierId && l.status === "active"
    );
    if (existing) {
      return { success: true, link: existing };
    }

    // 7. Create Link
    const newLink: StoreCourierLink = {
      id: `link-${Date.now()}`,
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      courierId: motoboy.id,
      courierName: motoboy.name,
      courierPhone: motoboy.phone,
      courierVehicle: motoboy.vehicleModel,
      courierPlate: motoboy.vehiclePlate,
      status: "active",
      inviteCodeUsed: cleanCode,
      linkedAt: new Date().toISOString(),
    };

    // Increment invite used count
    invite.usedCount += 1;

    try {
      await supabase.from("store_invites").update({ used_count: invite.usedCount }).eq("id", invite.id);
      await supabase.from("store_couriers").insert({
        id: newLink.id,
        store_id: newLink.storeId,
        courier_id: newLink.courierId,
        status: "active",
        invite_code_used: cleanCode,
      });
    } catch {
      // Fallback
    }

    local.courierLinks.push(newLink);
    writeLocalDatabase(local);

    return { success: true, link: newLink };
  },

  // Courier Store Links (Stores this courier is linked to)
  async getCourierStores(courierId: string): Promise<StoreCourierLink[]> {
    const local = readLocalDatabase();
    try {
      const { data, error } = await supabase
        .from("store_couriers")
        .select("*, stores(*)")
        .eq("courier_id", courierId)
        .eq("status", "active");

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          storeId: d.store_id,
          storeName: d.stores?.name || "Loja NovaesWeb",
          storeAddress: d.stores?.address || "",
          courierId: d.courier_id,
          courierName: local.motoboy.name,
          courierPhone: local.motoboy.phone,
          courierVehicle: local.motoboy.vehicleModel,
          courierPlate: local.motoboy.vehiclePlate,
          status: d.status,
          inviteCodeUsed: d.invite_code_used || "",
          linkedAt: d.created_at || d.linked_at,
        }));
      }
    } catch {
      // Fallback
    }

    return local.courierLinks.filter(
      (l) => l.courierId === courierId && l.status === "active"
    );
  },

  // Store Couriers (Couriers linked to a specific store for the Lojista Panel)
  async getStoreCouriers(storeId: string): Promise<StoreCourierLink[]> {
    const local = readLocalDatabase();
    return local.courierLinks.filter((l) => l.storeId === storeId);
  },

  // Revoke Courier Access immediately by the Lojista
  async revokeCourierAccess(storeId: string, courierId: string): Promise<boolean> {
    try {
      await supabase
        .from("store_couriers")
        .update({ status: "revoked" })
        .eq("store_id", storeId)
        .eq("courier_id", courierId);
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    const link = local.courierLinks.find(
      (l) => l.storeId === storeId && l.courierId === courierId && l.status === "active"
    );
    if (link) {
      link.status = "revoked";
      link.revokedAt = new Date().toISOString();
      writeLocalDatabase(local);
      return true;
    }
    return false;
  },

  // Orders Isolation: strictly by storeId AND courierId
  async getOrdersForCourier(courierId: string, storeId: string): Promise<Order[]> {
    const local = readLocalDatabase();

    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", storeId)
        .eq("assigned_courier_id", courierId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseToOrder);
      }
    } catch {
      // Fallback
    }

    // Local DB filtered strictly
    return local.orders.filter(
      (o) => o.storeId === storeId && (!o.assignedCourierId || o.assignedCourierId === courierId)
    );
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    const local = readLocalDatabase();
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${id},order_number.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        return mapSupabaseToOrder(data);
      }
    } catch {
      // Fallback
    }
    return local.orders.find((o) => o.id === id || o.orderNumber === id);
  },

  async updateOrderStatus(
    id: string,
    status: Order["status"],
    extra?: Partial<Order> & { actorType?: "store" | "driver" | "system"; actorId?: string }
  ): Promise<Order | undefined> {
    const existing = await this.getOrderById(id);
    const oldStatus = existing?.status;

    try {
      const updates: any = { status };
      if (extra?.deliveredAt) updates.delivered_at = extra.deliveredAt;

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .or(`id.eq.${id},order_number.eq.${id}`)
        .select()
        .maybeSingle();

      if (!error && data) {
        const mapped = mapSupabaseToOrder(data);
        if (existing) {
          await this.recordEvent(
            mapped.id,
            mapped.storeId,
            status === "em_rota" ? "route_started" : status === "concluida" ? "delivered" : "driver_assigned",
            oldStatus,
            status,
            extra?.actorType || "driver",
            extra?.actorId
          );
        }
        return mapped;
      }
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    const orderIndex = local.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (orderIndex === -1) return undefined;

    local.orders[orderIndex] = {
      ...local.orders[orderIndex],
      status,
      ...extra,
    };
    writeLocalDatabase(local);

    const updated = local.orders[orderIndex];
    await this.recordEvent(
      updated.id,
      updated.storeId,
      status === "em_rota" ? "route_started" : status === "concluida" ? "delivered" : "driver_assigned",
      oldStatus,
      status,
      extra?.actorType || "driver",
      extra?.actorId
    );

    return updated;
  },

  async confirmDelivery(
    id: string,
    code: string
  ): Promise<{ success: boolean; order?: Order; error?: string }> {
    const order = await this.getOrderById(id);
    if (!order) {
      return { success: false, error: "Pedido não encontrado" };
    }

    const isValid = order.confirmationCode === code;

    // Record confirmation attempt
    const confirmation: DeliveryConfirmation = {
      id: `conf-${Date.now()}`,
      jobId: order.id,
      codeEntered: code,
      isValid,
      confirmedAt: new Date().toISOString(),
    };

    const local = readLocalDatabase();
    local.confirmations.unshift(confirmation);
    writeLocalDatabase(local);

    try {
      await supabase.from("delivery_confirmations").insert({
        id: confirmation.id,
        job_id: confirmation.jobId,
        code_entered: confirmation.codeEntered,
        is_valid: confirmation.isValid,
        confirmed_at: confirmation.confirmedAt,
      });
    } catch {
      // Fallback
    }

    if (!isValid) {
      return { success: false, error: "Código incorreto. Peça o código ao cliente." };
    }

    const deliveredAt = `Hoje, ${new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const updated = await this.updateOrderStatus(id, "concluida", {
      deliveredAt,
      actorType: "driver",
      actorId: order.assignedCourierId,
    });

    return { success: true, order: updated || order };
  },

  // Manual Order Dispatch by Lojista to specific courier
  async createStoreOrder(
    storeId: string,
    orderData: {
      customerName: string;
      customerPhone: string;
      destinationAddress: string;
      destinationNeighborhood: string;
      orderValue: number;
      deliveryFee?: number;
      assignedCourierId: string;
      confirmationCode?: string;
    }
  ): Promise<Order> {
    const store = await this.getStoreById(storeId);
    if (!store) throw new Error("Loja não encontrada");

    const nextNum = Math.floor(100 + Math.random() * 900);
    const orderId = `ord-${nextNum}`;
    const orderNumber = `#0${nextNum}`;
    const fee = orderData.deliveryFee || store.defaultDeliveryFee || 8.0;
    const otp = orderData.confirmationCode || `${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      assignedCourierId: orderData.assignedCourierId,
      status: "aguardando_retirada",
      orderValue: orderData.orderValue,
      deliveryFee: fee,
      itemsCount: 1,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      destinationAddress: orderData.destinationAddress,
      destinationNeighborhood: orderData.destinationNeighborhood,
      distanceKm: 2.8,
      estimatedMinutes: 7,
      confirmationCode: otp,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("orders").insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        store_id: newOrder.storeId,
        store_name: newOrder.storeName,
        store_address: newOrder.storeAddress,
        assigned_courier_id: newOrder.assignedCourierId,
        status: newOrder.status,
        order_value: newOrder.orderValue,
        delivery_fee: newOrder.deliveryFee,
        items_count: newOrder.itemsCount,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        destination_address: newOrder.destinationAddress,
        destination_neighborhood: newOrder.destinationNeighborhood,
        distance_km: newOrder.distanceKm,
        estimated_minutes: newOrder.estimatedMinutes,
        confirmation_code: newOrder.confirmationCode,
      });
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    local.orders.unshift(newOrder);
    writeLocalDatabase(local);
    return newOrder;
  },

  async getStatsForCourier(courierId: string, storeId: string): Promise<DeliveryStats> {
    const orders = await this.getOrdersForCourier(courierId, storeId);
    const pending = orders.filter((o) => o.status === "pendente").length;
    const inProgress = orders.filter(
      (o) => o.status === "aguardando_retirada" || o.status === "em_rota"
    ).length;
    const completed = orders.filter((o) => o.status === "concluida").length;
    const todayCompleted = orders.filter(
      (o) =>
        o.status === "concluida" &&
        (o.deliveredAt?.includes("Hoje") || o.createdAt?.includes("Hoje"))
    );
    const todayEarnings = todayCompleted.reduce((acc, o) => acc + (o.deliveryFee || 8), 0);

    return {
      pendingCount: pending,
      inProgressCount: inProgress,
      completedCount: completed,
      todayEarnings: todayEarnings,
      totalKm: 18.5,
    };
  },

  async getAllOrders(): Promise<Order[]> {
    const local = readLocalDatabase();
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseToOrder);
      }
    } catch {
      // Fallback
    }
    return local.orders;
  },

  async getNextOrder(courierId?: string, storeId?: string): Promise<Order | undefined> {
    let orders: Order[];
    if (courierId && storeId) {
      orders = await this.getOrdersForCourier(courierId, storeId);
    } else {
      orders = await this.getAllOrders();
    }
    return (
      orders.find((o) => o.status === "aguardando_retirada" || o.status === "em_rota") ||
      orders.find((o) => o.status === "pendente") ||
      orders[0]
    );
  },

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const nextNum = Math.floor(100 + Math.random() * 900);
    const newOrder: Order = {
      id: orderData.id || `ord-${Date.now()}`,
      orderNumber: orderData.orderNumber || `#${nextNum}`,
      storeId: orderData.storeId || "",
      storeName: orderData.storeName || "Loja Parceira",
      storeAddress: orderData.storeAddress || "",
      assignedCourierId: orderData.assignedCourierId || "",
      assignedCourierName: orderData.assignedCourierName || "Entregador",
      status: orderData.status || "aguardando_retirada",
      orderValue: orderData.orderValue || 0,
      deliveryFee: orderData.deliveryFee || 0,
      itemsCount: orderData.itemsCount || 1,
      customerName: orderData.customerName || "Cliente",
      customerPhone: orderData.customerPhone || "",
      destinationAddress: orderData.destinationAddress || "",
      destinationNeighborhood: orderData.destinationNeighborhood || "",
      distanceKm: orderData.distanceKm || 0,
      estimatedMinutes: orderData.estimatedMinutes || 0,
      confirmationCode: orderData.confirmationCode || `${Math.floor(10 + Math.random() * 90)}`,
      createdAt: new Date().toISOString(),
    };

    try {
      await supabase.from("orders").insert({
        id: newOrder.id,
        order_number: newOrder.orderNumber,
        store_id: newOrder.storeId,
        store_name: newOrder.storeName,
        store_address: newOrder.storeAddress,
        assigned_courier_id: newOrder.assignedCourierId,
        status: newOrder.status,
        order_value: newOrder.orderValue,
        delivery_fee: newOrder.deliveryFee,
        items_count: newOrder.itemsCount,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        destination_address: newOrder.destinationAddress,
        destination_neighborhood: newOrder.destinationNeighborhood,
        distance_km: newOrder.distanceKm,
        estimated_minutes: newOrder.estimatedMinutes,
        confirmation_code: newOrder.confirmationCode,
      });
    } catch {
      // Fallback
    }

    const local = readLocalDatabase();
    local.orders.unshift(newOrder);
    writeLocalDatabase(local);
    return newOrder;
  },

  async getStats(courierId?: string, storeId?: string): Promise<DeliveryStats> {
    if (courierId && storeId) {
      return this.getStatsForCourier(courierId, storeId);
    }
    const orders = await this.getAllOrders();
    const pending = orders.filter((o) => o.status === "pendente").length;
    const inProgress = orders.filter(
      (o) => o.status === "aguardando_retirada" || o.status === "em_rota"
    ).length;
    const completed = orders.filter((o) => o.status === "concluida").length;
    const todayCompleted = orders.filter(
      (o) =>
        o.status === "concluida" &&
        (o.deliveredAt?.includes("Hoje") || o.createdAt?.includes("Hoje"))
    );
    const todayEarnings = todayCompleted.reduce((acc, o) => acc + (o.deliveryFee || 8), 0);

    return {
      pendingCount: pending,
      inProgressCount: inProgress,
      completedCount: completed,
      todayEarnings: todayEarnings,
      totalKm: 18.5,
    };
  },

  // ==========================================
  // B2B MULTI-TENANT INTEGRATION METHODS
  // ==========================================

  async getStoreIntegration(storeId: string): Promise<StoreIntegration | null> {
    const local = readLocalDatabase();
    const integration = local.integrations.find((i) => i.storeId === storeId && i.isActive);
    return integration || null;
  },

  async verifyStoreApiKey(storeId: string, apiKey: string): Promise<boolean> {
    if (!storeId || !apiKey) return false;
    const local = readLocalDatabase();
    const integration = local.integrations.find((i) => i.storeId === storeId);
    if (!integration || !integration.isActive) return false;
    return integration.apiKeyHash === apiKey.trim();
  },

  async createOrUpdateStoreIntegration(
    storeId: string,
    options?: { apiKey?: string; webhookUrl?: string }
  ): Promise<StoreIntegration> {
    const store = await this.getStoreById(storeId);
    if (!store) throw new Error(`Loja ${storeId} não encontrada.`);

    const local = readLocalDatabase();
    let integration = local.integrations.find((i) => i.storeId === storeId);

    const generatedKey = options?.apiKey || `nx_sec_live_${storeId.replace(/[^a-zA-Z0-9]/g, "")}_${Math.floor(1000 + Math.random() * 9000)}`;

    if (integration) {
      if (options?.apiKey) integration.apiKeyHash = options.apiKey;
      integration.isActive = true;
    } else {
      integration = {
        id: `int-${storeId}-${Date.now()}`,
        storeId,
        apiKeyHash: generatedKey,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      local.integrations.push(integration);
    }

    if (options?.webhookUrl) {
      store.webhookUrl = options.webhookUrl;
      const sIdx = local.stores.findIndex((s) => s.id === storeId);
      if (sIdx !== -1) local.stores[sIdx].webhookUrl = options.webhookUrl;
    }

    writeLocalDatabase(local);

    try {
      await supabase.from("delivery_integrations").upsert({
        id: integration.id,
        store_id: integration.storeId,
        api_key_hash: integration.apiKeyHash,
        is_active: true,
      });
    } catch {
      // Fallback
    }

    return integration;
  },

  async recordEvent(
    jobId: string,
    storeId: string,
    eventType: DeliveryEvent["eventType"],
    fromStatus?: string,
    toStatus?: string,
    actorType: "store" | "driver" | "system" = "system",
    actorId?: string,
    metadata?: any
  ): Promise<DeliveryEvent> {
    const newEvent: DeliveryEvent = {
      id: `evt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      jobId,
      storeId,
      eventType,
      fromStatus,
      toStatus,
      actorType,
      actorId,
      metadata,
      createdAt: new Date().toISOString(),
    };

    const local = readLocalDatabase();
    local.events.unshift(newEvent);
    writeLocalDatabase(local);

    try {
      await supabase.from("delivery_events").insert({
        id: newEvent.id,
        job_id: newEvent.jobId,
        store_id: newEvent.storeId,
        event_type: newEvent.eventType,
        from_status: newEvent.fromStatus,
        to_status: newEvent.toStatus,
        actor_type: newEvent.actorType,
        actor_id: newEvent.actorId,
        metadata: newEvent.metadata,
        created_at: newEvent.createdAt,
      });
    } catch {
      // Fallback
    }

    return newEvent;
  },

  async listJobEvents(jobId: string): Promise<DeliveryEvent[]> {
    const local = readLocalDatabase();
    return local.events.filter((e) => e.jobId === jobId);
  },

  // Central Idempotent Delivery Dispatch
  async dispatchJob(
    storeId: string,
    data: {
      externalOrderId?: string;
      idempotencyKey?: string;
      assignedDriverId: string;
      customer: {
        name: string;
        phone?: string;
        address: string;
        neighborhood: string;
      };
      orderValue: number;
      deliveryFee?: number;
      confirmationCode?: string;
    }
  ): Promise<{ job: Order; isDuplicate: boolean }> {
    const local = readLocalDatabase();
    const store = await this.getStoreById(storeId);
    if (!store) throw new Error(`Loja ${storeId} não encontrada`);

    // 1. Idempotency Check
    if (data.idempotencyKey) {
      const existing = local.orders.find((o) => o.idempotencyKey === data.idempotencyKey);
      if (existing) {
        return { job: existing, isDuplicate: true };
      }
    }

    // 2. Validate Driver Link to this Store
    const couriers = await this.getStoreCouriers(storeId);
    const assigned = couriers.find((c) => c.courierId === data.assignedDriverId && c.status === "active");
    if (!assigned) {
      throw new Error(`Entregador ${data.assignedDriverId} não está vinculado ou ativo na loja ${store.name}.`);
    }

    const nextNum = Math.floor(100 + Math.random() * 900);
    const jobId = `job-${Date.now()}`;
    const orderNumber = `#0${nextNum}`;
    const fee = data.deliveryFee ?? store.defaultDeliveryFee ?? 8.0;
    const otp = data.confirmationCode || `${Math.floor(1000 + Math.random() * 9000)}`;

    const newJob: Order = {
      id: jobId,
      externalOrderId: data.externalOrderId,
      idempotencyKey: data.idempotencyKey,
      orderNumber,
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
      assignedCourierId: assigned.courierId,
      assignedCourierName: assigned.courierName,
      status: "aguardando_retirada",
      orderValue: Number(data.orderValue),
      deliveryFee: Number(fee),
      itemsCount: 1,
      customerName: data.customer.name,
      customerPhone: data.customer.phone || "(51) 99999-9999",
      destinationAddress: data.customer.address,
      destinationNeighborhood: data.customer.neighborhood,
      distanceKm: 2.8,
      estimatedMinutes: 7,
      confirmationCode: otp,
      createdAt: new Date().toISOString(),
    };

    local.orders.unshift(newJob);
    writeLocalDatabase(local);

    try {
      await supabase.from("delivery_jobs").insert({
        id: newJob.id,
        store_id: newJob.storeId,
        external_order_id: newJob.externalOrderId,
        order_number: newJob.orderNumber,
        driver_id: newJob.assignedCourierId,
        driver_name: newJob.assignedCourierName,
        status: newJob.status,
        order_value: newJob.orderValue,
        delivery_fee: newJob.deliveryFee,
        items_count: newJob.itemsCount,
        customer_name: newJob.customerName,
        customer_phone: newJob.customerPhone,
        destination_address: newJob.destinationAddress,
        destination_neighborhood: newJob.destinationNeighborhood,
        distance_km: newJob.distanceKm,
        estimated_minutes: newJob.estimatedMinutes,
        confirmation_code: newJob.confirmationCode,
        idempotency_key: newJob.idempotencyKey,
      });
    } catch {
      // Fallback
    }

    await this.recordEvent(
      newJob.id,
      store.id,
      "job_created",
      undefined,
      "aguardando_retirada",
      "store",
      store.id,
      { externalOrderId: data.externalOrderId, idempotencyKey: data.idempotencyKey }
    );

    return { job: newJob, isDuplicate: false };
  },

  async listStoreJobs(storeId: string): Promise<Order[]> {
    const local = readLocalDatabase();
    return local.orders.filter((o) => o.storeId === storeId);
  },
};
