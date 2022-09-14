const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const movieRouter = require("./routes/movieRoutes");

mongoose
  .connect("mongodb://localhost:27017/movieflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Succesfully connected to database");
  })
  .catch((err) => {
    console.log("Could not connected to database", err);
    process.exit();
  });

var db = mongoose.connection;

db.on("error", console.log.bind(console, "connecton error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.static("public"));
app.use("/public/", express.static("public/"));

app.use("/api/v1/movies", movieRouter);

app.listen(8000, function () {
  console.log("Server listening at port 8000");
});

