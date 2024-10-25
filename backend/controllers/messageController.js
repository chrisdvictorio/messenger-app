import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [userId, id] },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat Not Found." });
    }

    const messages = await Message.find({
      chatId: chat._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getAllMessages controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const getAllUserImagesSent = async (req, res) => {
  try {
    const userId = req.user._id;

    const images = await Message.find({
      sender: userId,
      image: { $ne: "" },
    }).select("image");

    if (!images) {
      return res.status(200).json({ message: "No Images Sent." });
    }

    res.status(200).json(images);
  } catch (error) {
    console.error("Error in getAllUserImagesSent controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const getAllGroupMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "Group Chat Not Found." });
    }

    const messages = await Message.find({
      chatId: chat._id,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName profilePicture");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getAllGroupMessages controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    let { image } = req.body;
    const userId = req.user._id;

    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [userId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, receiverId],
        lastMessage: {
          message,
          sender: userId,
        },
      });
      await chat.save();
    }

    if (!image && !message) {
      return res.status(400).json({ error: "Type a message to send." });
    }

    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image);
      image = cloudinaryResponse.secure_url;
    }

    const newMessage = new Message({
      chatId: chat._id,
      sender: userId,
      message,
      image: image || "",
    });

    await Promise.all([
      newMessage.save(),
      chat.updateOne({ lastMessage: { message, sender: userId } }),
    ]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user._id;

    let { image } = req.body;

    const sender = await User.findById(userId).select(
      "fullName profilePicture"
    );
    if (!sender) {
      return res.status(404).json({ error: "Sender not found." });
    }

    let chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "Group Chat Not Found." });
    }

    if (!image && !message) {
      return res.status(400).json({ error: "Type a message to send." });
    }

    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image);
      image = cloudinaryResponse.secure_url;
    }

    const newMessage = new Message({
      chatId: chat._id,
      sender: userId,
      message,
      image: image || "",
    });

    await Promise.all([
      newMessage.save(),
      chat.updateOne({ lastMessage: { message, sender: sender } }),
    ]);

    const populatedMessage = await newMessage.populate(
      "sender",
      "fullName profilePicture"
    );

    io.to(chat._id.toString()).emit("newMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
