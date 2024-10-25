import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async (req, res, next) => {
  try {
    // Get token from headers or cookies
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authentication token is missing." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired token." });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export default protectRoute;
