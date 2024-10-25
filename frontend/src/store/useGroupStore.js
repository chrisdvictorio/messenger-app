import { create } from "zustand";

const useGroupStore = create((set) => ({
  selectedGroup: {
    _id: "",
    groupName: "",
    groupPicture: "",
    participants: [],
  },
  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  groups: [],
  setGroups: (groups) => set({ groups }),
  updateGroupChatMessage: (message) =>
    set((state) => {
      const updatedGroupChats = state.groups.map((group) => {
        if (group._id === message.chatId) {
          return {
            ...group,
            lastMessage: {
              message: message.message,
              sender: {
                _id: message.sender._id,
                fullName: message.sender.fullName,
                profilePicture: message.sender.profilePicture,
              },
            },
          };
        }
        return group;
      });
      return { groups: updatedGroupChats };
    }),
}));

export default useGroupStore;
