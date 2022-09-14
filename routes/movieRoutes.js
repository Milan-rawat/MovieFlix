const { Router } = require("express");
const movieController = require("../controllers/movieController");

const router = Router();

router.post(
  "/addMovie",
  movieController.upload.single("image"),
  movieController.addMovie
);
router.patch(
  "/updateMovie",
  movieController.upload.single("image"),
  movieController.updateMovie
);
router.delete("/deleteMovie", movieController.deleteMovie);
router.get("/getAllMovies", movieController.getAllMovies);

module.exports = router;
