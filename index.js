const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")(); // logging module first if error in the next 2 lines
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

app.get("/", (req, res) => {
  res.send("Hello world !");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}`)
);

module.exports = server;
