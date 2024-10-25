import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Message = ({ message, selectedChat }) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const myMessage = message.sender === authUser._id;

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };
  return (
    <div className={`flex  ${myMessage && "justify-end"}  p-3 `}>
      <div className="flex items-center justify-center gap-4">
        {myMessage ? (
          <>
            {message.message && (
              <div className="flex relative px-1 rounded-2xl bg-[#0258BD]">
                <p className="p-2 text-sm max-w-[35rem] break-words">
                  {message.message}
                </p>
                <p className="absolute -right-4 -bottom-4 px-3 text-xs min-w-20 text-[#667085] ">
                  {new Date(message.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
            {message.image && loadingImage && (
              <div className="p-2 rounded-xl bg-[#161A20]">
                <img
                  src={message.image}
                  hidden
                  onLoad={() => setLoadingImage(false)}
                  className="w-96 object-cover rounded-lg  "
                />
                <p className="text-center h-96 w-96">Loading Image...</p>
              </div>
            )}
            {message.image && !loadingImage && (
              <div className="p-2 rounded-xl bg-[#161A20]">
                <img
                  onClick={() => handleImageClick(message.image)}
                  src={message.image}
                  className="w-96 object-cover rounded-lg cursor-pointer"
                />
              </div>
            )}
            <img
              src={authUser.profilePicture}
              className="size-12 rounded-full object-cover border-2 border-black"
            />
          </>
        ) : (
          <>
            <img
              src={selectedChat.profilePicture}
              className="size-12 rounded-full border-2 border-black object-cover"
            />
            {message.message && (
              <div className="flex relative px-1 rounded-2xl bg-[#161A20]">
                <p className="p-2 text-sm max-w-[35rem] break-words">
                  {message.message}
                </p>
                <p className="absolute -left-2 -bottom-4 px-3 text-xs min-w-20 text-[#667085]">
                  {new Date(message.createdAt).toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
              </div>
            )}
            {message.image && loadingImage && (
              <div className="p-2 rounded-xl bg-[#161A20]">
                <img
                  src={message.image}
                  hidden
                  onLoad={() => setLoadingImage(false)}
                  className="w-96 object-cover rounded-lg  "
                />
                <p className="text-center h-96 w-96">Loading Image...</p>
              </div>
            )}
            {message.image && !loadingImage && (
              <div className="p-2 rounded-xl bg-[#161A20]">
                <img
                  onClick={() => handleImageClick(message.image)}
                  src={message.image}
                  className="w-96 object-cover rounded-lg cursor-pointer"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Message;
