import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      "fullName username bio profilePicture"
    );

    if (!users) {
      return res.status(404).json({ error: "There are currently no users." });
    }

    const sortedUsers = users.sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in getAllUsers controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(
      "fullName friends friendRequests"
    );

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const getUserLastActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("lastActive");

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserProfile controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      bio,
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = req.body;

    let { profilePicture } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken." });
      }
    }

    if (email) {
      const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
      }
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists." });
      }
    }

    if (profilePicture) {
      if (user.profilePicture) {
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`messenger-app/users/${publicId}`);
          console.log("Image deleted from cloudinary");
        } catch (error) {
          console.error("Error deleting image from cloudinary:", error.message);
        }
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(
        profilePicture,
        { folder: "messenger-app/users" }
      );
      profilePicture = cloudinaryResponse.secure_url;
    }

    if (bio) {
      if (bio.length > 230) {
        return res
          .status(400)
          .json({ error: "Bio should not exceed 230 characters." });
      }
    }

    if (currentPassword) {
      if (!newPassword) {
        return res
          .status(400)
          .json({ error: "Please provide a new password." });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid current password." });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "New password must be atleast 6 characters long." });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "New password don't match." });
      }
    }

    if (!currentPassword && newPassword) {
      return res
        .status(400)
        .json({ error: "Please provide your current password first." });
    }

    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.profilePicture = profilePicture || user.profilePicture;
    user.bio = bio || user.bio;
    user.password = newPassword || user.password;

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error in updateProfile controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const userToAdd = await User.findById(id);

    if (!userToAdd || !user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    if (user._id.toString() === userToAdd._id.toString()) {
      return res.status(400).json({ error: "You can't add yourself." });
    }

    if (user.friends.includes(id)) {
      return res.status(200).json({
        message: `You're already friend with ${userToAdd.fullName}`,
      });
    }

    if (userToAdd.friendRequests.includes(userId)) {
      return res.status(200).json({
        message: "Pending friend request.",
      });
    }

    await User.findByIdAndUpdate(id, { $push: { friendRequests: userId } });

    res.status(200).json({ message: "Friend request sent." });
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const requestingUser = await User.findById(id);

    if (!requestingUser || !user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    const isAlreadyFriend = user.friends.includes(id);
    if (isAlreadyFriend) {
      return res.status(400).json({
        error: `You're already friends with ${requestingUser.fullName}`,
      });
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $push: { friends: id },
      }),
      User.findByIdAndUpdate(id, {
        $push: { friends: userId },
      }),
      User.findByIdAndUpdate(userId, {
        $pull: { friendRequests: id },
      }),
    ]);

    res.status(200).json({
      message: `You accepted ${requestingUser.fullName} friend request.`,
    });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const requestingUser = await User.findById(id);

    if (!requestingUser || !user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { friendRequests: id },
    });

    res.status(200).json({ message: "Friend request declined." });
  } catch (error) {
    console.error("Error in declineFriendRequest controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const sentRequestUser = await User.findById(id);

    if (!user || !sentRequestUser) {
      return res.status(404).json({ error: "User Not Found." });
    }

    await User.findByIdAndUpdate(sentRequestUser, {
      $pull: { friendRequests: userId },
    });

    res.status(200).json({ message: "Friend request cancelled." });
  } catch (error) {
    console.error("Error in cancelFriendRequest controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const isFriend = user.friends.includes(id);

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    if (!isFriend) {
      return res
        .status(400)
        .json({ error: "This user is not on your friend list." });
    }

    await Promise.all([
      User.findByIdAndUpdate(userId, { $pull: { friends: id } }),
      User.findByIdAndUpdate(id, { $pull: { friends: userId } }),
    ]);

    res.status(200).json({ message: "Friend removed successfully." });
  } catch (error) {
    console.error("Error in removeFriend controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};
