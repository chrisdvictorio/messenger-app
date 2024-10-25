import React, { useState } from "react";

import { IoIosArrowBack } from "react-icons/io";
import { FaImage } from "react-icons/fa";

import useGroupStore from "../store/useGroupStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axios";
import toast from "react-hot-toast";

const GroupDetails = ({ handleRightComponentClick }) => {
  const [groupPicture, setGroupPicture] = useState("");
  const [groupName, setGroupName] = useState("");
  const { selectedGroup } = useGroupStore();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { data: allUsers } = useQuery({ queryKey: ["allUsers"] });

  const isAdmin = selectedGroup.groupAdmin === authUser._id;

  const { mutate: addGroupMemberMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(
        `/chats/groups/${selectedGroup._id}/add`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: removeGroupMemberMutation } = useMutation({
    mutationFn: async (memberId) => {
      const res = await axiosInstance.delete(
        `/chats/groups/${selectedGroup._id}/remove-member/${memberId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: leaveGroupMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.patch(
        `/chats/groups/${selectedGroup._id}/leave`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: deleteGroupChatMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(
        `/chats/groups/${selectedGroup._id}/delete`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: changeGroupNameMutation } = useMutation({
    mutationFn: async (groupName) => {
      const res = await axiosInstance.patch(
        `/chats/groups/${selectedGroup._id}`,
        groupName
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const { mutate: changeGroupPictureMutation } = useMutation({
    mutationFn: async (picture) => {
      const res = await axiosInstance.patch(
        `/chats/groups/${selectedGroup._id}/picture`,
        { groupPicture: picture }
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setGroupPicture(reader.result);
        changeGroupPictureMutation(reader.result);
      };
      reader.readAsDataURL(file); //base64 format
    }
  };

  const handleChangeNameSubmit = (e) => {
    e.preventDefault();
    changeGroupNameMutation({ groupName });
    setGroupName("");
  };

  return (
    <div className="flex flex-col min-w-[30rem] max-w-[30rem] p-3 border-l-2 border-black space-y-4 bg-[#161A20]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleRightComponentClick("FriendsList")}
          className="flex items-center justify-center p-1 rounded-full border-2 border-black bg-[#1E2630] hover:bg-[#0057BC]"
        >
          <IoIosArrowBack className="size-5" />
        </button>
        <h2 className="text-2xl font-bold ">Group Details</h2>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <form className="relative">
          <img
            src={groupPicture || selectedGroup.groupPicture}
            className="relative rounded-full size-56 border-2 border-black object-cover"
          />
          {isAdmin && (
            <>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="profilePicture"
                className="absolute bottom-5 right-5 flex items-center justify-center rounded-lg cursor-pointer bg-blue-700 size-8"
              >
                <FaImage className="size-5" />
              </label>
            </>
          )}
        </form>

        <p className="text-center text-lg font-medium">
          {selectedGroup.groupName}
        </p>
        <div className="px-10 space-y-4 w-full">
          {isAdmin && (
            <form
              onSubmit={handleChangeNameSubmit}
              className="flex flex-col gap-1 w-full"
            >
              <div className="flex items-center justify-between">
                <label htmlFor="groupName">Change Name: </label>
                <button
                  type="submit"
                  className="text-xs px-2 rounded-lg bg-green-700 hover:bg-green-800"
                >
                  Change Name
                </button>
              </div>
              <input
                id="groupName"
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="pl-3 py-1 rounded-lg font-light w-full bg-[#29313A] border-black "
              />
            </form>
          )}
          <p className="text-justify">Members:</p>
          <div className="p-3 rounded-lg border-2 space-y-2 bg-[#1E2630] border-black">
            <div className="space-y-2">
              {selectedGroup?.participants?.map((participant) => (
                <div
                  key={participant._id}
                  className="flex items-center justify-between py-1 px-2 rounded-lg border-2 border-black hover:bg-[#0258BD]"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={participant.profilePicture}
                      className="size-8 object-cover rounded-lg"
                    />
                    <p>{participant.fullName}</p>
                  </div>
                  {participant._id === selectedGroup.groupAdmin && (
                    <p className="text-xs">Admin</p>
                  )}
                  {isAdmin &&
                    !(participant._id === selectedGroup.groupAdmin) && (
                      <button
                        type="button"
                        onClick={() =>
                          removeGroupMemberMutation(participant._id)
                        }
                        className="px-2 py-1 rounded-lg text-xs bg-red-700 hover:bg-red-800"
                      >
                        Remove
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {isAdmin ? (
          <button
            onClick={() => deleteGroupChatMutation()}
            type="button"
            className="px-2 py-1 rounded-lg  bg-red-700 hover:bg-red-800"
          >
            Delete Group Chat
          </button>
        ) : (
          <button
            onClick={() => leaveGroupMutation()}
            className="px-2 py-1 rounded-lg  bg-red-700 hover:bg-red-800"
          >
            Leave Group Chat
          </button>
        )}
      </div>
    </div>
  );
};

export default GroupDetails;
