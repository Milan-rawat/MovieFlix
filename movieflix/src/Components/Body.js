import React, { useState, useEffect, useCallback } from "react";
import classes from "./Body.module.css";
import key from "../utils/config";
import { Link } from "react-router-dom";

import { CircularProgress, Pagination } from "@mui/material";

const MovieCard = (props) => {
  return (
    <Link
      className={classes.card}
      to={{
        pathname: `/admin/movie/${props.movie._id}`,
        state: props.movie,
      }}
    >
      <div className={classes.imageBox}>
        <img
          className={classes.image}
          src={`${key.BACKEND_URL}/public/images/${props.movie.image}`}
          alt="movieImage"
        />
      </div>
      <div className={classes.descriptionBox}>
        <span>{props.movie.movieTitle}</span>
        <span>{props.movie.totalVotes} votes</span>
        <span>{props.movie.rating} ratings</span>
        <span>
          rel Date -
          {
            new Date(props.movie.releaseDate)
              .toLocaleString(undefined, {
                timeZone: "Asia/Kolkata",
              })
              .split(",")[0]
          }
        </span>
      </div>
    </Link>
  );
};

function Body(props) {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("new");
  const [totalPage, setTotalPage] = useState(0);
  const [allMovies, setAllMovies] = useState([]);
  const [totalResult, setTotalResult] = useState(0);

  const fetchData = useCallback(async () => {
    console.log(props.type)
    const res = await fetch(
      `${key.BACKEND_URL}/api/v1/movies/getAllMovies?page=${page}&limit=${limit}&sort=${sortBy}&search=${props.searchKeyword}&type=${props.type}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res;
  }, [page, limit, sortBy, props.type , props.searchKeyword]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      let res = await fetchData();
      const response = JSON.parse(await res.text());

      if (res.ok) {
        setAllMovies(response.movies);
        setTotalPage(response.totalPage);
        setTotalResult(response.totalData);
        props.setDataLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);
  return (
    <>
      <div className={classes.body}>
        <div className={classes.cards}>
          {!props.dataLoaded && (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
          {props.dataLoaded && allMovies.length < 1 && (
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
              }}
            >
              <h1>No data available!</h1>
            </div>
          )}
          {props.dataLoaded &&
            allMovies.length > 0 &&
            allMovies.map((movie) => <MovieCard movie={movie} />)}
        </div>
        <div className={classes.pagination}>
          <Pagination
            count={totalPage}
            //   variant="outlined"
            color="primary"
            shape="rounded"
            siblingCount={0}
            onChange={(e, value) => {
              props.setDataLoaded(false);
              setPage(value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Body;
