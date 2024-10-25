import Chat from "../models/chatModel.js";
import Message from "../models/messageModel.js";

export const getAllChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({
      participants: userId,
      isGroup: false,
    })
      .populate({
        path: "participants",
        select: "fullName profilePicture bio",
      })
      .populate({
        path: "lastMessage.sender",
        select: "fullName profilePicture",
      });

    chats.forEach((chat) => {
      chat.participants = chat.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getAllChat controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groupChats = await Chat.find({
      participants: userId,
      isGroup: true,
    })
      .populate({
        path: "participants",
        select: "fullName profilePicture",
      })
      .populate({
        path: "lastMessage.sender",
        select: "fullName profilePicture",
      });

    res.status(200).json(groupChats);
  } catch (error) {
    console.error("Error in getAllGroups controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const createGroup = async (req, res) => {
  try {
    const userId = req.user._id;

    const { participants, groupName, groupPicture, groupAdmin, message } =
      req.body;

    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }

    if (participants.length < 2) {
      return res
        .status(400)
        .json({ error: "2 participants is required to create a group chat." });
    }

    if (!message) {
      return res.status(400).json({ error: "Type a message to send." });
    }

    if (participants._id === userId) {
      return res
        .status(400)
        .json({ error: "You are default a member of the group." });
    }

    const chat = new Chat({
      participants: [userId, ...participants],
      lastMessage: {
        message,
        sender: userId,
      },
      groupName,
      groupPicture,
      groupAdmin: userId,
      isGroup: true,
    });

    await chat.save();

    const newMessage = new Message({
      chatId: chat._id,
      sender: userId,
      message,
      image: "",
    });

    await Promise.all([
      newMessage.save(),
      chat.updateOne({ lastMessage: { message, sender: userId } }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in createGroup controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const changeGroupName = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName } = req.body;

    const chat = await Chat.findById(id).select("groupName");

    if (!chat) {
      return res.status(404).json({ error: "No Chat Found." });
    }

    if (!groupName) {
      return res.status(404).json({ error: "Group name can't be empty." });
    }

    chat.groupName = groupName;

    await chat.save();

    res.status(200).json({ message: "Group name updated successfully!" });
  } catch (error) {
    console.error("Error in changeGroupName controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const changeGroupPicture = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupPicture } = req.body;

    const chat = await Chat.findById(id).select("groupPicture");

    if (!chat) {
      return res.status(404).json({ error: "No Chat Found." });
    }

    chat.groupPicture = groupPicture;

    await chat.save();

    res.status(200).json({ message: "Group picture updated successfully!" });
  } catch (error) {
    console.error("Error in changeGroupPicture controller:", error.message);
    res.status(500).json({ error: " Internal Server Error." });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "No Chat Found." });
    }

    chat.participants = chat.participants.filter(
      (participant) => participant.toString() !== userId.toString()
    );

    if (chat.participants.length < 3) {
      await Chat.findByIdAndDelete(id);
      return res.status(200).json({ message: "Group deleted successfully!" });
    }

    await chat.save();

    res.status(200).json({ message: "You have left the group." });
  } catch (error) {
    console.error("Error in leaveGroup controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { userIdToRemove, chatId } = req.params;

    const chat = await Chat.findById(chatId).select("participants");

    if (!chat) {
      return res.status(404).json({ error: "No Chat Found." });
    }

    if (!chat.participants.includes(userIdToRemove)) {
      return res.status(400).json({ error: "User not a participant." });
    }

    if (chat.participants.length < 3) {
      await Chat.findByIdAndDelete(chatId);
      return res.status(200).json({ message: "Group deleted successfully!" });
    }

    chat.participants = chat.participants.filter(
      (participant) => participant.toString() !== userIdToRemove.toString()
    );

    await chat.save();

    res.status(200).json({ message: "Member removed successfully." });
  } catch (error) {
    console.error("Error in removeGroupMember controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};

export const deleteGroupChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "No Chat Found." });
    }

    await Chat.findByIdAndDelete(id);

    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    console.error("Error in deleteGroupChat controller:", error.message);
    res.status(500).json({ error: "Internal Server Error." });
  }
};
