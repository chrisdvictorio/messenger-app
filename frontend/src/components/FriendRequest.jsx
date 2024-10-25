import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Tooltip } from "flowbite-react";

import { FaUserFriends } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { MdPersonSearch } from "react-icons/md";

import axiosInstance from "../api/axios";
import LoadingSpinner from "./LoadingSpinner";

const FriendRequest = ({
  handleRightComponentClick,
  handleSelectProfileClick,
}) => {
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });

  const { mutate: acceptFriendRequestMutation } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.post(
        `users/${userId}/friend-request/accept`
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

  const { mutate: declineFriendRequestMutation } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.delete(
        `users/${userId}/friend-request/decline`
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

  console.log(authUser);

  return (
    <div className="flex flex-col min-w-[30rem] p-3 border-l-2 border-black rounded-r-2xl space-y-4 bg-[#161A20]">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold ">Friend Requests</h2>
          <div className="flex gap-2">
            <Tooltip content="View Friends" placement="bottom">
              <button
                onClick={() => handleRightComponentClick("FriendsList")}
                className="flex items-center justify-center size-9 border-2 border-black  rounded-lg cursor-pointer hover:bg-[#0258BD]"
              >
                <FaUserFriends className="size-5" />
              </button>
            </Tooltip>
            <Tooltip content="Find Users" placement="bottom">
              <button
                onClick={() => handleRightComponentClick("FindUser")}
                className="flex items-center justify-center size-9 border-2 border-black  rounded-lg cursor-pointer hover:bg-[#0258BD]"
              >
                <MdPersonSearch className="size-6" />
              </button>
            </Tooltip>
          </div>
        </div>
        <p>
          {authUser.friendRequests.length} Friend Request
          {authUser.friendRequests.length > 1 ? "s" : ""}
        </p>
      </div>
      {isLoading ? (
        <div className="flex flex-1 justify-center">
          <LoadingSpinner text="Loading Friend Requests..." />
        </div>
      ) : (
        <div className="space-y-2">
          {authUser.friendRequests.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 rounded-lg cursor-pointer border-2 border-black bg-[#1E2630] hover:bg-[#0258BD]"
            >
              <div
                onClick={() => handleSelectProfileClick(user)}
                className="flex w-full gap-2"
              >
                <img
                  src={user.profilePicture}
                  className="size-12 rounded-lg object-cover border-2 border-black"
                />
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="font-light text-sm text-gray-400">
                    {user.bio.length > 44
                      ? `${user.bio.substring(0, 41)}...`
                      : user.bio}
                  </p>
                </div>
              </div>
              <div className="flex items gap-2">
                <button
                  onClick={() => acceptFriendRequestMutation(user._id)}
                  className="p-1 rounded-lg border-2 border-black bg-green-700 hover:bg-green-800"
                >
                  <IoCheckmark className="size-5" />
                </button>
                <button
                  onClick={() => declineFriendRequestMutation(user._id)}
                  className="p-1 rounded-lg border-2 border-black bg-red-700 hover:bg-red-800"
                >
                  <IoClose className="size-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
