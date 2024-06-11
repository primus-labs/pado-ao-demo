// CounterContext.tsx
import React, { createContext, useReducer, Reducer } from "react";

interface CounterState {
  count: number;
  shoppingId: string;
}

interface CounterAction {
  type: "increment" | "decrement" | "setShoppingId";
  payload?: any;
}

const initialState: CounterState = {
  count: 0,
  shoppingId: "",
};

// 创建一个reducer来处理状态更新
const counterReducer: Reducer<CounterState, CounterAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "setShoppingId":
      return { ...state, shoppingId: action.payload };
    default:
      throw new Error();
  }
};

// 创建Context
const CounterContext = createContext<
  | {
      state: CounterState;
      increment: () => void;
      decrement: () => void;
      setShoppingId: (shoppingId: any) => void;
    }
  | undefined
>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  const increment = () => dispatch({ type: "increment" });
  const decrement = () => dispatch({ type: "decrement" });
  const setShoppingId = (payload: any) =>
    dispatch({ type: "setShoppingId", payload });

  return (
    <CounterContext.Provider
      value={{ state, increment, decrement, setShoppingId }}
    >
      {children}
    </CounterContext.Provider>
  );
}
export default CounterContext;
