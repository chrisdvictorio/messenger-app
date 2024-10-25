import React from "react";
import { useQuery } from "@tanstack/react-query";

import useGroupStore from "../store/useGroupStore";
import useChatStore from "../store/useChatStore";

const Group = ({ group, handleMainComponentClick }) => {
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { setSelectedChat } = useChatStore();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const lastMessage = group.lastMessage;
  const isImage = !lastMessage.message;
  const myMessage = lastMessage.sender._id === authUser._id;
  const activeGroup = selectedGroup._id === group._id;

  const handleChatClick = () => {
    setSelectedGroup(group);
    setSelectedChat("");
    handleMainComponentClick("ChatWindow");
  };

  return (
    <button
      onClick={() => handleChatClick()}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer w-full hover:bg-[#0258BD] ${
        activeGroup && "bg-[#0258BD]"
      }`}
    >
      <div className="flex gap-2">
        <div className="relative">
          <img
            src={group.groupPicture}
            className="size-12 rounded-full object-cover border-2 border-black"
          />
        </div>

        <div className="flex flex-col justify-center text-start">
          <p className="font-medium">{group.groupName}</p>
          <p className="font-light text-xs text-gray-300">
            {!isImage && myMessage ? (
              <>
                You:{" "}
                {lastMessage.message.length > 30
                  ? `${lastMessage.message.substring(0, 30)}...`
                  : lastMessage.message}
              </>
            ) : (
              <>
                {lastMessage.message.length > 20
                  ? `${lastMessage.message.substring(0, 20)}...`
                  : lastMessage.message}
              </>
            )}
            {isImage && myMessage && <>You sent a photo.</>}
            {isImage && !myMessage && (
              <>{lastMessage.sender.fullName} sent a photo.</>
            )}
          </p>
        </div>
      </div>
    </button>
  );
};

export default Group;
