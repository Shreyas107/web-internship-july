const jwt = require("jsonwebtoken");
// const config = require("../config");

// Middleware for role authorization
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // Get the JWT token from the request header
    const token = req.headers.authorization.split(" ")[1];
    console.log("AR token ", token);

    try {
      // Decode the JWT token
      const decoded = jwt.verify(token, config.SECRET_KEY);
      console.log("AuthorizeRole decoded ", decoded);

      const userRole = decoded.role; // Assuming role is stored in the decoded token
      console.log("userRole ", userRole);

      // Check if the user's role is included in the allowed roles
      if (allowedRoles.includes(userRole)) {
        // User has the necessary role, allow access to the route
        next();
      } else {
        // User does not have the necessary role, return a 403 Forbidden error
        return res.status(403).json({ error: "Access forbidden" });
      }
    } catch (error) {
      // Handle token verification error (e.g., token expired, invalid token)
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = authorizeRole;
