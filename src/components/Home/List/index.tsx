import React, { useState } from "react";
import { Input } from "antd";
import Table from "./Table";
import "./index.scss";

function List() {
  const [filter, setFilter] = useState("");
  const handlePressEnter = () => {};
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
          allowClear
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
