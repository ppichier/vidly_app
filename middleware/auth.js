const config = require("config");
const jwt = require("jsonwebtoken");

//Implementing authorization
//401 (Unauthorized) if client does not send a valid token
//403 (forbidden) If valid token but not allowed to perform given operation
module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    // console.log("DECODED => ", decoded);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

// module.exports = auth
