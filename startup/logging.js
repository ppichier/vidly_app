const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  //for caughting exception if it s outside the context of express (pipeline);
  /* process.on("uncaughtException", ex => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});
 */
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
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
  /* winston.add(
    new winston.transports.MongoDB({ db: "mongodb://localhost/vidly" })
  ); */
};
