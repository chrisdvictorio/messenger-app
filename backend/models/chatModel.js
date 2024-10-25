import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      message: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function () {
        return this.isGroup;
      },
      default: null,
    },
    groupPicture: {
      type: String,
      required: function () {
        return this.isGroup;
      },
      default: null,
    },
    groupAdmin: {
      type: String,
      required: function () {
        return this.isGroup;
      },
      default: null,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
