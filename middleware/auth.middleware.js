import jwt from "jsonwebtoken";

/* ---------------- AUTHENTICATION MIDDLEWARE ---------------- */
const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* ---------------- AUTHORIZATION (ROLE-BASED) MIDDLEWARE ---------------- */
const verifyRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (userRole !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied!",
      });
    }
    // only runs if user exists AND role matches
    next();
  };
};
export { authenticateJWT, verifyRole };
