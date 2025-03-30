import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token if prefixed with Bearer
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified; // Store user data in request
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Invalid or expired token.", error: error.message });
  }
};

export default authMiddleware;
