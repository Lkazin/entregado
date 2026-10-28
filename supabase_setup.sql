-- ====================================================================
-- NOVAESWEB ENTREGADOR — ARQUITETURA CENTRAL SUPABASE (MULTI-TENANT)
-- Schema Oficial Central de Logística para 100+ Lojas Conectadas
-- Cole este script no SQL Editor do Supabase Dashboard:
-- https://supabase.com/dashboard/project/nrdbporbyujwtgnpiejz/sql/new
-- ====================================================================

-- 1. TABELA DE LOJAS CADASTRADAS (DELIVERY_STORES)
CREATE TABLE IF NOT EXISTS public.delivery_stores (
  id TEXT PRIMARY KEY, -- Slug oficial da loja na NovaesWeb (ex: acai-do-rei-canoas)
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Delivery',
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  default_delivery_fee NUMERIC(10, 2) DEFAULT 8.00,
  webhook_url TEXT,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE INTEGRAÇÕES & CHAVES DE API B2B (DELIVERY_INTEGRATIONS)
CREATE TABLE IF NOT EXISTS public.delivery_integrations (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES public.delivery_stores(id) ON DELETE CASCADE,
  api_key_hash TEXT NOT NULL, -- Hash seguro ou token da API
  webhook_secret TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- 3. TABELA DE ENTREGADORES (DELIVERY_DRIVERS)
CREATE TABLE IF NOT EXISTS public.delivery_drivers (
  id TEXT PRIMARY KEY DEFAULT 'mb-001',
  name TEXT NOT NULL DEFAULT 'Carlos Silva',
  email TEXT UNIQUE NOT NULL DEFAULT 'motoboy@loja.com',
  phone TEXT DEFAULT '(11) 97123-4567',
  avatar_url TEXT,
  vehicle_model TEXT DEFAULT 'Honda CG 160 Fan',
  vehicle_plate TEXT DEFAULT 'BRA-2E19',
  rating NUMERIC(3, 2) DEFAULT 4.90,
  total_deliveries INT DEFAULT 428,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE VÍNCULOS LOJA-ENTREGADOR (DELIVERY_STORE_DRIVERS)
CREATE TABLE IF NOT EXISTS public.delivery_store_drivers (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES public.delivery_stores(id) ON DELETE CASCADE,
  driver_id TEXT NOT NULL REFERENCES public.delivery_drivers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- active, revoked, pending
  invite_code_used TEXT,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE(store_id, driver_id)
);

-- 5. TABELA DE CÓDIGOS DE CONVITE (DELIVERY_INVITES)
CREATE TABLE IF NOT EXISTS public.delivery_invites (
  id TEXT PRIMARY KEY,
  store_id TEXT NOT NULL REFERENCES public.delivery_stores(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL, -- Ex: NX-ACAI-7821
  max_uses INT DEFAULT 1,
  used_count INT DEFAULT 0,
  is_revoked BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE ENTREGAS / CORRIDAS (DELIVERY_JOBS)
CREATE TABLE IF NOT EXISTS public.delivery_jobs (
  id TEXT PRIMARY KEY, -- ID central (ex: job-1001)
  store_id TEXT NOT NULL REFERENCES public.delivery_stores(id) ON DELETE CASCADE,
  external_order_id TEXT, -- ID do pedido no sistema comercial da loja (ex: ped-8921)
  order_number TEXT NOT NULL, -- Ex: #0101
  driver_id TEXT REFERENCES public.delivery_drivers(id) ON DELETE SET NULL,
  driver_name TEXT,
  status TEXT NOT NULL DEFAULT 'aguardando_retirada', -- pendente, aguardando_retirada, em_rota, concluida, cancelada
  
  -- Valores financeiros
  order_value NUMERIC(10, 2) NOT NULL DEFAULT 40.00,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 8.00,
  items_count INT DEFAULT 1,

  -- Dados do Cliente e Destino
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  destination_address TEXT NOT NULL,
  destination_neighborhood TEXT NOT NULL,
  destination_lat NUMERIC(10, 6) DEFAULT -29.9210,
  destination_lng NUMERIC(10, 6) DEFAULT -51.1820,

  -- Logística e Segurança OTP
  distance_km NUMERIC(5, 2) DEFAULT 2.80,
  estimated_minutes INT DEFAULT 7,
  confirmation_code TEXT NOT NULL DEFAULT '1742', -- OTP de 4 dígitos
  
  -- Chave de idempotência (protege contra reenvios duplicados da loja)
  idempotency_key TEXT UNIQUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  dispatched_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

-- 7. TABELA DE EVENTOS E AUDITORIA (DELIVERY_EVENTS)
CREATE TABLE IF NOT EXISTS public.delivery_events (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.delivery_jobs(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL REFERENCES public.delivery_stores(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- job_created, driver_assigned, route_started, delivered, cancelled
  from_status TEXT,
  to_status TEXT,
  actor_type TEXT NOT NULL DEFAULT 'system', -- store, driver, system
  actor_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE CONFIRMAÇÕES OTP (DELIVERY_CONFIRMATIONS)
CREATE TABLE IF NOT EXISTS public.delivery_confirmations (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL REFERENCES public.delivery_jobs(id) ON DELETE CASCADE,
  code_entered TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  confirmed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ÍNDICES DE PERFORMANCE E ISOLAMENTO
CREATE INDEX IF NOT EXISTS idx_jobs_store_id ON public.delivery_jobs(store_id);
CREATE INDEX IF NOT EXISTS idx_jobs_driver_id ON public.delivery_jobs(driver_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.delivery_jobs(status);
CREATE INDEX IF NOT EXISTS idx_store_drivers_store ON public.delivery_store_drivers(store_id);
CREATE INDEX IF NOT EXISTS idx_store_drivers_driver ON public.delivery_store_drivers(driver_id);
CREATE INDEX IF NOT EXISTS idx_invites_code ON public.delivery_invites(code);
CREATE INDEX IF NOT EXISTS idx_events_job_id ON public.delivery_events(job_id);

-- 10. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.delivery_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_store_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_confirmations ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
DROP POLICY IF EXISTS "Acesso público delivery_stores" ON public.delivery_stores;
CREATE POLICY "Acesso público delivery_stores" ON public.delivery_stores FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso restrito delivery_integrations" ON public.delivery_integrations;
CREATE POLICY "Acesso restrito delivery_integrations" ON public.delivery_integrations FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_drivers" ON public.delivery_drivers;
CREATE POLICY "Acesso público delivery_drivers" ON public.delivery_drivers FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_store_drivers" ON public.delivery_store_drivers;
CREATE POLICY "Acesso público delivery_store_drivers" ON public.delivery_store_drivers FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_invites" ON public.delivery_invites;
CREATE POLICY "Acesso público delivery_invites" ON public.delivery_invites FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_jobs" ON public.delivery_jobs;
CREATE POLICY "Acesso público delivery_jobs" ON public.delivery_jobs FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_events" ON public.delivery_events;
CREATE POLICY "Acesso público delivery_events" ON public.delivery_events FOR ALL USING (true);

DROP POLICY IF EXISTS "Acesso público delivery_confirmations" ON public.delivery_confirmations;
CREATE POLICY "Acesso público delivery_confirmations" ON public.delivery_confirmations FOR ALL USING (true);

-- 11. HABILITAR REALTIME NO SUPABASE
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_store_drivers;

-- 12. DADOS DE SEED CENTRAL (LOJAS E ENTREGADORES INICIAIS)
INSERT INTO public.delivery_stores (id, name, category, address, phone, default_delivery_fee, is_active)
VALUES 
  ('store-acai-01', 'Açaí do Rei', 'Açaí & Sobremesas', 'Av. Boqueirão, 1200 - Canoas/RS', '(51) 99888-7777', 8.00, true),
  ('store-burger-01', 'Burger House', 'Hamburgueria Artesanal', 'Av. Principal, 123 - Centro', '(11) 98765-4321', 7.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.delivery_integrations (id, store_id, api_key_hash, is_active)
VALUES 
  ('int-acai-01', 'store-acai-01', 'nx_sec_live_acai_7821', true),
  ('int-burger-01', 'store-burger-01', 'nx_sec_live_burger_4512', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.delivery_invites (id, store_id, code, max_uses, used_count, is_revoked, expires_at)
VALUES 
  ('inv-001', 'store-acai-01', 'NX-ACAI-7821', 10, 1, false, NOW() + INTERVAL '7 days'),
  ('inv-002', 'store-burger-01', 'NX-BURGER-4512', 10, 0, false, NOW() + INTERVAL '7 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.delivery_drivers (id, name, email, phone, vehicle_model, vehicle_plate, rating, total_deliveries)
VALUES ('mb-001', 'Carlos Silva', 'motoboy@loja.com', '(11) 97123-4567', 'Honda CG 160 Fan', 'BRA-2E19', 4.90, 428)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.delivery_store_drivers (id, store_id, driver_id, status, invite_code_used)
VALUES ('link-001', 'store-acai-01', 'mb-001', 'active', 'NX-ACAI-7821')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.delivery_jobs (
  id, store_id, external_order_id, order_number, driver_id, driver_name, status,
  order_value, delivery_fee, items_count, customer_name, customer_phone,
  destination_address, destination_neighborhood, distance_km, estimated_minutes, confirmation_code, idempotency_key
)
VALUES (
  'job-0101', 'store-acai-01', 'ped-101', '#0101', 'mb-001', 'Carlos Silva', 'aguardando_retirada',
  38.50, 8.00, 2, 'Mariana Souza', '(51) 98765-4321',
  'Rua das Flores, 456', 'Bairro Centro - Canoas/RS', 2.80, 7, '1742', 'acai_ped_101'
)
ON CONFLICT (id) DO NOTHING;
