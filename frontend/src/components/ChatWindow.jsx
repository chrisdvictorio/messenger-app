import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { BsThreeDots } from "react-icons/bs";

import axiosInstance from "../api/axios";
import useChatStore from "../store/useChatStore";
import useProfileStore from "../store/useProfileStore";
import useGroupStore from "../store/useGroupStore";
import MessageInput from "./MessageInput";
import Message from "./Message";
import GroupMessage from "./GroupMessage";
import LoadingSpinner from "./LoadingSpinner";
import { useSocketContext } from "../context/SocketContext";

const ChatWindow = ({
  handleRightComponentClick,
  handleSelectProfileClick,
}) => {
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const { selectedGroup, updateGroupChatMessage } = useGroupStore();
  const { viewProfile } = useProfileStore();
  const { updateChatMessage, selectedChat } = useChatStore();
  const { socket } = useSocketContext();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: getAllMessages } = useQuery({
    queryKey: ["getAllMessages", selectedChat.userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/messages/${selectedChat.userId}`);
      setMessages(res.data);
      return res.data;
    },
    enabled: !!selectedChat,
  });

  const { data: getAllGroupMessages } = useQuery({
    queryKey: ["getAllGroupMessages", selectedGroup._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/messages/groups/${selectedGroup._id}`
      );
      setGroupMessages(res.data);
      return res.data;
    },
    enabled: !!selectedGroup,
  });

  const { data: userLastActive } = useQuery({
    queryKey: ["userLastActive", viewProfile?._id],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/users/last-active/${viewProfile._id}`
      );
      return res.data;
    },
    enabled: !!viewProfile && !selectedGroup?._id,
  });

  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages, groupMessages]);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedChat._id === message.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      updateChatMessage(message);
    });

    if (selectedGroup) {
      socket.emit("joinRoom", selectedGroup._id);

      socket.on("newMessage", (message) => {
        if (selectedGroup && selectedGroup._id === message.chatId) {
          setGroupMessages((prevMessages) => [...prevMessages, message]);
        }

        updateGroupChatMessage(message);
      });
    }

    return () => socket.off("newMessage");
  }, [socket, selectedChat, selectedGroup]);

  const filterMessages = messages.filter(
    (message) => message.chatId === selectedChat._id
  );

  const formatTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Active Now";
    } else if (diffInSeconds < 3600) {
      return `Last Active: ${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `Last Active: ${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `Last Active: ${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  const handleViewDetailsClick = () => {
    if (selectedChat) {
      handleSelectProfileClick(viewProfile);
    }

    if (selectedGroup) {
      handleRightComponentClick("GroupDetails");
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between shadow-md p-3">
        <div className="flex gap-2">
          <img
            src={selectedChat.profilePicture || selectedGroup.groupPicture}
            className="size-12 rounded-full object-cover border-2 border-black"
          />
          <div>
            <p className="font-medium">
              {selectedChat.fullName || selectedGroup.groupName}
            </p>
            <p className="font-light text-sm text-gray-400">
              {" "}
              {selectedChat &&
                userLastActive &&
                formatTime(new Date(userLastActive.lastActive))}
              {selectedGroup && `${selectedGroup.participants.length} members`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleViewDetailsClick()}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-[#0258BD]"
          >
            <BsThreeDots className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-end h-[47.9rem]">
        <div
          className="scrollbar-thin scrollbar-thumb-[#161A20] scrollbar-track-[#1E2630] overflow-y-auto space-y-2"
          ref={messageContainerRef}
        >
          {selectedChat && (
            <>
              {filterMessages.map((message) => (
                <Message
                  key={message._id}
                  message={message}
                  selectedChat={selectedChat}
                />
              ))}
            </>
          )}
          {selectedGroup && (
            <>
              {groupMessages.map((groupMessage) => (
                <GroupMessage
                  key={groupMessage._id}
                  groupMessage={groupMessage}
                  selectedGroup={selectedGroup}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <MessageInput selectedChat={selectedChat} selectedGroup={selectedGroup} />
    </div>
  );
};

export default ChatWindow;
