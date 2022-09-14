import React from "react";
import Table from "../Components/Table";
import { useHistory } from "react-router-dom";

function Dashboard() {
  const history = useHistory();
  return (
    <>
      {/* <div className={classes.header}>
        <div className={classes.btn} onClick={() => history.goBack()}>
          🔙
        </div>
      </div> */}
      <Table />;
    </>
  );
}

export default Dashboard;
