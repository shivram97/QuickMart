import { createContext, useContext, useReducer, useCallback, ReactNode } from "react";
import { Product } from "@shared/schema";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR" };

const CartContext = createContext<{
  items: CartItem[];
  total: number;
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }
    case "REMOVE_ITEM": {
      const item = state.items.find(item => item.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity),
      };
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find(item => item.id === action.payload.id);
      if (!item) return state;

      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== action.payload.id),
          total: state.total - (item.price * item.quantity),
        };
      }

      const quantityDiff = action.payload.quantity - item.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
      };
    }
    case "CLEAR":
      return {
        items: [],
        total: 0,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  });

  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeItem = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total: state.total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
