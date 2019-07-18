const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

//Joi schema -> what the client send us (the input of the API)
// vs mongoose Schema -> reprensentation of the model in the app
function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(255)
      .required(),
    numberInStock: Joi.number()
      .min(0)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .required(),
    genreId: Joi.objectId().required()
  };
  return Joi.validate(movie, schema);
}

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: 0,
    min: 0,
    max: 255
  },
  genre: {
    type: genreSchema,
    required: true
  }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports.Movie = Movie;
module.exports.validate = validateMovie;
