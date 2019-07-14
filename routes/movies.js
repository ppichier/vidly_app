const { Movie, validate } = require("../models/movie");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movie = await Movie.find().sort("title");
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
  } catch (err) {
    console.log(err.message);
    return res.status(404).send("The movie with the given id was not found");
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre.");

  let movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });
  movie = await movie.save();
  res.send(movie);
});

module.exports = router;
