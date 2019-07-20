const Joi = require("joi");
const mongoose = require("mongoose");

function validateGenre(course) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(course, schema);
}

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Genre = mongoose.model("Genre", genreSchema);

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;
