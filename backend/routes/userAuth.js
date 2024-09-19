const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    
    // Check if authorization header is present
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header required" });
    }

    const token = authHeader.split(" ")[1];  // Bearer token

    if (!token) {
        return res.status(401).json({ message: "Authentication token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, data) => {
        if (err) {
            console.error("JWT verification error:", err); // Log the error for debugging purposes
            return res.status(401).json({ message: "Invalid token, please sign in again" });
        }
        req.data = data; // Attach decoded data to request
        next(); // Pass control to the next middleware/handler
    });
};

module.exports = { authenticateToken };
