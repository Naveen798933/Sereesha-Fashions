-- ==============================================================================
-- Sreesha Elegance — Complete Fashion E-Commerce Admin Schema Migration
-- ==============================================================================

-- 1. EXTEND PRODUCTS TABLE FOR ADVANCED FASHION ATTRIBUTES
ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'Sreesha Elegance',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 15 CHECK (stock >= 0),
  ADD COLUMN IF NOT EXISTS colors JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create index on product status and sku
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  subcategories JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active categories" ON public.categories;
CREATE POLICY "Public read active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR (auth.jwt() ->> 'role') IN ('admin', 'service_role'));

DROP POLICY IF EXISTS "Service role manages categories" ON public.categories;
CREATE POLICY "Service role manages categories"
  ON public.categories FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- 3. REVIEWS MODERATION EXTENSION
ALTER TABLE IF EXISTS public.reviews
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'hidden', 'spam')),
  ADD COLUMN IF NOT EXISTS fit TEXT DEFAULT 'Bespoke Master Fit';

CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

-- 4. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only for admin audit logs" ON public.admin_audit_logs;
CREATE POLICY "Service role only for admin audit logs"
  ON public.admin_audit_logs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- 5. ORDER WORKFLOW & LIFECYCLE TIMELINE
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL CHECK (
    to_status IN (
      'Order Placed & Verified',
      'Atelier Inspection & Silk Tagged',
      'Dispatched via BlueDart Express',
      'Out for Doorstep Delivery',
      'Delivered',
      'Cancelled'
    )
  ),
  carrier TEXT,
  tracking_number TEXT,
  notes TEXT,
  changed_by TEXT DEFAULT 'System',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely ensure column types and foreign key constraint
DO $$
BEGIN
  -- 1. Drop referencing foreign keys temporarily to avoid locked types
  BEGIN
    ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER TABLE public.order_status_history DROP CONSTRAINT IF EXISTS order_status_history_order_id_fkey;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 2. Convert order_items.order_id to TEXT
  BEGIN
    ALTER TABLE public.order_items ALTER COLUMN order_id TYPE TEXT USING order_id::text;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 3. Convert orders.id to TEXT
  BEGIN
    ALTER TABLE public.orders ALTER COLUMN id TYPE TEXT USING id::text;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 4. Convert order_status_history.order_id to TEXT
  BEGIN
    ALTER TABLE public.order_status_history ALTER COLUMN order_id TYPE TEXT USING order_id::text;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  -- 5. Re-create foreign keys cleanly
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_fkey') THEN
      ALTER TABLE public.order_items 
        ADD CONSTRAINT order_items_order_id_fkey 
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_status_history_order_id_fkey') THEN
      ALTER TABLE public.order_status_history 
        ADD CONSTRAINT order_status_history_order_id_fkey 
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON public.order_status_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_status_history_to_status ON public.order_status_history(to_status);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view order status history" ON public.order_status_history;
CREATE POLICY "Public can view order status history"
  ON public.order_status_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role manages order status history" ON public.order_status_history;
CREATE POLICY "Service role manages order status history"
  ON public.order_status_history FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- 6. WORKFLOW AUTOMATION TRIGGERS

