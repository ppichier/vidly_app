const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
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

  try {
    const genre = await Genre.findById(req.body.genreId);
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
  } catch (err) {
    return res.status(400).send("Invalid Genre.");
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const genre = await Genre.findById(req.body.genreId);
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
          _id: genre._id,
          name: genre.name
        }
      },
      {
        new: true
      }
    );
    res.send(movie);
  } catch (err) {
    console.error(err.message);
    return res.status(404);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
      return res.status(404).send("The movie with the given id was not found");
    res.send(movie);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
