// CounterContext.tsx
import React, { createContext, useReducer, Reducer } from "react";

interface CounterState {
  count: number;
  shoppingData: any;
}

interface CounterAction {
  type: "increment" | "decrement" | "setShoppingData";
  payload?: any;
}

const initialState: CounterState = {
  count: 0,
  shoppingData: null,
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
    case "setShoppingData":
      return { ...state, shoppingData: action.payload };
    
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
      setShoppingData: (shoppingData: any) => void;
    }
  | undefined
>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  const increment = () => dispatch({ type: "increment" });
  const decrement = () => dispatch({ type: "decrement" });
  const setShoppingData = (payload: any) =>
    dispatch({ type: "setShoppingData", payload });

  return (
    <CounterContext.Provider
      value={{ state, increment, decrement, setShoppingData }}
    >
      {children}
    </CounterContext.Provider>
  );
}
export default CounterContext;
