import React, { useState, useContext } from "react";
import CounterContext from "../CounterContext";
import { Input } from "antd";
import Table from "./Table";
import "./index.scss";

function List() {
  const { setFilterKeyword } = useContext(CounterContext)!;
  const [filter, setFilter] = useState("");
  const handlePressEnter = (e: any) => {
    setFilterKeyword(e.target.value);
  };
  const handleChange = (e: any) => {
    setFilter(e.target.value);
  };
  return (
    <div className="listWrapper">
      <div className="content">
        <header>
          <i className="iconfont icon-iconHeader"></i>
          <span>Data Trading on AO</span>
        </header>
        <Input
          placeholder="Filter data..."
          onPressEnter={handlePressEnter}
          onChange={handleChange}
          value={filter}
          className="filterInput"
        />
        <Table />
      </div>
    </div>
  );
}

export default List;
