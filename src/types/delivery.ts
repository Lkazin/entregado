export type OrderStatus =
  | "pendente"
  | "aguardando_retirada"
  | "em_rota"
  | "concluida"
  | "cancelada";

export interface Store {
  id: string; // Slug oficial ou ID seguro da loja (ex: acai-do-rei-canoas)
  name: string; // e.g. "Açaí do Rei"
  category?: string; // e.g. "Açaí & Sobremesas"
  address: string; // e.g. "Av. Boqueirão, 1200 - Canoas"
  phone: string; // e.g. "(51) 99888-7777"
  defaultDeliveryFee: number; // e.g. 8.00
  webhookUrl?: string;
  logoUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface StoreIntegration {
  id: string;
  storeId: string;
  apiKeyHash: string;
  webhookSecret?: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt?: string;
}

export interface StoreInvite {
  id: string;
  storeId: string;
  storeName: string;
  code: string; // e.g. "NX-ACAI-7821"
  maxUses: number; // Padrão: 1 uso único
  usedCount: number;
  isRevoked: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface StoreCourierLink {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  courierId: string;
  courierName: string;
  courierPhone: string;
  courierVehicle: string;
  courierPlate: string;
  status: "active" | "revoked";
  inviteCodeUsed: string;
  linkedAt: string;
  revokedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#0482"
  externalOrderId?: string; // ID do pedido no sistema comercial da loja (ex: ped-8921)
  idempotencyKey?: string; // Chave para proteção contra reenvios duplicados

  storeId: string;
  storeName: string;
  storeAddress: string;
  storeCoords?: { lat: number; lng: number };
  
  assignedCourierId?: string; // Motoboy designado pela loja
  assignedCourierName?: string;
  
  status: OrderStatus;
  orderValue: number; // e.g. 42.90
  deliveryFee: number; // e.g. 8.00
  itemsCount: number;

  // Delivery destination
  customerName: string;
  customerPhone: string;
  destinationAddress: string;
  destinationNeighborhood: string;
  destinationCoords?: { lat: number; lng: number };

  // Logistics
  distanceKm: number;
  estimatedMinutes: number;
  confirmationCode: string; // Código OTP de 4 dígitos (e.g. "1742")
  
  createdAt: string;
  acceptedAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

export interface DeliveryEvent {
  id: string;
  jobId: string;
  storeId: string;
  eventType: "job_created" | "driver_assigned" | "route_started" | "delivered" | "cancelled";
  fromStatus?: string;
  toStatus?: string;
  actorType: "store" | "driver" | "system";
  actorId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface DeliveryConfirmation {
  id: string;
  jobId: string;
  codeEntered: string;
  isValid: boolean;
  confirmedAt: string;
}

export interface MotoboyProfile {
  id: string; // e.g. "mb-001"
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  vehicleModel: string;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface DeliveryStats {
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  todayEarnings: number;
  totalKm: number;
}
