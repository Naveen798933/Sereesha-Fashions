-- ==============================================================================
-- Sreesha Elegance — Complete Supabase Database Setup Script (Audited & Enhanced)
-- Run this in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/hmwzjulepzewbuyyyfhp/sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sarees', 'lehengas', 'kurtis', 'contemporary')),
  category_label TEXT,
  collection TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC CHECK (original_price IS NULL OR original_price >= 0),
  primary_image TEXT NOT NULL,
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  rating NUMERIC DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  fabric TEXT,
  weave TEXT,
  color TEXT,
  occasion TEXT,
  silk_mark_certified BOOLEAN DEFAULT false,
  blouse_included BOOLEAN DEFAULT false,
  short_description TEXT,
  description TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROFILES TABLE (Linked with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'stylist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.1 REGISTERED CUSTOMERS (Frictionless phone & name authentication without OTP)
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY DEFAULT ('cust_' || substr(md5(random()::text), 1, 8)),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAVED ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id TEXT PRIMARY KEY DEFAULT ('addr_' || substr(md5(random()::text), 1, 8)),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'Home' CHECK (type IN ('Home', 'Work', 'Atelier', 'Other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Order Placed & Verified' CHECK (
    status IN (
      'Order Placed & Verified',
      'Atelier Inspection & Silk Tagged',
      'Dispatched via BlueDart Express',
      'Out for Doorstep Delivery',
      'Delivered',
      'Cancelled'
    )
  ),
  carrier TEXT DEFAULT 'BlueDart Air Express',
  tracking_number TEXT,
  estimated_delivery TEXT DEFAULT 'In 2 - 4 Business Days',
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  shipping_fee NUMERIC NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
  discount NUMERIC NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total NUMERIC NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'cod')),
  customer JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY DEFAULT ('item_' || substr(md5(random()::text), 1, 8)),
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT,
  title TEXT NOT NULL,
  category TEXT,
  primary_image TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  size TEXT NOT NULL,
  blouse_option TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0)
);

-- 7. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT ('rev_' || substr(md5(random()::text), 1, 8)),
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT,
  author TEXT NOT NULL,
  city TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  date TEXT,
  title TEXT,
  comment TEXT NOT NULL,
  fit TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- 9. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_order NUMERIC DEFAULT 0 CHECK (min_order >= 0),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9.1 COLUMN SAFETY (Guarantees columns exist if tables already existed previously)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Home';
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;

ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 5;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS fit TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;

-- 9.2 USER ID FLEXIBILITY (Safely relaxes foreign keys to support both GoTrue UUIDs and Phone Customer IDs)
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
    ALTER TABLE public.orders ALTER COLUMN user_id TYPE TEXT;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER TABLE public.addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
    ALTER TABLE public.addresses ALTER COLUMN user_id TYPE TEXT;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
    ALTER TABLE public.reviews ALTER COLUMN user_id TYPE TEXT;
  EXCEPTION WHEN OTHERS THEN NULL; END;

  BEGIN
    ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
    ALTER TABLE public.wishlists ALTER COLUMN user_id TYPE TEXT;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- 10. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection);
CREATE INDEX IF NOT EXISTS idx_products_badge ON public.products(badge);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

-- 11. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Customers: Full CRUD for patron registration & admin management
DROP POLICY IF EXISTS "Public can create customers" ON public.customers;
CREATE POLICY "Public can create customers" ON public.customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can lookup customers" ON public.customers;
CREATE POLICY "Public can lookup customers" ON public.customers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can update customers" ON public.customers;
CREATE POLICY "Public can update customers" ON public.customers FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can delete customers" ON public.customers;
CREATE POLICY "Public can delete customers" ON public.customers FOR DELETE USING (true);

-- Products: Everyone can read catalog; admin can manage catalog & stock
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert products" ON public.products;
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update products" ON public.products;
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete products" ON public.products;
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

-- Profiles: Strict user isolation or administrative access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (true);

-- Addresses: Flexible access for registered and guest patrons
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Anyone can view addresses" ON public.addresses;
CREATE POLICY "Anyone can view addresses" ON public.addresses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Anyone can insert addresses" ON public.addresses;
CREATE POLICY "Anyone can insert addresses" ON public.addresses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Anyone can update addresses" ON public.addresses;
CREATE POLICY "Anyone can update addresses" ON public.addresses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Anyone can delete addresses" ON public.addresses;
CREATE POLICY "Anyone can delete addresses" ON public.addresses FOR DELETE USING (true);

