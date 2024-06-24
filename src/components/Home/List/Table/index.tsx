import { memo, useState, useMemo, FC, useContext } from "react";
import { Pagination, Spin } from "antd";
import dayjs from "dayjs";
import { div } from "@/utils/utils";
import PButton from "@/components/PButton";
import PSelect from "@/components/PSelect";
import iconSort from "@/assets/img/iconSort.svg";
import CounterContext from "../../CounterContext";

import "./index.scss";
const PAGESIZE = 10;
interface TokenTableProps {}

const Table: FC<TokenTableProps> = memo(({}) => {
  const {
    state: {
      marketDataList,
      filterKeyword,
      marketDataListLoading,
      ownerAddress,
    },
    setShoppingData,
  } = useContext(CounterContext)!;
  const [current, setCurrent] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const pageChangedFn = (pageNumber: number) => {
    setCurrent(pageNumber);
  };
  const handleAddToShoppingCart = async (j: any) => {
    if (!ownerAddress) {
      alert("Please connect the wallet first");
      // message.open({
      //   type: "warning",
      //   content: "Please connect the wallet first",
      // });
    }
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
      filteredList = marketDataList.filter((i: any) => {
        const lowerCaseKeyword = filterKeyword.toLowerCase();
        const { id, dataTag } = i;
        let dataName;
        if (dataTag) {
          dataName = JSON.parse(dataTag).dataName;
        }
        return (
          id.toLowerCase().startsWith(lowerCaseKeyword) ||
          (dataName && dataName.toLowerCase().startsWith(lowerCaseKeyword))
        );
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
      let list1: any[] = [];
      let list2: any[] = [];
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
        return dataPriceB - dataPriceA;
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
                <div className="priceText">Price(wAR)</div>
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
                  {j.dataTag && JSON.parse(j.dataTag)?.dataType && (
                    <>
                      <div className="typeTag">
                        {JSON.parse(j.dataTag).dataType}
                      </div>
                      <div className="name">
                        {JSON.parse(j.dataTag).dataName}
                      </div>
                    </>
                  )}
                </div>
                <div className="price">
                  {j.price
                    ? div(
                        JSON.parse(j.price).price,
                        Math.pow(10, 12)
                      ).toString()
                    : ""}
                  {/* {j.price ? JSON.parse(j.price).price / Math.pow(10, 12) : ""} */}
                </div>
                <div className="operation">
                  <PButton
                    type="icon"
                    icon={<i className="iconfont icon-iconShoppingCart"></i>}
                    onClick={() => {
                      handleAddToShoppingCart(j);
                    }}
                    className="addBtn"
                    disabled={
                      dayjs().diff(dayjs(j.registeredTimestamp), "minute") < 1
                    }
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
