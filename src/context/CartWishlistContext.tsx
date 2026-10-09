"use client";

import * as React from "react";
import { Product } from "@/data/products";
import { showToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";

export interface CartItem {
  id: string;
  product: Product;
  size: string;
  quantity: number;
  blouseOption?: string;
}

interface CartWishlistContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, blouseOption?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isHydrated: boolean;
}

const emptySubscribe = () => () => {};

const CartWishlistContext = React.createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isHydrated = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [cart, setCart] = React.useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("sreesha_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("sreesha_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Sync to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("sreesha_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to sync cart", e);
    }
  }, [cart]);

  React.useEffect(() => {
    try {
      localStorage.setItem("sreesha_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to sync wishlist", e);
    }
  }, [wishlist]);

  // Sync wishlist with Supabase for authenticated users
  React.useEffect(() => {
    async function syncSupabaseWishlist() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from("wishlists")
            .select("product_id")
            .eq("user_id", session.user.id);

          if (!error && data) {
            const remoteIds = (data as { product_id: string }[]).map((d) => d.product_id);
            setWishlist((prev) => Array.from(new Set([...prev, ...remoteIds])));
          }
        }
      } catch {
        // offline fallback
      }
    }
    syncSupabaseWishlist();
  }, []);

  const addToCart = (
    product: Product,
    size?: string,
    blouseOption?: string,
    quantity: number = 1
  ) => {
    const selectedSize = size || product.sizes[0] || "Standard";
    const itemId = `${product.id}-${selectedSize}-${blouseOption || "none"}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, size: selectedSize, quantity, blouseOption }];
    });

    showToast.success(`Added ${product.title} to your bag`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast.info("Item removed from your shopping bag");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];

      if (exists) {
        showToast.info("Removed from your wishlist");
      } else {
        showToast.success("Saved to your wishlist");
      }

      // Persist to Supabase if authenticated
      (async () => {
        try {
          const supabase = createClient();
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user) {
            if (exists) {
              await supabase
                .from("wishlists")
                .delete()
                .eq("user_id", session.user.id)
                .eq("product_id", productId);
            } else {
              await supabase
                .from("wishlists")
                .insert([{ user_id: session.user.id, product_id: productId }]);
            }
          }
        } catch {
          // ignore
        }
      })();

      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartWishlistContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isHydrated,
      }}
    >
      {children}
    </CartWishlistContext.Provider>
  );
};

export const useCartWishlist = () => {
  const context = React.useContext(CartWishlistContext);
  if (!context) {
    throw new Error("useCartWishlist must be used within a CartWishlistProvider");
  }
  return context;
};
