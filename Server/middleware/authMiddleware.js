const jwt = require("jsonwebtoken");
import dotenv from "dotenv"
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Extract the JWT token from the header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "rajesh123456789", (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("JWT Token:", token); // Log the JWT token
    req.user = user; // Add the user info to the request object
    next();
  });
};

module.exports = authenticateToken;
