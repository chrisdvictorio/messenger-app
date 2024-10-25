import React from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IoIosArrowBack, IoMdPersonAdd, IoMdClose } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { TbUserCancel } from "react-icons/tb";

import axiosInstance from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";
import useProfileStore from "../store/useProfileStore";
import useChatStore from "../store/useChatStore";
import useGroupStore from "../store/useGroupStore";

const ProfileDetails = ({
  handleMainComponentClick,
  handleRightComponentClick,
}) => {
  const { chats, setSelectedChat } = useChatStore();
  const { setSelectedGroup } = useGroupStore();
  const { selectedProfile } = useProfileStore();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfile", selectedProfile._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${selectedProfile._id}`);
      return res.data;
    },
  });

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `/users/${selectedProfile._id}/friend-request`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: cancelFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `users/${userProfile._id}/friend-request/cancel`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(
        `users/${userProfile._id}/friend-request/accept`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: removeFriendMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `users/friends/${userProfile._id}/remove`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const handleChatClick = () => {
    const existingChat = chats.find((chat) =>
      chat.participants.some(
        (participant) => participant._id === selectedProfile._id
      )
    );
    if (existingChat) {
      setSelectedChat({
        _id: existingChat._id,
        userId: selectedProfile._id,
        profilePicture: selectedProfile.profilePicture,
        fullName: selectedProfile.fullName,
      });
    } else {
      setSelectedChat({
        userId: selectedProfile._id,
        profilePicture: selectedProfile.profilePicture,
        fullName: selectedProfile.fullName,
      });
    }
    setSelectedGroup("");
    handleMainComponentClick("ChatWindow");
  };

  const myProfile = selectedProfile._id === authUser._id;
  const isPending = userProfile?.friendRequests.includes(authUser._id);
  const isOnFriendRequest = authUser.friendRequests.some(
    (user) => user._id === userProfile?._id
  );
  const isFriend = authUser.friends.some(
    (friend) => friend._id === userProfile?._id
  );

  const notFriend = !isFriend && !isPending && !isOnFriendRequest && !myProfile;

  return (
    <div className="flex flex-col min-w-[30rem] max-w-[30rem] p-3 border-l-2 border-black space-y-4 bg-[#161A20]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleRightComponentClick("FriendsList")}
          className="flex items-center justify-center p-1 rounded-full border-2 border-black bg-[#1E2630] hover:bg-[#0057BC]"
        >
          <IoIosArrowBack className="size-5" />
        </button>
        <h2 className="text-2xl font-bold ">Profile Details</h2>
      </div>
      {isLoading ? (
        <div className="flex flex-1 justify-center">
          <LoadingSpinner text="Loading Profile..." />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src={selectedProfile.profilePicture}
            className="rounded-full object-cover size-48 border-2 border-black"
          />
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium">{selectedProfile.fullName}</p>
          </div>
          <div className="px-10 space-y-4 w-full">
            <div className="p-3 rounded-lg border-2 border-black bg-[#1E2630]">
              <p className="text-justify text-sm">{selectedProfile.bio}</p>
            </div>
            <div className="flex items-center justify-center gap-8">
              {isFriend && (
                <button
                  onClick={() => removeFriendMutation()}
                  className="w-full py-1 rounded-md bg-red-700 hover:bg-red-800"
                >
                  <div className="flex items-center justify-center gap-2">
                    <IoMdClose className="size-5" />
                    <p>Remove Friend</p>
                  </div>
                </button>
              )}

              {notFriend && (
                <button
                  onClick={() => sendFriendRequestMutation()}
                  className="w-full py-1 rounded-md bg-green-700 hover:bg-green-800"
                >
                  <div className="flex items-center justify-center gap-2">
                    <IoMdPersonAdd className="size-5" />
                    <p>Add Friend</p>
                  </div>
                </button>
              )}

              {isPending && (
                <button
                  onClick={() => cancelFriendRequestMutation()}
                  className="w-full py-1 rounded-md bg-red-700 hover:bg-red-800"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbUserCancel className="size-5" />
                    <p>Cancel Request</p>
                  </div>
                </button>
              )}

              {isOnFriendRequest && (
                <button
                  onClick={() => acceptFriendRequestMutation()}
                  className="w-full py-1 rounded-md bg-green-700 hover:bg-green-800"
                >
                  <div className="flex items-center justify-center gap-2">
                    <TbUserCancel className="size-5" />
                    <p>Confirm</p>
                  </div>
                </button>
              )}

              {myProfile && (
                <button
                  onClick={() => handleMainComponentClick("EditProfile")}
                  className="w-full py-1 rounded-md bg-[#0258BD] hover:bg-blue-600"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaEdit className="size-4" />
                    <p>Edit Your Profile</p>
                  </div>
                </button>
              )}

              {!myProfile && (
                <button
                  onClick={() => handleChatClick()}
                  className="w-full py-1 rounded-md bg-[#0258BD] hover:bg-blue-600"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaMessage className="size-4" />
                    <p>Message</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
