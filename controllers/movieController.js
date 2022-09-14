const Movie = require("../models/MovieModel");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { throwErrorMessage } = require("../utils/errorHelper");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

exports.upload = multer({ storage: storage });

exports.addMovie = async (req, res) => {
  try {
    const {
      movieTitle,
      movieDescription,
      movieType,
      releaseDate,
      rating,
      totalVotes,
    } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(403).json({
        status: false,
        message: "Image required",
      });
    }

    const movie = await Movie.create({
      movieTitle,
      image: file.filename,
      movieDescription,
      movieType,
      releaseDate,
      rating,
      totalVotes,
    });
    res.status(201).json({
      status: true,
      message: "Movie Added!",
      movie,
    });
  } catch (err) {
    console.log(err);
    throwErrorMessage(err, res);
  }
};

exports.updateMovie = [
  body("movieId").not().isEmpty().withMessage("Movie Id is required"),
  body("movieTitle").not().isEmpty().withMessage("Movie Title is required"),
  body("movieDescription")
    .not()
    .isEmpty()
    .withMessage("Description is required"),
  body("movieType").not().isEmpty().withMessage("Movie Type is required"),
  body("releaseDate").not().isEmpty().withMessage("Release Date is required"),
  body("rating").not().isEmpty().withMessage("Rating is required"),
  body("totalVotes")
    .not()
    .isEmpty()
    .withMessage("Total Votes Field is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {
        movieId,
        movieTitle,
        movieDescription,
        movieType,
        releaseDate,
        rating,
        totalVotes,
      } = req.body;

      const file = req.file;
      if (!file) {
        return res.status(403).json({
          status: false,
          message: "Image required",
        });
      }

      const movie = await Movie.findOne({ _id: movieId });
      if (!movie) {
        return res.status(404).json({
          status: false,
          message: "Movie not Found!",
        });
      }
      movie.image = file.filename;
      movie.movieTitle = movieTitle;
      movie.movieDescription = movieDescription;
      movie.movieType = movieType;
      movie.releaseDate = releaseDate;
      movie.rating = rating;
      movie.totalVotes = totalVotes;

      await movie.save();

      res.status(200).json({
        status: true,
        message: "Movie Updated!",
        movie,
      });
    } catch (err) {
      throwErrorMessage(err, res);
    }
  },
];

exports.deleteMovie = [
  body("movieId").not().isEmpty().withMessage("Movie Id is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { movieId } = req.body;
      console.log(movieId);

      const movie = await Movie.findOne({ _id: movieId });
      if (!movie) {
        return res.status(404).json({
          status: false,
          message: "Movie not Found!",
        });
      }
      await movie.delete();

      res.status(409).json({
        status: true,
        message: "Movie Deleted!",
      });
    } catch (err) {
      throwErrorMessage(err, res);
    }
  },
];

exports.getAllMovies = async (req, res) => {
  try {
    if (req.query.limit > 100 || req.query.limit < 1) {
      return res.status(403).json({
        status: true,
        message: "Limit must be between 1-100",
      });
    }
    let page = parseInt(req.query.page ? req.query.page : 1);
    let limit = parseInt(req.query.limit ? req.query.limit : 10);
    let type = req.query.type;
    let search = req.query.search ? req.query.search : "";
    let sort = req.query.sort ? req.query.sort : "new";
    let skipValue = (page - 1) * limit;
    let sortBy = -1;
    if (sort === "old") sortBy = 1;

    let movies = [],
      count = 0;

    if (search && search.length > 0) {
      if (type === "all" || type === undefined) {
        movies = await Movie.find({
          movieTitle: { $regex: new RegExp(search, "i") },
        })
          .sort({ createdAt: sortBy })
          .skip(skipValue)
          .limit(limit);

        count = await Movie.find({
          movieTitle: { $regex: new RegExp(search, "i") },
        }).countDocuments();
      } else {
        movies = await Movie.find({
          $and: [
            { movieTitle: { $regex: new RegExp(search, "i") } },
            { movieType: type },
          ],
        })
          .sort({ createdAt: sortBy })
          .skip(skipValue)
          .limit(limit);

        count = await Movie.find({
          $and: [
            { movieTitle: { $regex: new RegExp(search, "i") } },
            { movieType: type },
          ],
        }).countDocuments();
      }
    } else {
      if (type === "all" || type === undefined) {
        movies = await Movie.find()
          .sort({ createdAt: sortBy })
          .skip(skipValue)
          .limit(limit);

        count = await Movie.find().countDocuments();
      } else {
        movies = await Movie.find({ movieType: type })
          .sort({ createdAt: sortBy })
          .skip(skipValue)
          .limit(limit);

        count = await Movie.find({ movieType: type }).countDocuments();
      }
    }

    res.status(200).json({
      status: true,
      totalData: count,
      totalPage: Math.ceil(count / limit),
      perPage: limit,
      currentPage: page,
      movies: movies,
    });
  } catch (err) {
    throwErrorMessage(err, res);
  }
};
