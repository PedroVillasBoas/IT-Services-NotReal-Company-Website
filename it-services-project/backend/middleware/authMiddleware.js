const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;
  // Headers are in format: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Getting token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adding user's email (login) and ID to the request object
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ status: "error", message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ status: "error", message: "Not authorized, no token" });
  }
};

module.exports = { protect };
