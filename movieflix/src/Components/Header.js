import React from "react";
import classes from "./Header.module.css";
import { Link } from "react-router-dom";

function Header(props) {
  return (
    <div className={classes.headerBox}>
      <h2 className={classes.logo}>MovieFlix</h2>
      <div className={classes.btnBox}>
        <div
          onClick={() => {
            if (props.type !== "movie") {
              props.setDataLoaded(false);
              props.setType("movie");
            }
          }}
          className={`${classes.btns} ${props.type === "movie" ? classes.active : null}`}
        >
          Movies
        </div>
        <div
          onClick={() => {
            if (props.type !== "series") {
              props.setDataLoaded(false);
              props.setType("series");
            }
          }}
          className={`${classes.btns} ${props.type === "series" ? classes.active : null}`}
        >
          Series
        </div>
        <div
          onClick={() => {
            if (props.type !== "show") {
              props.setDataLoaded(false);
              props.setType("show");
            }
          }}
          className={`${classes.btns} ${props.type === "show" ? classes.active : null}`}
        >
          Shows
        </div>
      </div>
      <div className={classes.searchBox}>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            props.setDataLoaded(false);
            props.setSearchKeyword(e.target.value);
          }}
        />
      </div>
      <Link to={"/admin"} className={`${classes.btns} ${classes.admin}`}>
        Admin➡️
      </Link>
    </div>
  );
}

export default Header;
