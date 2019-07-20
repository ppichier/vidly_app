// const mongoose = require("mongoose");
// const asyncMiddleware = require("../middleware/async"); -> if require("express-async-errors") do not work (index.js)
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validate } = require("../models/genre");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The course with the given id was not found");
  res.send(genre);
  /* try {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
  } catch (err) {
    console.error(err.message);
    return res.status(404).send("The course with the given id was not found");
  } */
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      {
        new: true
      }
    );
    res.send(genre);
  } catch (err) {
    return res.status(404).send("The genre with the given id was not found");
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  /* try {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) {
      return res.status(404).send("The genre with the given id was not found");
    }
    res.send(genre);
  } catch (err) {
    return res.status(404).send("The genre with the given id was not found");
  } */

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) {
    return res.status(404).send("The genre with the given id was not found");
  }
  res.send(genre);
});

module.exports = router;
