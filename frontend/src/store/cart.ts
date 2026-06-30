import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(productId, quantity = 1) {
        const items = [...get().items];

        const index = items.findIndex((item) => item.productId === productId);

        if (index >= 0) {
          items[index] = {
            ...items[index],
            quantity: items[index].quantity + quantity,
          };
        } else {
          items.push({ productId, quantity });
        }

        set({ items });
      },

      removeItem(productId) {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      setQuantity(productId, quantity) {
        if (quantity <= 0) {
          set({
            items: get().items.filter((item) => item.productId !== productId),
          });
          return;
        }

        const items = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );

        set({ items });
      },

      clear() {
        set({ items: [] });
      },
    }),
    { name: "nordshop-cart" },
  ),
);
