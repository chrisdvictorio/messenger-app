import jwt from "jsonwebtoken";

const tokenAndCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Cookie can't be accessed via JavaScript (helps prevent XSS attacks)
    secure: process.env.NODE_ENV === "production", // Cookie is only sent over HTTPS in production
    sameSite: "strict", // Cookie is only sent in a first-party context
    maxAge: 86400000, // Cookie expiration in milliseconds (1 hour)
  });
};

export default tokenAndCookie;
