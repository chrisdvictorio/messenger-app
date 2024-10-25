import User from "../models/userModel.js";
import tokenAndCookie from "../lib/tokenAndCookie.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password, confirmPassword } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken." });
    }

    const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be atleast 6 characters long." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password don't match." });
    }
    const defaultProfile =
      "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

    const newUser = new User({
      fullName,
      username,
      email,
      password,
      profilePicture: defaultProfile,
    });

    await newUser.save();

    tokenAndCookie(newUser._id, res);

    res.status(201).json({
      message: "Account created successfully!",
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      profilePicture: defaultProfile,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordValid = user && (await user.comparePassword(password));

    if (!user || !isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    tokenAndCookie(user._id, res);

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({ path: "friends", select: "profilePicture fullName bio" })
      .populate({
        path: "friendRequests",
        select: "profilePicture fullName bio",
      });

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
