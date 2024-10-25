import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "flowbite-react";

import { IoPersonAdd } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { MdPersonSearch } from "react-icons/md";

import LoadingSpinner from "./LoadingSpinner";

const FriendsList = ({
  handleRightComponentClick,
  handleSelectProfileClick,
}) => {
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="flex flex-col min-w-[30rem] p-3 border-l-2 rounded-r-2xl border-black space-y-4 bg-[#161A20]">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold ">View Friends</h2>
          <div className="flex gap-2">
            <Tooltip content="Friend Requests" placement="bottom">
              <button
                onClick={() => handleRightComponentClick("FriendRequest")}
                className="relative flex items-center justify-center size-9 border-2 border-black rounded-lg cursor-pointer hover:bg-[#0258BD]"
              >
                {authUser.friendRequests.length > 0 && (
                  <div className="absolute -right-1 -top-1 text-center text-xs font-bold text-black bg-blue-300 rounded-full size-4">
                    {authUser.friendRequests.length}
                  </div>
                )}
                <IoPersonAdd className="size-5" />
              </button>
            </Tooltip>
            <Tooltip content="Find Users" placement="bottom">
              <button
                onClick={() => handleRightComponentClick("FindUser")}
                className="flex items-center justify-center size-9 border-2 border-black rounded-lg cursor-pointer hover:bg-[#0258BD]"
              >
                <MdPersonSearch className="size-6 " />
              </button>
            </Tooltip>
          </div>
        </div>
        <p>
          {authUser.friends.length} Friend
          {authUser.friends.length > 1 ? "s" : ""} Online
        </p>
      </div>
      {isLoading ? (
        <div className="flex flex-1 justify-center">
          <LoadingSpinner text="Loading Friends..." />
        </div>
      ) : (
        <div className="space-y-2">
          {authUser.friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleSelectProfileClick(friend)}
              className="flex items-center justify-between p-2 rounded-full cursor-pointer border-2 border-black bg-[#1E2630] hover:bg-[#0258BD]"
            >
              <div className="flex w-full gap-2">
                <img
                  src={friend.profilePicture}
                  className="size-12 rounded-full object-cover border-2 border-black"
                />
                <div>
                  <p className="font-medium">{friend.fullName}</p>
                  <p className="font-light text-sm text-gray-400">
                    {friend.bio.length > 51
                      ? `${friend.bio.substring(0, 48)}...`
                      : friend.bio}
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-center p-2 rounded-full ">
                <BsThreeDots />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
