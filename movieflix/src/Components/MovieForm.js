import React, { useState } from "react";
import classes from "./MovieForm.module.css";
import key from "../utils/config";
import axios from "axios";

import { CircularProgress } from "@mui/material";
import Swal from "sweetalert2";

function MovieForm(props) {

  const [image, setImage] = useState();
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDescription, setMovieDescription] = useState("");
  const [rating, setRating] = useState();
  const [totalVotes, setTotalVotes] = useState();
  const [movieType, setMovieType] = useState("movie");
  const [releaseDate, setReleaseDate] = useState();
  const [requesting, setRequesting] = useState(false);

  const addMovie = async (e) => {
    e.preventDefault();
    setRequesting(true);

    try {
      console.log("first step");
      const formData = new FormData();
      formData.append("movieTitle", movieTitle);
      formData.append("movieDescription", movieDescription);
      formData.append("rating", rating);
      formData.append("totalVotes", totalVotes);
      formData.append("movieType", movieType);
      formData.append("releaseDate", releaseDate);
      console.log("image", image);

      formData.append("image", image);

      const response = await axios({
        method: "post",
        url: `${key.BACKEND_URL}/api/v1/movies/addMovie`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Movie Added",
          showConfirmButton: false,
          timer: 1500,
        });
        setImage(null);
        setMovieTitle("");
        setMovieDescription("");
        setRating();
        setTotalVotes();
        setMovieType("movie");
        setReleaseDate();
        setRequesting(false);
      }
    } catch (err) {
      setRequesting(false);
      let message = "Something went wrong! Please try again later.";
      if (err.response.data.message) message = err.response.data.message;

      Swal.fire(`FAIL`, message, "error");
    }
  };

  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  return (
    <div className={classes.formBox}>
      <form className={classes.form} onSubmit={addMovie}>
        <div className={classes.formInputs}>
          <div className={classes.formInput}>
            <label>Movie Poster</label>
            <input type="file" onChange={onFileChange} />
          </div>
          <div className={classes.formInput}>
            <label>Movie Title</label>
            <input
              type="text"
              onChange={(e) => setMovieTitle(e.target.value)}
              value={movieTitle}
              required
            />
          </div>
          <div className={classes.formInput}>
            <label>Movie Description</label>
            <textarea
              type="text"
              onChange={(e) => setMovieDescription(e.target.value)}
              value={movieDescription}
              required
            />
          </div>
          <div className={classes.formInput}>
            <label>Movie Rating</label>
            <input
              type="number"
              onChange={(e) => setRating(e.target.value)}
              value={rating}
              required
            />
          </div>
          <div className={classes.formInput}>
            <label>Total Votes</label>
            <input
              type="number"
              onChange={(e) => setTotalVotes(e.target.value)}
              value={totalVotes}
              required
            />
          </div>
          <div className={classes.formInput}>
            <label htmlFor="entries">Type</label>
            <select
              id="entries"
              value={movieType}
              onChange={(e) => {
                setMovieType(e.target.value);
              }}
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
              <option value="show">Show</option>
            </select>
          </div>
          <div className={classes.formInput}>
            <label>Release Date</label>
            <input
              type="date"
              onChange={(e) => setReleaseDate(e.target.value)}
              value={releaseDate}
              required
            />
          </div>
        </div>
        <div className={classes.formAction}>
          {requesting ? (
            <div className={classes.addBtn}>
              <CircularProgress />
            </div>
          ) : (
            <button className={classes.addBtn} type="submit" onClick={() => {}}>
              Add Movie
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default MovieForm;
