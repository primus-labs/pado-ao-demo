import React, {
  memo,
  useCallback,
  useState,
  useMemo,
  FC,
  useContext,
  useEffect,
} from "react";
import { Pagination, Spin } from "antd";
import PButton from "@/components/PButton";
import PSelect from "@/components/PSelect";
import iconSort from "@/assets/img/iconSort.svg";
import CounterContext from "../../CounterContext";

import "./index.scss";
const PAGESIZE = 10;
interface TokenTableProps {}

const Table: FC<TokenTableProps> = memo(({}) => {
  const {
    state: { marketDataList, filterKeyword, marketDataListLoading },
    setShoppingData,
  } = useContext(CounterContext)!;
  const [current, setCurrent] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [sortOrder, setSortOrder] = useState("");

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
  const handleSort = () => {
    if (sortOrder === "") {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      setSortOrder("asc");
    }
  };
  const filteredDataList = useMemo(() => {
    let filteredList = [...marketDataList];
    if (filterKeyword) {
      filteredList = marketDataList.filter((i) => {
        const { id, dataTag } = i;
        // const dataTagObj = JSON.parse(dataTag);
        // dataTagObj.dataName.startsWith(filterKeyWord)
        return id.toLowerCase().startsWith(filterKeyword.toLowerCase());
      });
    }
    if (filterType && filterType !== "All") {
      filteredList = filteredList.filter((i) => {
        const { dataTag } = i;
        const dataTagObj = JSON.parse(dataTag);
        return dataTagObj.dataType === filterType;
      });
    }
    if (sortOrder) {
      let list1 = [];
      let list2 = [];
      filteredList.forEach((i) => {
        if (i.dataTag) {
          const { dataPrice } = JSON.parse(i.dataTag);
          if (dataPrice) {
            list1.push(i);
          } else {
            list2.push(i);
          }
        } else {
          list2.push(i);
        }
      });
      list1 = list1.sort((a: any, b: any) => {
        const { dataPrice: dataPriceA } = JSON.parse(a.dataTag);
        const { dataPrice: dataPriceB } = JSON.parse(b.dataTag);
        if (sortOrder === "asc") {
          return dataPriceA - dataPriceB;
        }
        if (sortOrder === "desc") {
          return dataPriceB - dataPriceA;
        }
      });
      filteredList = [...list1, ...list2];
    }
    return filteredList;
  }, [marketDataList, filterKeyword, filterType, sortOrder]);
  const formatDataList = useMemo(() => {
    return filteredDataList.slice(PAGESIZE * (current - 1), PAGESIZE * current);
  }, [filteredDataList, current]);
  const totolCount = useMemo(() => {
    return filteredDataList.length;
  }, [filteredDataList]);

  return (
    <div className="dataTable">
      <Spin spinning={marketDataListLoading}>
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
                  <img src={iconSort} alt="" onClick={handleSort} />
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
                  <div className="typeTag">
                    {j.dataTag ? JSON.parse(j.dataTag).dataType : ""}
                  </div>
                  <div className="name">
                    {j.dataTag ? JSON.parse(j.dataTag).dataName : ""}
                  </div>
                </div>
                <div className="price">
                  {j.dataTag ? JSON.parse(j.dataTag).dataPrice : ""}
                </div>
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
      </Spin>
    </div>
  );
});

export default Table;
