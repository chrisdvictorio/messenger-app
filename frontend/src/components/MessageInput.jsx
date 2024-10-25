import React, { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EmojiPicker from "emoji-picker-react";
import { Tooltip, Button, Modal } from "flowbite-react";
import toast from "react-hot-toast";

import { FaImage, FaSpinner } from "react-icons/fa";
import { IoIosSend, IoMdSend } from "react-icons/io";
import { RiEmotionHappyFill } from "react-icons/ri";

import axiosInstance from "../api/axios";

const MessageInput = ({ selectedChat, selectedGroup }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const emojiPickerRef = useRef(null);
  const imageRef = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: sendMessageMutation, isPending: isSendingMessage } =
    useMutation({
      mutationFn: async (messageData) => {
        const res = await axiosInstance.post("/messages", messageData);
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allChats"] });
        queryClient.invalidateQueries({ queryKey: ["getAllMessages"] });
        setImageUrl("");
        setOpenModal(false);
        toast.success("Message Sent!");
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });

  const { mutate: sendGroupMessageMutation, isPending: isSendingGroupMessage } =
    useMutation({
      mutationFn: async (messageData) => {
        const res = await axiosInstance.post(
          `/messages/groups/${selectedGroup._id}/send`,
          messageData
        );
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["groupChats"] });
        queryClient.invalidateQueries({ queryKey: ["getAllGroupMessages"] });
        setImageUrl("");
        setOpenModal(false);
        toast.success("Message Sent!");
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result);
        setOpenModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedGroup) {
      sendGroupMessageMutation({ message, image: imageUrl });
    }

    if (selectedChat) {
      sendMessageMutation({
        message,
        image: imageUrl,
        receiverId: selectedChat.userId,
      });
    }

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center w-full p-3 gap-2 ">
        <Tooltip content="Attach Image">
          <button
            onClick={() => imageRef.current.click()}
            type="button"
            className="p-1 rounded-lg cursor-pointer hover:bg-[#0258BD]"
          >
            <FaImage className="size-6" />
          </button>
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={handleImageChange}
          />
        </Tooltip>

        <div>
          {" "}
          <Modal
            show={openModal}
            onClose={() => {
              setOpenModal(false);
              setImageUrl("");
            }}
          >
            <Modal.Header className="border-black bg-[#1E2630]">
              <p className="text-white">Preview Image</p>
            </Modal.Header>
            <Modal.Body className="border-black bg-[#161A20]">
              <img src={imageUrl} />
            </Modal.Body>
            <Modal.Footer className="flex justify-end border-black bg-[#1E2630]">
              <Button onClick={handleSubmit} className="bg-[#0258BD]">
                <div className="flex items-center gap-2">
                  {isSendingMessage || isSendingGroupMessage ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <p>Sending Image...</p>
                    </>
                  ) : (
                    <>
                      <p>Send Image</p>
                      <IoMdSend className="size-5" />
                    </>
                  )}
                </div>
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div className="relative w-full">
          <label htmlFor="message" className="sr-only"></label>
          <input
            id="message"
            type="text"
            placeholder="Type a message..."
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pl-4 py-2 rounded-full w-full font-light text-sm outline-none bg-[#29313A] border-black"
          />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            type="button"
          >
            <RiEmotionHappyFill className="absolute top-1/2 right-4 transform -translate-y-1/2 size-6 hover:text-[#0258BD]" />
          </button>

          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-12 right-4">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                emojiStyle="facebook"
                previewConfig={{ showPreview: false }}
                skinTonesDisabled
                width={350}
                height={300}
              />
            </div>
          )}
        </div>
        <Tooltip content="Send Message">
          <button type="submit" className="p-1 rounded-lg hover:bg-[#0258BD]">
            <IoIosSend className="size-7 " />
          </button>
        </Tooltip>
      </div>
    </form>
  );
};

export default MessageInput;
