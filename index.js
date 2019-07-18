const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt private key is not defibed");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB - vidly db ..."))
  .catch(err => console.error("Could not connect to MongoDB."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.get("/", (req, res) => {
  res.send("Hello world !");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