-- 6.1 Record initial order placement in history
CREATE OR REPLACE FUNCTION public.fn_handle_new_order_history()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.order_status_history 
    WHERE order_id::text = NEW.id::text
  ) THEN
    INSERT INTO public.order_status_history (
      order_id,
      from_status,
      to_status,
      carrier,
      tracking_number,
      notes,
      changed_by,
      created_at
    ) VALUES (
      NEW.id::text,
      NULL,
      'Order Placed & Verified',
      NEW.carrier,
      NEW.tracking_number,
      'Order placed successfully and registered in atelier workflow.',
      COALESCE(NEW.customer->>'fullName', 'Customer / Patron'),
      COALESCE(NEW.created_at, NOW())
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_initial_status ON public.orders;
CREATE TRIGGER trg_order_initial_status
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_handle_new_order_history();

-- 6.2 Record status updates, tracking changes, and write audit log
CREATE OR REPLACE FUNCTION public.fn_handle_order_status_update()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_note TEXT;
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) OR 
     (OLD.tracking_number IS DISTINCT FROM NEW.tracking_number AND NEW.tracking_number IS NOT NULL) THEN
    
    v_note := CASE 
      WHEN NEW.status = 'Atelier Inspection & Silk Tagged' THEN 'Handloom quality inspection completed & Silk Mark QR verified.'
      WHEN NEW.status = 'Dispatched via BlueDart Express' THEN 'Consignment handed to courier partner for express dispatch.'
      WHEN NEW.status = 'Out for Doorstep Delivery' THEN 'Package out with local delivery marshal.'
      WHEN NEW.status = 'Delivered' THEN 'Package successfully delivered and received by patron.'
      WHEN NEW.status = 'Cancelled' THEN 'Order cancelled and allocated inventory returned to catalog.'
      ELSE 'Order workflow status updated.'
    END;

    INSERT INTO public.order_status_history (
      order_id,
      from_status,
      to_status,
      carrier,
      tracking_number,
      notes,
      changed_by,
      created_at
    ) VALUES (
      NEW.id::text,
      OLD.status,
      NEW.status,
      COALESCE(NEW.carrier, OLD.carrier),
      COALESCE(NEW.tracking_number, OLD.tracking_number),
      v_note,
      'Atelier Admin / Dispatcher',
      NOW()
    );

    INSERT INTO public.admin_audit_logs (
      admin_name,
      action,
      entity_type,
      entity_id,
      details,
      created_at
    ) VALUES (
      'Atelier Admin',
      'ORDER_STATUS_TRANSITION',
      'order',
      NEW.id::text,
      jsonb_build_object(
        'from_status', OLD.status,
        'to_status', NEW.status,
        'tracking_number', NEW.tracking_number,
        'carrier', NEW.carrier
      ),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_status_change ON public.orders;
CREATE TRIGGER trg_order_status_change
  AFTER UPDATE OF status, tracking_number ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_handle_order_status_update();

-- 6.3 Automated stock reduction when order items are added
CREATE OR REPLACE FUNCTION public.fn_deduct_inventory_on_order()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    UPDATE public.products
    SET 
      stock = GREATEST(0, COALESCE(stock, 15) - NEW.quantity),
      in_stock = (GREATEST(0, COALESCE(stock, 15) - NEW.quantity) > 0),
      updated_at = NOW()
    WHERE id::text = NEW.product_id::text;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_deduct_inventory ON public.order_items;
CREATE TRIGGER trg_deduct_inventory
  AFTER INSERT ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_deduct_inventory_on_order();

-- 6.4 Automated stock restoration when order is cancelled
CREATE OR REPLACE FUNCTION public.fn_restore_inventory_on_cancel()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item_rec RECORD;
BEGIN
  IF NEW.status = 'Cancelled' AND OLD.status <> 'Cancelled' THEN
    FOR item_rec IN
      SELECT product_id, quantity
      FROM public.order_items
      WHERE order_id::text = NEW.id::text AND product_id IS NOT NULL
    LOOP
      UPDATE public.products
      SET 
        stock = COALESCE(stock, 0) + item_rec.quantity,
        in_stock = true,
        updated_at = NOW()
      WHERE id::text = item_rec.product_id::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_restore_inventory ON public.orders;
CREATE TRIGGER trg_restore_inventory
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_restore_inventory_on_cancel();

-- 7. STORED WORKFLOW RPC PROCEDURES

-- 7.1 Advance order workflow state with transition validation
CREATE OR REPLACE FUNCTION public.advance_order_workflow(
  p_order_id TEXT,
  p_new_status TEXT,
  p_admin_name TEXT DEFAULT 'Atelier Admin',
  p_notes TEXT DEFAULT NULL,
  p_carrier TEXT DEFAULT NULL,
  p_tracking_number TEXT DEFAULT NULL
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id::text = p_order_id::text;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  IF p_new_status NOT IN (
    'Order Placed & Verified',
    'Atelier Inspection & Silk Tagged',
    'Dispatched via BlueDart Express',
    'Out for Doorstep Delivery',
    'Delivered',
    'Cancelled'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid status transition value');
  END IF;

  UPDATE public.orders
  SET 
    status = p_new_status,
    carrier = COALESCE(p_carrier, carrier),
    tracking_number = COALESCE(p_tracking_number, tracking_number),
    updated_at = NOW()
  WHERE id::text = p_order_id::text;

  RETURN jsonb_build_object(
    'success', true,
    'order_id', p_order_id,
    'previous_status', v_order.status,
    'new_status', p_new_status,
    'carrier', COALESCE(p_carrier, v_order.carrier),
    'tracking_number', COALESCE(p_tracking_number, v_order.tracking_number)
  );
END;
$$ LANGUAGE plpgsql;

-- 7.2 Get full chronological workflow history for an order
CREATE OR REPLACE FUNCTION public.get_order_workflow_timeline(p_order_id TEXT)
RETURNS TABLE (
  history_id UUID,
  order_id TEXT,
  from_status TEXT,
  to_status TEXT,
  carrier TEXT,
  tracking_number TEXT,
  notes TEXT,
  changed_by TEXT,
  created_at TIMESTAMPTZ
)
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    h.id AS history_id,
    h.order_id::text,
    h.from_status,
    h.to_status,
    h.carrier,
    h.tracking_number,
    h.notes,
    h.changed_by,
    h.created_at
  FROM public.order_status_history h
  WHERE h.order_id::text = p_order_id::text
  ORDER BY h.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- 8. REALTIME SUBSCRIPTIONS ENHANCEMENT
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_audit_logs;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END $$;

-- 9. SEED WORKFLOW TIMELINE DATA FOR SAMPLE ORDERS
-- 9.1 Ensure demo orders exist in orders table
INSERT INTO public.orders (
  id, user_id, date, status, carrier, tracking_number, estimated_delivery,
  subtotal, shipping_fee, discount, total, payment_method, customer, created_at
)
VALUES
(
  'SE-84920',
  NULL,
  '04 October 2026',
  'Dispatched via BlueDart Express',
  'BlueDart Air Express',
  'BD893201948IN',
  'Thursday, 08 October 2026',
  18500,
  0,
  0,
  18500,
  'upi',
  '{"fullName": "Sreeja Varma", "phone": "+91 98490 12345", "email": "sreeja.varma@example.com", "address": "Flat 402, Royal Residency, Road No. 36, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pinCode": "500033", "notes": "Silk Mark inspection requested at delivery."}'::jsonb,
  NOW() - INTERVAL '3 days'
),
(
  'SE-79213',
  NULL,
  '18 September 2026',
  'Delivered',
  'Delhivery Surface',
  'DL193840294IN',
  'Delivered on 22 September 2026',
  8900,
  0,
  0,
  8900,
  'card',
  '{"fullName": "Sreeja Varma", "phone": "+91 98490 12345", "email": "sreeja.varma@example.com", "address": "Flat 402, Royal Residency, Road No. 36, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pinCode": "500033"}'::jsonb,
  NOW() - INTERVAL '19 days'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  carrier = EXCLUDED.carrier,
  tracking_number = EXCLUDED.tracking_number,
  updated_at = NOW();

-- 9.2 Seed demo order items
INSERT INTO public.order_items (id, order_id, product_id, title, category, primary_image, price, size, blouse_option, quantity)
VALUES
(
  'item-se-01',
  'SE-84920',
  'saree-01',
  'Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari',
  'sarees',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
  18500,
  'Standard 5.5m + 0.8m Blouse',
  'Unstitched Matching Blouse (Included)',
  1
),
(
  'item-se-02',
  'SE-79213',
  'kurti-01',
  'Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti',
  'kurtis',
  'https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=800&q=85',
  8900,
  'M',
  NULL,
  1
)
ON CONFLICT (id) DO NOTHING;

-- 9.3 Safely insert timeline history ONLY for orders that exist in public.orders
INSERT INTO public.order_status_history (order_id, from_status, to_status, carrier, tracking_number, notes, changed_by, created_at)
SELECT 
  v.order_id::text, v.from_status, v.to_status, v.carrier, v.tracking_number, v.notes, v.changed_by, v.created_at
FROM (
  VALUES
  (
    'SE-84920'::text,
    NULL::text,
    'Order Placed & Verified'::text,
    'BlueDart Air Express'::text,
    NULL::text,
    'Patron placed order for Kanchipuram Pure Silk Saree. Payment verified via UPI.'::text,
    'Sreeja Varma'::text,
    NOW() - INTERVAL '3 days'
  ),
  (
    'SE-84920'::text,
    'Order Placed & Verified'::text,
    'Atelier Inspection & Silk Tagged'::text,
    'BlueDart Air Express'::text,
    NULL::text,
    'Silk Mark SMOI tag attached, warp/weft inspected by master karigar at Hyderabad Atelier.'::text,
    'Sreesha (Super Admin)'::text,
    NOW() - INTERVAL '2 days'
  ),
  (
    'SE-84920'::text,
    'Atelier Inspection & Silk Tagged'::text,
    'Dispatched via BlueDart Express'::text,
    'BlueDart Air Express'::text,
    'BD893201948IN'::text,
    'Packed in royal hardbox, dispatched via BlueDart Air Express.'::text,
    'Order Dispatcher'::text,
    NOW() - INTERVAL '1 day'
  ),
  (
    'SE-79213'::text,
    NULL::text,
    'Order Placed & Verified'::text,
    'Delhivery Surface'::text,
    NULL::text,
    'Order received for Chanderi Silk Anarkali Set. Paid via Card.'::text,
    'Sreeja Varma'::text,
    NOW() - INTERVAL '19 days'
  ),
  (
    'SE-79213'::text,
    'Dispatched via BlueDart Express'::text,
    'Delivered'::text,
    'Delhivery Surface'::text,
    'DL193840294IN'::text,
    'Package safely handed to patron at Jubilee Hills, Hyderabad.'::text,
    'Delhivery Courier'::text,
    NOW() - INTERVAL '15 days'
  )
) AS v(order_id, from_status, to_status, carrier, tracking_number, notes, changed_by, created_at)
INNER JOIN public.orders o ON o.id::text = v.order_id::text
WHERE NOT EXISTS (
  SELECT 1 FROM public.order_status_history h 
  WHERE h.order_id::text = v.order_id::text 
    AND h.to_status = v.to_status
    AND (h.from_status IS NOT DISTINCT FROM v.from_status)
);