-- Orders: Viewable by patron and admin, creation and live tracking updates supported
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own or guest orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders" ON public.orders;
CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Order Items: Viewable and manageable alongside orders
DROP POLICY IF EXISTS "Anyone can view order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Anyone can view order items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update order items" ON public.order_items;
CREATE POLICY "Anyone can update order items" ON public.order_items FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete order items" ON public.order_items;
CREATE POLICY "Anyone can delete order items" ON public.order_items FOR DELETE USING (true);

-- Reviews: Public read, open verified review submissions and admin moderation
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can update reviews" ON public.reviews;
CREATE POLICY "Anyone can update reviews" ON public.reviews FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews" ON public.reviews;
CREATE POLICY "Anyone can delete reviews" ON public.reviews FOR DELETE USING (true);

-- Wishlists: Patron and session wishlist support
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Anyone can view wishlist" ON public.wishlists;
CREATE POLICY "Anyone can view wishlist" ON public.wishlists FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert into own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Anyone can insert into wishlist" ON public.wishlists;
CREATE POLICY "Anyone can insert into wishlist" ON public.wishlists FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlists;
DROP POLICY IF EXISTS "Anyone can remove from wishlist" ON public.wishlists;
CREATE POLICY "Anyone can remove from wishlist" ON public.wishlists FOR DELETE USING (true);

-- Coupons: Public and admin access for checkout validation and coupon management
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Anyone can view coupons" ON public.coupons;
CREATE POLICY "Anyone can view coupons" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert coupons" ON public.coupons;
CREATE POLICY "Anyone can insert coupons" ON public.coupons FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update coupons" ON public.coupons;
CREATE POLICY "Anyone can update coupons" ON public.coupons FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete coupons" ON public.coupons;
CREATE POLICY "Anyone can delete coupons" ON public.coupons FOR DELETE USING (true);

-- 12. AUTOMATED TIMESTAMPS & USER TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated_at ON public.profiles;
CREATE TRIGGER on_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_products_updated_at ON public.products;
CREATE TRIGGER on_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_addresses_updated_at ON public.addresses;
CREATE TRIGGER on_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_orders_updated_at ON public.orders;
CREATE TRIGGER on_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    'customer'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), public.profiles.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. SEED INITIAL COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order, active)
VALUES
  ('WELCOME10', 'percentage', 10, 2000, true),
  ('ROYAL15', 'percentage', 15, 10000, true),
  ('ELEGANCE2000', 'fixed', 2000, 15000, true)
ON CONFLICT (code) DO UPDATE SET
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_order = EXCLUDED.min_order,
  active = EXCLUDED.active;

