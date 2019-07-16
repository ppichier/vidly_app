const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  //validate the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  /* rental = await rental.save();
  movie.numberInStock--;
  movie.save(); */

  //TRANSACTION  
  new Fawn.Task().save("rentals", rental);

  res.send(rental);
});

module.exports = router;
