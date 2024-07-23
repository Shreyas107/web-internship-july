const jwt = require("jsonwebtoken");
const config = require("./config");
const utils = require("./utils");

function verifyToken(req, res, next) {
  // Get token from headers
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(403)
      .json(utils.createErrorResponse("Token not provided"));
  }

  // Verify token
  jwt.verify(
    token.replace("Bearer ", ""),
    config.SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json(utils.createErrorResponse("Failed to authenticate token"));
      }
      req.decoded = decoded;
      next(); // Continue to the next middleware or route handler
    }
  );
}
module.exports = verifyToken;
