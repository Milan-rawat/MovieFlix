import React from "react";
import classes from "./MovieDetail.module.css";
import key from "../utils/config";

import { useLocation, useHistory } from "react-router-dom";

function MovieDetail() {
  const location = useLocation();
  const movie = location.state;
  const history = useHistory();
  console.log(movie);
  return (
    <div className={classes.detailsPage}>
      <div className={classes.header}>
        <div className={classes.btn} onClick={() => history.goBack()}>
          🔙
        </div>
      </div>
      <div className={classes.bodyPart}>
        <div className={classes.imageContainer}>
          <img
            className={classes.image}
            src={`${key.BACKEND_URL}/public/images/${movie.image}`}
            alt="movieImage"
          />
        </div>
        <div className={classes.detailsContainer}>
          <div className={classes.title}>{movie.movieTitle}</div>
          <div className={classes.desc}>
            ⭐Rating - {movie.rating} ({movie.totalVotes} votes)
          </div>
          <div className={classes.desc}>Type - {movie.movieType}</div>
          <div className={classes.desc}>
            Release Date -
            {
              new Date(movie.releaseDate)
                .toLocaleString(undefined, {
                  timeZone: "Asia/Kolkata",
                })
                .split(",")[0]
            }
          </div>
          <div className={classes.desc}>{movie.movieDescription}</div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
