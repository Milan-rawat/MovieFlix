import React, { useState, useEffect, useCallback } from "react";
import classes from "./Table.module.css";
import key from "../utils/config";
import axios from "axios";

import {
  CircularProgress,
  IconButton,
  Pagination,
  Tooltip,
} from "@mui/material";
import ConfirmAlert from "../utils/ConfirmAlert/ConfirmAlert";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Table() {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("new");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalPage, setTotalPage] = useState(0);
  const [allMovies, setAllMovies] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [totalResult, setTotalResult] = useState(0);

  const fetchData = useCallback(async () => {
    const res = await fetch(
      `${key.BACKEND_URL}/api/v1/movies/getAllMovies?page=${page}&limit=${limit}&sort=${sortBy}&search=${searchKeyword}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res;
  }, [page, limit, sortBy, searchKeyword]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      let res = await fetchData();
      const response = JSON.parse(await res.text());

      if (res.ok) {
        setAllMovies(response.movies);
        setTotalPage(response.totalPage);
        setTotalResult(response.totalData);
        setDataLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchData]);

  const deleteMovie = async (movieId) => {
    console.log("deleting...");
    try {
      const res = await fetch(
        `${key.BACKEND_URL}/api/v1/movies/deleteMovie?movieId=${movieId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieId: movieId,
          }),
        }
      );
      console.log(movieId);

      // const formData = new FormData();
      // formData.append("movieId", movieId);

      // const response = await axios({
      //   method: "delete",
      //   url: `${key.BACKEND_URL}/api/v1/movies/deleteMovie?movieId=${movieId}`,
      //   data: formData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      const response = JSON.parse(await res.text());
      console.log(response);

      if (response && response.status) {
        let updatedMovies = allMovies.filter((movie) => movie._id !== movieId);
        setTotalResult(totalResult - 1);
        setAllMovies(updatedMovies);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Movie Deleted",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        console.log(response);
        Swal.fire(
          `FAIL`,
          `Something went wrong! Please try again later.`,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      Swal.fire(
        `FAIL`,
        `Something went wrong! Please try again later.`,
        "error"
      );
    }
  };

  return (
    <div className={classes.tableBox}>
      <div className={classes.tableHeader}>
        <div style={{ display: "flex" }}>
          <div className={classes.entries}>
            <label htmlFor="entries">Show Entries</label>
            <select
              id="entries"
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
                setPage(1);
                setDataLoaded(false);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className={classes.sortBy}>
            <label htmlFor="sort">Sort By</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setDataLoaded(false);
              }}
            >
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>
          </div>
          <div className={classes.entries}>
            <b>Total Movies: {totalResult}</b>
          </div>
        </div>
        <div className={classes.searchUser}>
          <input
            type="text"
            placeholder="Search..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setDataLoaded(false);
            }}
          />
        </div>
        <Link to={"/admin/addMovie"} className={classes.newMovie}>
          Add New Movie
        </Link>
      </div>
      <div className={classes.movieTable}>
        {!dataLoaded && <CircularProgress />}
        {dataLoaded && allMovies.length < 1 && <h1>No data available!</h1>}
        {dataLoaded && allMovies.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Image</th>
                <th>Movie Title</th>
                <th>Description</th>
                <th>Type</th>
                <th>rating</th>
                <th>Total Votes</th>
                <th>Release Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dataLoaded &&
                allMovies.map((movie, i) => (
                  <tr key={i}>
                    <td>{(page - 1) * limit + i + 1}</td>
                    <td>
                      <img
                        className={classes.moviePoster}
                        src={`${key.BACKEND_URL}/public/images/${movie.image}`}
                        alt="movieImage"
                      />
                    </td>
                    <td>{movie.movieTitle}</td>
                    <td>{movie.movieDescription}</td>
                    <td>{movie.movieType}</td>
                    <td>{movie.rating}</td>
                    <td>{movie.totalVotes}</td>
                    <td>
                      {
                        new Date(movie.releaseDate)
                          .toLocaleString(undefined, {
                            timeZone: "Asia/Kolkata",
                          })
                          .split(",")[0]
                      }
                    </td>
                    <td>
                      <div className={classes.actions}>
                        <Tooltip title="Update movie">
                          <Link
                            to={{
                                pathname: `/admin/movie/edit/${movie._id}`,
                                state: movie
                            }}
                          >
                            <IconButton>
                              <EditRoundedIcon />
                            </IconButton>
                          </Link>
                        </Tooltip>

                        <ConfirmAlert
                          msg={`Are you sure you want delete ${
                            movie.movietitle ? movie.movietitle : ""
                          }`}
                          onClickEvent={() => deleteMovie(movie._id)}
                        >
                          <Tooltip title="Delete Movie">
                            <IconButton>
                              <DeleteRoundedIcon />
                            </IconButton>
                          </Tooltip>
                        </ConfirmAlert>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className={classes.pagination}>
        <Pagination
          count={totalPage}
          variant="outlined"
          color="secondary"
          siblingCount={0}
          onChange={(e, value) => {
            setDataLoaded(false);
            setPage(value);
          }}
        />
      </div>
    </div>
  );
}

export default Table;
