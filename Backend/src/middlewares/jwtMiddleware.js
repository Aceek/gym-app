import jwt from "jsonwebtoken";

const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token is missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default jwtMiddleware;
