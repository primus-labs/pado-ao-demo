import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  FC,
  useContext,
  useEffect,
} from "react";

import { Pagination } from "antd";
import PButton from "@/components/PButton";
import PSelect from "@/components/PSelect";
import CounterContext from "../../CounterContext";
import { listData } from "@padolabs/pado-ao-sdk";

import "./index.scss";
const PAGESIZE = 10;
interface TokenTableProps {}

const Table: FC<TokenTableProps> = memo(({}) => {
  const {
    state: { shoppingData },
    setShoppingData,
  } = useContext(CounterContext)!;

  const [totolCount, setTotolCount] = useState(0);
  const [dataList, setDataList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [filterType, setFilterType] = useState("");

  // const showTokenListFn = useCallback(() => {
  //   // const startK = (current - 1) * PAGESIZE;
  //   // let newL = listMap.slice(startK, startK + PAGESIZE);
  //   return [
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "1hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "2hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "3hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "4hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "5hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "6hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "7hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "8hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "9hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "10hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //     {
  //       isValid: true,
  //       registeredTimestamp: 1717473366067,
  //       dataTag:
  //         '{"type":"text","name":"this is name","description":"this is description", "price": "0.01"}',
  //       id: "11hhzNw4jSe24MsFvLTxebzWqqZv308S8PXYw5rwWc28c",
  //       computeNodes: ["testnode1", "testnode3", "testnode2"],
  //       from: "JNqOSFDeSAh_icEDVAVa_r9wJfGU9AYCAJUQb2ss7T8",
  //     },
  //   ];
  // }, [current]);

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
    setShoppingData(j);
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
  const initFn = async () => {
    try {
      const res = await listData();
      setTotolCount(res.length);
      const newL = res.sort(
        (a: any, b: any) => b.registeredTimestamp - a.registeredTimestamp
      );
      setDataList(newL);
      debugger;
    } catch (e) {
      console.log("listData  error:", e);
    }
  };
  const formatDataList = useMemo(() => {
    return dataList.slice(PAGESIZE * (current - 1), PAGESIZE * current);
  }, [dataList]);
  useEffect(() => {
    initFn();
  }, []);
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
        {formatDataList.map((j: any) => {
          return (
            <li className="tokenItem tr" key={j.id}>
              <div className="dataId">{j.id}</div>
              <div className="type">
                <div className="typeTag">{JSON.parse(j.dataTag).dataType}</div>
                <div className="name">{JSON.parse(j.dataTag).dataName}</div>
              </div>
              <div className="price">{JSON.parse(j.dataTag).dataPrice}</div>
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
