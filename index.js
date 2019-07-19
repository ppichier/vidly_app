require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const app = express();

require("./startup/routes")(app);

//for caughting exception if it s outside the context of express (pipeline);
/* process.on("uncaughtException", ex => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});
 */
winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", ex => {
  throw ex;
});

//for caughting unhandled rejection (promises)
/* process.on("unhandledRejection", ex => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
}); */

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwt private key is not defibed");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB - vidly db ..."))
  .catch(err => console.error("Could not connect to MongoDB."));


app.get("/", (req, res) => {
  res.send("Hello world !");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
