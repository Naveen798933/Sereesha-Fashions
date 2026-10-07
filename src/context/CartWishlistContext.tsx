"use client";

import * as React from "react";
import { Product } from "@/data/products";
import { showToast } from "@/components/ui/Toast";

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
  addToCart: (product: Product, size?: string, blouseOption?: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const CartWishlistContext = React.createContext<CartWishlistContextType | undefined>(undefined);

export const CartWishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      if (exists) {
        showToast.info("Removed from your wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast.success("Saved to your wishlist");
        return [...prev, productId];
      }
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
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
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
