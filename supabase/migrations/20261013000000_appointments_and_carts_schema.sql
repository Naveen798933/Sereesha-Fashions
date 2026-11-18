-- ==============================================================================
-- SREESHA ELEGANCE — APPOINTMENTS, ABANDONED CARTS & STORAGE MIGRATION
-- Migration: 20261013000000_appointments_and_carts_schema.sql
-- ==============================================================================

-- 1. APPOINTMENTS TABLE (VIP Stylist Consultations & Video Shopping)
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY DEFAULT ('apt_' || substr(md5(random()::text), 1, 8)),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  service_type TEXT NOT NULL,
  service_title TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'in_store' CHECK (mode IN ('in_store', 'virtual_video')),
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Hyderabad',
  occasion_date TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (
    status IN ('Confirmed', 'Completed', 'Rescheduled', 'Cancelled')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes for Appointments
CREATE INDEX IF NOT EXISTS idx_appointments_customer_phone ON public.appointments(customer_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);

-- Automated updated_at Trigger for Appointments
DROP TRIGGER IF EXISTS on_appointments_updated_at ON public.appointments;
CREATE TRIGGER on_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. ABANDONED CARTS TABLE (Concierge Recovery Pipeline)
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id TEXT PRIMARY KEY DEFAULT ('cart_' || substr(md5(random()::text), 1, 8)),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  state TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC NOT NULL DEFAULT 0 CHECK (total >= 0),
  applied_coupon TEXT,
  dropoff_step TEXT NOT NULL DEFAULT 'contact_entered' CHECK (
    dropoff_step IN ('contact_entered', 'payment_initiated', 'payment_failed')
  ),
  recovery_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    recovery_status IN ('pending', 'contacted', 'recovered', 'dismissed')
  ),
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes for Abandoned Carts
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_phone ON public.abandoned_carts(phone);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_recovery_status ON public.abandoned_carts(recovery_status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_dropoff_step ON public.abandoned_carts(dropoff_step);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_created_at ON public.abandoned_carts(created_at DESC);

-- Automated updated_at Trigger for Abandoned Carts
DROP TRIGGER IF EXISTS on_abandoned_carts_updated_at ON public.abandoned_carts;
CREATE TRIGGER on_abandoned_carts_updated_at
  BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. SCHEMA SAFETY & COMPATIBILITY ENHANCEMENTS
-- Add product_title to reviews for cross-product review administration
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS product_title TEXT;

-- Drop restrictive products category check to allow dynamic categories from admin panel
ALTER TABLE public.products DROP CONSTRAINT IF EXISTS products_category_check;

-- Ensure orders payment status and refund tracking columns exist
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none';

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- 4.1 Appointments RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;
CREATE POLICY "Public can book appointments" ON public.appointments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authorized view appointments" ON public.appointments;
CREATE POLICY "Authorized view appointments" ON public.appointments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update appointments" ON public.appointments;
CREATE POLICY "Admins can update appointments" ON public.appointments
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Service role can delete appointments" ON public.appointments;
CREATE POLICY "Service role can delete appointments" ON public.appointments
  FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- 4.2 Abandoned Carts RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can upsert abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Anyone can upsert abandoned carts" ON public.abandoned_carts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Anyone can update abandoned carts" ON public.abandoned_carts
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Authorized view abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Authorized view abandoned carts" ON public.abandoned_carts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role can delete abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Service role can delete abandoned carts" ON public.abandoned_carts
  FOR DELETE USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- 5. SUPABASE STORAGE BUCKETS SETUP
-- Create public storage buckets for product imagery and 4K drapery videos
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('product-images', 'product-images', true),
  ('product-videos', 'product-videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Read Policies: Public read access
DROP POLICY IF EXISTS "Public Read Product Images" ON storage.objects;
CREATE POLICY "Public Read Product Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public Read Product Videos" ON storage.objects;
CREATE POLICY "Public Read Product Videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-videos');

-- Storage Upload & Manage Policies: Service role and authorized admin uploads
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
CREATE POLICY "Admin Upload Product Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Upload Product Videos" ON storage.objects;
CREATE POLICY "Admin Upload Product Videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-videos');

DROP POLICY IF EXISTS "Admin Manage Product Images" ON storage.objects;
CREATE POLICY "Admin Manage Product Images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;
CREATE POLICY "Admin Delete Product Images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Manage Product Videos" ON storage.objects;
CREATE POLICY "Admin Manage Product Videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-videos');

DROP POLICY IF EXISTS "Admin Delete Product Videos" ON storage.objects;
CREATE POLICY "Admin Delete Product Videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-videos');

-- 6. REALTIME SUBSCRIPTIONS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.abandoned_carts;
    EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END $$;
