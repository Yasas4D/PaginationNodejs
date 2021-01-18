const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./user");

mongoose.connect("mongodb://localhost/pagination", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0) return;
  Promise.all([
    User.create({ _id: 1, name: "User 1" }),
    User.create({ _id: 2, name: "User 2" }),
    User.create({ _id: 3, name: "User 3" }),
    User.create({ _id: 4, name: "User 4" }),
    User.create({ _id: 5, name: "User 5" }),
    User.create({ _id: 6, name: "User 6" }),
    User.create({ _id: 7, name: "User 7" }),
    User.create({ _id: 8, name: "User 8" }),
    User.create({ _id: 9, name: "User 9" }),
    User.create({ _id: 10, name: "User 10" }),
    User.create({ _id: 11, name: "User 11" }),
    User.create({ _id: 12, name: "User 12" }),
  ]).then(() => console.log("Added All Users"));
});

app.get("/users", paginatedResults(), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults() {
  return async (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skipIndex = (page - 1) * limit;
    const results = {};

    try {
      results.results = await User.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      next();
    } catch (e) {
      res
        .status(500)
        .json({ message: "Error Occured while fetching the data" });
    }
  };
}

console.log("Server Started!");
app.listen(3000);
