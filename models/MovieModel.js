const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    movieTitle: {
      type: String,
    },
    image: {
      type: String,
    },
    movieDescription: {
      type: String,
    },
    movieType: {
      type: String,
      enum: ["series", "movie", "show"],
    },
    releaseDate: {
      type: Date,
    },
    rating: {
      type: Number,
    },
    totalVotes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
