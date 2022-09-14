module.exports.throwErrorMessage = (err, res) => {
  console.log("ERROR = ", err);
  return res.status(500).json({
    status: false,
    message: "something went wrong! Please try again later",
  });
};