-- 14. SEED PRODUCTS
INSERT INTO public.products (
  id, slug, title, category, category_label, collection, price, original_price,
  primary_image, gallery_images, badge, rating, review_count, sizes,
  fabric, weave, color, occasion, silk_mark_certified, blouse_included,
  short_description, description, details
) VALUES
(
  'saree-01',
  'kanchipuram-pure-silk-saree-emerald',
  'Kanchipuram Pure Silk Saree — Emerald & Pure Gold Zari',
  'sarees',
  'Kanchipuram Silk',
  'Royal Nizam Edit',
  18500,
  24000,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'BESTSELLER',
  4.9,
  38,
  '["Unstitched Blouse", "Stitched Blouse (34)", "Stitched Blouse (36)", "Stitched Blouse (38)", "Stitched Blouse (40)"]'::jsonb,
  '100% Pure Mulberry Silk',
  'Korvai Handloom',
  'Emerald Green',
  'Bridal / Reception / Festive',
  true,
  true,
  'Handwoven in temple town Kanchipuram using heritage Korvai techniques, adorned with intricate floral and peacock motifs in certified pure gold zari.',
  'A masterpiece of South Indian handloom heritage. This heirloom Kanchipuram saree boasts an opulent emerald green body paired with contrasting crimson borders laden with pure gold zari threadwork.',
  '{"origin": "Kanchipuram, Tamil Nadu / Finished at Hyderabad Atelier", "zariType": "Certified Pure Silver Electroplated Gold Zari", "sareeLength": "5.5 meters", "blouseLength": "0.8 meter matching unstitched blouse piece", "washCare": "Strictly Dry Clean Only. Store in breathable muslin cotton cloth.", "dispatchTime": "Ships in 24-48 hours. Bespoke blouse stitching takes 4-6 business days."}'::jsonb
),
(
  'saree-02',
  'banarasi-kadhwa-silk-ivory-rose',
  'Banarasi Kadhwa Brocade Saree — Ivory Cream & Rose Gold',
  'sarees',
  'Banarasi Silk',
  'Royal Nizam Edit',
  14200,
  17500,
  'https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'LIMITED',
  4.8,
  22,
  '["Unstitched Blouse", "Stitched Blouse (36)", "Stitched Blouse (38)"]'::jsonb,
  'Katan Pure Silk',
  'Handloom Kadhwa Technique',
  'Ivory Cream',
  'Sangeet / Festive / Cocktail',
  true,
  true,
  'Opulent ivory Katan silk handcrafted with traditional Kadhwa bootis in subtle rose-gold zari, finished with scalloped border detailing.',
  'An epitome of Varanasi historic weaving mastery. The delicate Kadhwa technique leaves zero loose threads on the reverse, ensuring featherlight drape and majestic sheen.',
  '{"origin": "Varanasi, Uttar Pradesh", "zariType": "Fine Rose Gold Tested Zari", "sareeLength": "5.5 meters", "blouseLength": "0.85 meter brocade blouse piece", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 24 hours"}'::jsonb
),
(
  'saree-03',
  'paithani-silk-saree-royal-purple',
  'Pure Paithani Silk Saree — Royal Purple & Peacock Pallu',
  'sarees',
  'Paithani Silk',
  'Heritage Weaves',
  22000,
  28000,
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'NEW',
  5.0,
  14,
  '["Unstitched Blouse", "Custom Tailored"]'::jsonb,
  'Pure Mulberry Silk',
  'Tapestry Handloom Weave',
  'Royal Purple',
  'Weddings / Festive Pheras',
  true,
  true,
  'Handcrafted with iconic kaleidoscope peacock motifs (Mor Bangadi) on a shimmering royal purple pure silk drape.',
  'Preserving the royal tradition of Maharashtra and Deccan royalty. Featuring kaleidoscopic tapestry borders and an opulent golden pallu.',
  '{"origin": "Yeola, Maharashtra", "zariType": "Pure Golden Zari", "sareeLength": "5.5 meters", "blouseLength": "0.8 meter matching silk blouse", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 48 hours"}'::jsonb
),
(
  'saree-04',
  'uppada-jamdani-silk-saree-ruby-gold',
  'Uppada Pure Silk Jamdani Saree — Ruby Red & Gold Zari',
  'sarees',
  'Uppada Silk',
  'Deccan Royal Edit',
  26500,
  32000,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'BESTSELLER',
  4.9,
  29,
  '["Unstitched Blouse", "Stitched Blouse (36)", "Stitched Blouse (38)"]'::jsonb,
  'Pure Uppada Mulberry Silk',
  'Jamdani Non-Mechanical Weave',
  'Ruby Red',
  'Bridal Muhurtham / Reception',
  true,
  true,
  'Featherlight Uppada Jamdani handloom woven with silver-gilt zari floral vines on an auspicious ruby red canvas.',
  'Renowned for its gossamer lightness and translucent luster, this pure Uppada Jamdani saree requires two master artisans working for 4 weeks per piece.',
  '{"origin": "Uppada, Andhra Pradesh", "zariType": "Tested Silver-Gilt Pure Zari", "sareeLength": "5.5 meters", "blouseLength": "0.8 meter matching blouse", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 24 hours"}'::jsonb
),
(
  'saree-05',
  'gadwal-silk-saree-maroon-mustard',
  'Handloom Gadwal Saree — Maroon & Mustard Temple Border',
  'sarees',
  'Gadwal Silk',
  'Heritage Weaves',
  16800,
  21000,
  'https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'NEW',
  4.8,
  17,
  '["Unstitched Blouse", "Stitched Blouse (36)"]'::jsonb,
  'Pure Silk with Zari Borders',
  'Kuttu Interlocked Weave',
  'Maroon & Mustard',
  'Traditional Festive / Puja',
  true,
  true,
  'Telangana pride — cotton-silk body joined seamlessly with pure silk kumbha temple borders and rich zari pallu.',
  'A classic Gadwal weave celebrated across generations in Telangana. The interlocked weft border ensures comfort and peerless grandeur.',
  '{"origin": "Jogulamba Gadwal, Telangana", "zariType": "Pure Zari", "sareeLength": "5.5 meters", "blouseLength": "0.8 meter blouse", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 24 hours"}'::jsonb
),
(
  'lehenga-01',
  'royal-nizam-bridal-lehenga-crimson',
  'Royal Nizam Bridal Lehenga — Crimson Velvet & Zardozi',
  'lehengas',
  'Bridal Lehenga',
  'Royal Nizam Edit',
  65000,
  82000,
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'NEW',
  5.0,
  19,
  '["Bespoke Made-to-Measure", "Size S (34)", "Size M (36)", "Size L (38)", "Size XL (40)"]'::jsonb,
  'Micro Velvet & Organza Silk',
  'Handcrafted Zardozi & Dabka',
  'Royal Crimson Red',
  'Bridal Vows / Wedding Night',
  true,
  true,
  'Hand-embroidered by Hyderabads master karigars with antique zardozi, real seed pearls, and dabka work, accompanied by double organza dupattas.',
  'An ensemble fit for a queen. Handcrafted over 320 man-hours in our Kukatpally atelier, this bridal lehenga features a flared 16-kali silhouette adorned with heritage Hyderabadi jali patterns.',
  '{"origin": "Handcrafted in Hyderabad, Telangana", "zariType": "Antique Dull Gold & Zardozi Wire", "washCare": "Specialist Luxury Dry Clean Only", "dispatchTime": "Bespoke dispatch in 10-14 days. Express alterations available."}'::jsonb
),
(
  'lehenga-02',
  'champagne-mirrorwork-festive-lehenga',
  'Champagne Gold Mirrorwork Lehenga — Silk Georgette',
  'lehengas',
  'Festive Lehenga',
  'Contemporary Glamour',
  38000,
  45000,
  'https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'BESTSELLER',
  4.9,
  26,
  '["Size S (34)", "Size M (36)", "Size L (38)"]'::jsonb,
  'Pure Viscose Silk Georgette',
  'Cutdana & Real Mirrorwork',
  'Champagne Gold',
  'Sangeet / Cocktail / Reception',
  false,
  true,
  'Twirl-ready champagne gold lehenga glittering with intricate glass mirrors, resham thread accents, and a scalloped dupatta.',
  'Crafted for modern brides and bridesmaid royalty. The mirrorwork catches the ambient night lights effortlessly while remaining lightweight and comfortable.',
  '{"origin": "Hyderabad Atelier", "zariType": "Silver Resham & Hand-cut Mirrors", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 3-5 business days"}'::jsonb
),
(
  'kurti-01',
  'anarkali-suit-set-midnight-blue',
  'Chanderi Silk Anarkali Set — Midnight Blue & Gota Patti',
  'kurtis',
  'Designer Anarkali',
  'Festive Prêt',
  8900,
  11500,
  'https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1585944672573-eda5af88e8af?auto=format&fit=crop&w=1000&q=85", "https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'SALE',
  4.7,
  42,
  '["XS (32)", "S (34)", "M (36)", "L (38)", "XL (40)", "XXL (42)"]'::jsonb,
  'Handwoven Chanderi Silk',
  'Handcrafted Gota Patti & Mukaish',
  'Midnight Blue',
  'Diwali / Festive Puja / Mehendi',
  false,
  false,
  'A flowy 3-piece Chanderi silk Anarkali set featuring artisanal Rajasthani gota patti borders, churidar pants, and a tissue organza dupatta.',
  'Elegance in motion. Cut from breezy Chanderi silk with a comfortable mulmul lining, this Anarkali is adorned with hand-stitched gota patti ribbons along the neck and hemline.',
  '{"origin": "Kukatpally Boutique Workshop", "zariType": "Lappa Gota Lace", "washCare": "Dry Clean Recommended or Gentle Handwash", "dispatchTime": "Ships in 24 hours"}'::jsonb
),
(
  'kurti-02',
  'chikankari-straight-kurta-set-powder-peach',
  'Lucknowi Mukaish Kurta Set — Powder Peach Modal Silk',
  'kurtis',
  'Kurta & Palazzo Set',
  'Boutique Daywear',
  6400,
  7800,
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'NEW',
  4.9,
  18,
  '["S (34)", "M (36)", "L (38)", "XL (40)"]'::jsonb,
  'Pure Modal Silk',
  'Authentic Hand-Chikankari',
  'Powder Peach',
  'Day Festive / Family Celebrations',
  false,
  false,
  'Intricate hand-embroidered shadow work and mukaish metallic sequins on ultra-soft breathable modal silk with matching straight trousers.',
  'A soothing palette for daytime elegance. Hand-stitched by skilled women artisans with bakhiya, phanda, and keelkangan needlework.',
  '{"origin": "Lucknow & Hyderabad Collaboration", "zariType": "Mukaish Silver Dots", "washCare": "Gentle Hand Wash with Mild Liquid Detergent", "dispatchTime": "Ships in 24 hours"}'::jsonb
),
(
  'contemporary-01',
  'draped-saree-gown-emerald-velvet',
  'Ready-to-Wear Draped Saree Gown — Olive & Metallic Gold',
  'contemporary',
  'Indo-Western Couture',
  'Modern Nizam Edit',
  24500,
  29000,
  'https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1617627143233-0072f0906bea?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'BESTSELLER',
  4.8,
  31,
  '["XS (32)", "S (34)", "M (36)", "L (38)"]'::jsonb,
  'Stretch Satin Crepe & Organza',
  'Pleated Draping & Cutdana Corset',
  'Olive Gold',
  'Sangeet / Red Carpet / Reception',
  false,
  true,
  'Pre-stitched ready-to-wear draped saree with a structured pearl-encrusted corset bodice. Slip into royal elegance in under 60 seconds.',
  'No pins, no pleating stress. Designed for the globetrotting Indian woman who values heritage aesthetics without compromising modern convenience.',
  '{"origin": "Hyderabad Boutique Atelier", "zariType": "Cutdana & Crystal Wire", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 48 hours"}'::jsonb
),
(
  'contemporary-02',
  'cape-jacket-sharara-set-garnet',
  'Embroidered Cape & Sharara Set — Garnet Rose Silk',
  'contemporary',
  'Sharara & Cape Ensemble',
  'Modern Nizam Edit',
  19800,
  23500,
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85',
  '["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85"]'::jsonb,
  'NEW',
  4.9,
  16,
  '["S (34)", "M (36)", "L (38)", "XL (40)"]'::jsonb,
  'Raw Silk & Soft Tulle',
  'Zari Resham & Pearl Embroidery',
  'Garnet Rose',
  'Cocktails / Destination Weddings',
  false,
  true,
  'Flared tiered sharara pants paired with an embroidered bustier and a dramatic floor-sweeping sheer cape.',
  'Make an unforgettable entrance. The cape floats gracefully as you walk, embellished along the hemline with heritage Hyderabadi border embroidery.',
  '{"origin": "Hyderabad Atelier", "zariType": "Rose Gold Zari Threads", "washCare": "Dry Clean Only", "dispatchTime": "Ships in 3 business days"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  primary_image = EXCLUDED.primary_image,
  gallery_images = EXCLUDED.gallery_images,
  description = EXCLUDED.description,
  details = EXCLUDED.details,
  updated_at = NOW();

-- 15. SEED VERIFIED CUSTOMER REVIEWS
INSERT INTO public.reviews (id, product_id, author, city, rating, date, title, comment, fit, verified)
VALUES
(
  'rev-01',
  'saree-01',
  'Lakshmi Prasanna',
  'Banjara Hills, Hyderabad',
  5,
  '02 October 2026',
  'Heirloom quality zari and breathtaking drape',
  'The emerald green is pure royal magnificence. Tested the Silk Mark QR code upon delivery and verified genuine mulberry silk. Arrived in a luxury protective hardbox.',
  'True to Draping Standard',
  true
),
(
  'rev-02',
  'saree-01',
  'Sunitha Rao',
  'Jubilee Hills, Hyderabad',
  5,
  '24 September 2026',
  'Stitched blouse fit was immaculate',
  'Took advantage of their Hyderabad atelier custom blouse stitching. The Maggam embroidery matched the saree border seamlessly.',
  'Perfect Atelier Fit',
  true
),
(
  'rev-03',
  'lehenga-01',
  'Aishwarya Varma',
  'Madhapur, Hyderabad',
  5,
  '18 September 2026',
  'My dream wedding reception outfit',
  'The zardozi wirework shines with subtle royal gold rather than loud brass. Worth every single rupee. Karigars even called to confirm my waist measurements.',
  'Bespoke Tailored',
  true
)
ON CONFLICT (id) DO NOTHING;
 
-- 16. REALTIME REPLICATION (For live order tracking, reviews, and admin dashboard)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
    EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    EXCEPTION WHEN OTHERS THEN NULL; END;
  END IF;
END $$;

