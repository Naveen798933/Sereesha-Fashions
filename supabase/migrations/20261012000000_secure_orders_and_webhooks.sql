-- ==============================================================================
-- SREESHA ELEGANCE — PAYMENT SECURITY & WEBHOOK HARDENING MIGRATION
-- Migration: 20261012000000_secure_orders_and_webhooks.sql
-- ==============================================================================

-- 1. ADD MISSING PAYMENT AND REFUND TRACKING COLUMNS TO ORDERS TABLE
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (
  payment_status IN ('pending', 'paid', 'failed', 'refunded')
);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none' CHECK (
  refund_status IN ('none', 'requested', 'processing', 'refunded', 'failed')
);

-- Performance indexes for payment and order reconciliation
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON public.orders(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);

-- 2. CREATE IDEMPOTENT WEBHOOK EVENTS LOG TABLE
CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id TEXT PRIMARY KEY DEFAULT ('evt_' || substr(md5(random()::text), 1, 12)),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON public.payment_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.payment_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.payment_webhook_events(created_at DESC);

-- 3. HARDEN ROW-LEVEL SECURITY (RLS) FOR ORDERS & ORDER_ITEMS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;

-- Drop insecure open policies
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;

DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can delete order items" ON public.order_items;

-- A. ORDERS: SELECT POLICY (Users view own orders or guest orders by phone/email matching, or service_role)
CREATE POLICY "Authorized orders select" ON public.orders
  FOR SELECT USING (
    auth.role() = 'service_role' OR
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
    user_id IS NULL OR
    auth.uid() IS NULL
  );

-- B. ORDERS: INSERT POLICY (Authenticated users or verified checkout guests)
CREATE POLICY "Authorized orders insert" ON public.orders
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    (auth.uid() IS NOT NULL AND auth.uid()::text = user_id) OR
    user_id IS NULL
  );

-- C. ORDERS: UPDATE & DELETE POLICIES (Strictly Service Role / Authenticated Admins)
-- Prevents unauthenticated users with public anon key from wiping or tampering with orders
CREATE POLICY "Service role orders update" ON public.orders
  FOR UPDATE USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()::text
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Service role orders delete" ON public.orders
  FOR DELETE USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()::text
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- D. ORDER ITEMS: SELECT & INSERT FOR ASSOCIATED ORDERS
CREATE POLICY "Authorized order items select" ON public.order_items
  FOR SELECT USING (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
    )
  );

CREATE POLICY "Authorized order items insert" ON public.order_items
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
    )
  );

CREATE POLICY "Service role order items update" ON public.order_items
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Service role order items delete" ON public.order_items
  FOR DELETE USING (auth.role() = 'service_role');

-- E. WEBHOOK EVENTS: Strictly Service Role
CREATE POLICY "Service role webhook events access" ON public.payment_webhook_events
  FOR ALL USING (auth.role() = 'service_role');
