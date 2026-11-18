-- ==============================================================================
-- SREESHA ELEGANCE — COMPREHENSIVE SUPABASE VERIFICATION & AUDIT SUITE
-- Run these queries directly in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hmwzjulepzewbuyyyfhp/sql
-- ==============================================================================

-- ==============================================================================
-- 1. SCHEMA INTEGRITY CHECK: VERIFY ALL 16 TABLES EXIST IN PUBLIC SCHEMA
-- ==============================================================================
SELECT 
  table_name,
  (SELECT count(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name AND table_schema = 'public') AS column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name ASC;

-- ==============================================================================
-- 2. ROW COUNT AUDIT ACROSS ALL ATELIER COLLECTIONS & TABLES
-- ==============================================================================
SELECT 'products' AS table_name, count(*) AS total_rows FROM public.products
UNION ALL
SELECT 'categories', count(*) FROM public.categories
UNION ALL
SELECT 'coupons', count(*) FROM public.coupons
UNION ALL
SELECT 'reviews', count(*) FROM public.reviews
UNION ALL
SELECT 'orders', count(*) FROM public.orders
UNION ALL
SELECT 'order_items', count(*) FROM public.order_items
UNION ALL
SELECT 'order_status_history', count(*) FROM public.order_status_history
UNION ALL
SELECT 'customers', count(*) FROM public.customers
UNION ALL
SELECT 'staff_admins', count(*) FROM public.staff_admins
UNION ALL
SELECT 'addresses', count(*) FROM public.addresses
UNION ALL
SELECT 'profiles', count(*) FROM public.profiles
UNION ALL
SELECT 'wishlists', count(*) FROM public.wishlists
UNION ALL
SELECT 'appointments', count(*) FROM public.appointments
UNION ALL
SELECT 'abandoned_carts', count(*) FROM public.abandoned_carts
UNION ALL
SELECT 'payment_webhook_events', count(*) FROM public.payment_webhook_events
UNION ALL
SELECT 'admin_audit_logs', count(*) FROM public.admin_audit_logs
ORDER BY total_rows DESC;

-- ==============================================================================
-- 3. ROW-LEVEL SECURITY (RLS) AUDIT: ENSURE EVERY TABLE HAS RLS ENABLED
-- ==============================================================================
SELECT 
  c.relname AS table_name,
  c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS rls_forced,
  count(p.polname) AS total_policies
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_policy p ON p.polrelid = c.oid
WHERE n.nspname = 'public' 
  AND c.relkind = 'r'
GROUP BY c.relname, c.relrowsecurity, c.relforcerowsecurity
ORDER BY c.relname ASC;

-- ==============================================================================
-- 4. ACTIVE POLICIES INVENTORY (PER-COMMAND ACCESS BREAKDOWN)
-- ==============================================================================
SELECT 
  tablename,
  policyname,
  cmd AS command,
  roles,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- ==============================================================================
-- 5. AUTOMATED TRIGGERS & PROCEDURES CHECK
-- ==============================================================================
SELECT 
  event_object_table AS target_table,
  trigger_name,
  event_manipulation AS event,
  action_timing AS timing,
  action_statement AS executed_function
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ==============================================================================
-- 6. SUPABASE STORAGE BUCKETS AUDIT
-- ==============================================================================
SELECT 
  id AS bucket_id,
  name AS bucket_name,
  public AS is_public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id IN ('product-images', 'product-videos');

-- Storage policies check
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects'
ORDER BY policyname;

-- ==============================================================================
-- 7. CATALOG AUDIT: CATEGORY BREAKDOWN & INVENTORY HEALTH
-- ==============================================================================
SELECT 
  category,
  count(*) AS total_products,
  sum(CASE WHEN in_stock = true THEN 1 ELSE 0 END) AS in_stock_count,
  sum(CASE WHEN in_stock = false THEN 1 ELSE 0 END) AS out_of_stock_count,
  min(price) AS min_price_inr,
  round(avg(price), 0) AS avg_price_inr,
  max(price) AS max_price_inr,
  sum(COALESCE(stock, 0)) AS total_inventory_units
FROM public.products
GROUP BY category
ORDER BY total_products DESC;

-- ==============================================================================
-- 8. ORDER WORKFLOW TIMELINE AUDIT: CHECK FULL LIFECYCLE RECONCILIATION
-- ==============================================================================
SELECT 
  o.id AS order_id,
  o.date,
  o.status AS current_status,
  o.payment_method,
  o.payment_status,
  o.total AS total_amount_inr,
  o.customer->>'fullName' AS patron_name,
  o.customer->>'phone' AS patron_phone,
  o.customer->>'city' AS patron_city,
  count(it.id) AS item_count,
  count(h.id) AS timeline_milestones
FROM public.orders o
LEFT JOIN public.order_items it ON it.order_id = o.id
LEFT JOIN public.order_status_history h ON h.order_id = o.id
GROUP BY o.id, o.date, o.status, o.payment_method, o.payment_status, o.total, o.customer
ORDER BY o.created_at DESC;

-- Detailed milestone transition query for a sample order
SELECT 
  order_id,
  from_status,
  to_status,
  carrier,
  tracking_number,
  notes,
  changed_by,
  created_at
FROM public.order_status_history
WHERE order_id = 'SE-84920'
ORDER BY created_at ASC;

-- ==============================================================================
-- 9. ACTIVE PRIVILEGE COUPONS AUDIT
-- ==============================================================================
SELECT 
  code,
  discount_type,
  discount_value,
  min_order AS min_cart_inr,
  active,
  created_at
FROM public.coupons
ORDER BY discount_value DESC;

-- ==============================================================================
-- 10. CONCIERGE APPOINTMENTS PIPELINE AUDIT
-- ==============================================================================
SELECT 
  id AS appointment_id,
  customer_name,
  customer_phone,
  customer_email,
  service_title,
  mode,
  date AS booking_date,
  time_slot,
  city,
  status
FROM public.appointments
ORDER BY date ASC, time_slot ASC;

-- ==============================================================================
-- 11. ABANDONED CART RECOVERY PIPELINE AUDIT
-- ==============================================================================
SELECT 
  id AS cart_id,
  customer_name,
  phone,
  city,
  total AS cart_value_inr,
  applied_coupon,
  dropoff_step,
  recovery_status,
  created_at
FROM public.abandoned_carts
ORDER BY created_at DESC;

-- Recovery conversion metrics query
SELECT 
  recovery_status,
  count(*) AS total_carts,
  sum(total) AS pipeline_value_inr,
  round(avg(total), 0) AS avg_cart_value_inr
FROM public.abandoned_carts
GROUP BY recovery_status;

-- ==============================================================================
-- 12. WEBHOOK IDEMPOTENCY & AUDIT LOG SANITY CHECK
-- ==============================================================================
SELECT 
  event_id,
  event_type,
  processed_at,
  created_at
FROM public.payment_webhook_events
ORDER BY created_at DESC
LIMIT 10;
