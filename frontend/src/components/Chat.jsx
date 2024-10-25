import React from "react";
import { useQuery } from "@tanstack/react-query";

import { useSocketContext } from "../context/SocketContext";
import useChatStore from "../store/useChatStore";
import useGroupStore from "../store/useGroupStore";
import useProfileStore from "../store/useProfileStore";

const Chat = ({
  chat,
  handleMainComponentClick,
  handleRightComponentClick,
}) => {
  const { selectedChat, setSelectedChat } = useChatStore();
  const { setViewProfile } = useProfileStore();
  const { setSelectedGroup } = useGroupStore();
  const { onlineUsers } = useSocketContext();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const user = chat.participants[0];
  const lastMessage = chat.lastMessage;
  const myMessage = lastMessage.sender._id === authUser._id;
  const activeChat = selectedChat.userId === user._id;
  const isOnline = onlineUsers.includes(user._id);

  const handleChatClick = () => {
    setSelectedChat({
      _id: chat._id,
      userId: user._id,
      profilePicture: user.profilePicture,
      fullName: user.fullName,
    });
    setViewProfile({
      _id: user._id,
      profilePicture: user.profilePicture,
      fullName: user.fullName,
      bio: user.bio,
    });
    setSelectedGroup("");
    handleMainComponentClick("ChatWindow");
    handleRightComponentClick("FriendsList");
  };

  return (
    <button
      onClick={() => handleChatClick()}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer w-full hover:bg-[#0258BD] ${
        activeChat && "bg-[#0258BD]"
      }`}
    >
      <div className="flex gap-2">
        <div className="relative">
          <img
            src={user.profilePicture}
            className="size-12 rounded-full object-cover border-2 border-black"
          />
          {isOnline && (
            <div className="absolute bottom-1 right-1  border-2 border-black rounded-full size-3 bg-green-400 "></div>
          )}
        </div>

        <div className="flex flex-col justify-center text-start">
          <p className="font-medium">{user.fullName}</p>
          <p className="font-light text-xs text-gray-300">
            {lastMessage.message && myMessage ? (
              <>
                You:{" "}
                {lastMessage.message.length > 30
                  ? `${lastMessage.message.substring(0, 30)}...`
                  : lastMessage.message}
              </>
            ) : (
              <>
                {lastMessage.message.length > 30
                  ? `${lastMessage.message.substring(0, 30)}...`
                  : lastMessage.message}
              </>
            )}
            {!lastMessage.message && myMessage && <>You sent a photo.</>}
            {!lastMessage.message && !myMessage && (
              <>{lastMessage.sender.fullName} sent a photo.</>
            )}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Chat;
