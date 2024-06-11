import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  FC,
  useContext,
} from "react";

import { Pagination } from "antd";
import PButton from "@/components/PButton";
import PSelect from "@/components/PSelect";
import CounterContext from "../../CounterContext";

import "./index.scss";
const PAGESIZE = 10;
interface TokenTableProps {}

const Table: FC<TokenTableProps> = memo(({}) => {
  const {
    state: { shoppingId },
    setShoppingId,
  } = useContext(CounterContext)!;
  const totolCount = 11;
  const [current, setCurrent] = useState(1);
  const [filterType, setFilterType] = useState("");

  const showTokenListFn = useCallback(() => {
    // const startK = (current - 1) * PAGESIZE;
    // let newL = listMap.slice(startK, startK + PAGESIZE);
    return [
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "1hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "2hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "3hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "4hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "5hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "6hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "7hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "8hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "9hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "10hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
      {
        isValid: true,
        registeredTimestamp: 1717473366067,
        dataTag:
          '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
        id: "11hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
        computeNodes: ["testnode1", "testnode3", "testnode2"],
        from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
      },
    ];
  }, [current]);

  const pageChangedFn = (page) => {
    if (page === "pre") {
      page = current - 1;
    }
    if (page === "next") {
      page = current + 1;
    }
    if (page < 1) {
      page = 1;
    }
    setCurrent(page);
  };
  const handleAddToShoppingCart = (j: any) => {
    debugger;
    setShoppingId(j.id);
  };
  const filterTypeList = [
    { label: "All", value: "All" },
    { label: "Text", value: "Text" },
    { label: "Video", value: "Video" },
  ];
  const handleChangeFilterType = (val: string) => {
    setFilterType(val);
  };
  const handleSort = (sort: string) => {};
  return (
    <div className="dataTable">
      <ul className={`tokenItems fullHeight`}>
        <li className="tokenItem th">
          <div className="dataId">Data ID</div>
          <div className="type">
            <PSelect
              placeholder="Type"
              list={filterTypeList}
              onChange={handleChangeFilterType}
              value={filterType}
            />
          </div>
          <div className="price">
            <div className="priceBox">
              <div className="priceText">Price(AO)</div>
              <div className="sortWrapper">
                <PButton
                  type="icon"
                  icon={<i className="iconfont icon-miniArrowUp"></i>}
                  onClick={() => {
                    handleSort("asc");
                  }}
                  className="ascBtn"
                />
                <PButton
                  type="icon"
                  icon={<i className="iconfont icon-miniArrowUp"></i>}
                  onClick={() => {
                    handleSort("desc");
                  }}
                  className="descBtn"
                />
              </div>
            </div>
          </div>
          <div className="operation"></div>
        </li>
        {showTokenListFn().map((j: any) => {
          return (
            <li className="tokenItem tr" key={j.id}>
              <div className="dataId">{j.id}</div>
              <div className="type">
                <div className="typeTag">{JSON.parse(j.dataTag).type}</div>
                <div className="name">{JSON.parse(j.dataTag).name}</div>
              </div>
              <div className="price">{JSON.parse(j.dataTag).price}</div>
              <div className="operation">
                <PButton
                  type="icon"
                  icon={<i className="iconfont icon-iconShoppingCart"></i>}
                  onClick={() => {
                    handleAddToShoppingCart(j);
                  }}
                  className="addBtn"
                />
              </div>
            </li>
          );
        })}
      </ul>
      {totolCount > PAGESIZE && (
        <div className={"pageComponent"}>
          <Pagination
            total={totolCount}
            onChange={pageChangedFn}
            showSizeChanger={false}
            pageSize={PAGESIZE}
          />
        </div>
      )}
    </div>
  );
});

export default Table;
