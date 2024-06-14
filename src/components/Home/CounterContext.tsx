// CounterContext.tsx
import React, { createContext, useReducer, Reducer, useEffect } from "react";
import { listData } from "@padolabs/pado-ao-sdk";
interface CounterState {
  shoppingData: any;
  marketDataList: any;
  marketDataListLoading: boolean;
  filterKeyword: string;
  ownerAddress: string;
}

interface CounterAction {
  type:
    | "setShoppingData"
    | "setMarketDataList"
    | "setFilterKeyword"
    | "setMarketDataListLoading"
    | "setOwnerAddress";
  payload?: any;
}

const initialState: CounterState = {
  shoppingData: null,
  marketDataList: [],
  marketDataListLoading: false,
  filterKeyword: "",
  ownerAddress: "",
};

// 创建一个reducer来处理状态更新
const counterReducer: Reducer<CounterState, CounterAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "setShoppingData":
      return { ...state, shoppingData: action.payload };
    case "setMarketDataList":
      return { ...state, marketDataList: action.payload };
    case "setMarketDataListLoading":
      return { ...state, marketDataListLoading: action.payload };
    case "setFilterKeyword":
      return { ...state, filterKeyword: action.payload };
    case "setOwnerAddress":
      return { ...state, ownerAddress: action.payload };
    default:
      throw new Error();
  }
};

// 创建Context
const CounterContext = createContext<
  | {
      state: CounterState;
      setShoppingData: (shoppingData: any) => void;
      setFilterKeyword: (keyword: string) => void;
      setMarketDataListAsync: () => void;
      setOwnerAddress: (address: string) => void;
    }
  | undefined
>(undefined);

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  const setShoppingData = (payload: any) =>
    dispatch({ type: "setShoppingData", payload });
  const setMarketDataList = (payload: any) =>
    dispatch({ type: "setMarketDataList", payload });
  const setMarketDataListLoading = (payload: any) =>
    dispatch({ type: "setMarketDataListLoading", payload });
  const setFilterKeyword = (payload: any) => {
    dispatch({ type: "setFilterKeyword", payload });
  };
  const setOwnerAddress = (payload: any) => {
    dispatch({ type: "setOwnerAddress", payload });
  };
  const setMarketDataListAsync = async () => {
    try {
      setMarketDataListLoading(true);
      const res = await listData();
      const newL = res.sort(
        (a: any, b: any) => b.registeredTimestamp - a.registeredTimestamp
      );
      setMarketDataList(newL);
      setMarketDataListLoading(false);
    } catch (e) {
      console.log("listData  error:", e);
    }
  };
  useEffect(() => {
    setMarketDataListAsync();
  }, []);

  return (
    <CounterContext.Provider
      value={{
        state,
        setShoppingData,
        setOwnerAddress,
        setFilterKeyword,
        setMarketDataListAsync,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
}
export default CounterContext;
