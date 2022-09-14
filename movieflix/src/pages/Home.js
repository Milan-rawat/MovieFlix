import React, { useState } from "react";
import Header from "../Components/Header";
import Body from "../Components/Body";

function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [type, setType] = useState("movie");
  return (
    <div style={{ backgroundColor: "#303030", minHeight: "100%" }}>
      <Header
        setSearchKeyword={setSearchKeyword}
        setDataLoaded={setDataLoaded}
        setType={setType}
        type={type}
      />
      <Body
        searchKeyword={searchKeyword}
        dataLoaded={dataLoaded}
        setDataLoaded={setDataLoaded}
        type={type}
      />
    </div>
  );
}

export default Home;
