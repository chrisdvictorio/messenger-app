import { create } from "zustand";

const useChatStore = create((set) => ({
  selectedChat: {
    _id: "",
    userId: "",
    fullName: "",
    profilePicture: "",
  },
  setSelectedChat: (selectedChat) => set({ selectedChat }),

  chats: [],
  setChats: (chats) => set({ chats }),
  updateChatMessage: (message) =>
    set((state) => {
      const updatedChats = state.chats.map((chat) => {
        if (chat._id === message.chatId) {
          return {
            ...chat,
            lastMessage: {
              message: message.message,
              sender: message.sender,
            },
          };
        }
        return chat;
      });
      return { chats: updatedChats };
    }),
}));

export default useChatStore;
