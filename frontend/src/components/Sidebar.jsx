import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Tooltip } from "flowbite-react";

import axiosInstance from "../api/axios";

import { IoChatbubble, IoLogOut } from "react-icons/io5";
import { FaUserGroup, FaBoxArchive } from "react-icons/fa6";

const Sidebar = ({
  sidebarCategory,
  handleSidebarCategoryClick,
  handleMainComponentClick,
}) => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  return (
    <div className="flex flex-col items-center w-20 p-3 justify-between border-r-2 border-black">
      <button
        onClick={() => handleMainComponentClick("EditProfile")}
        className="rounded-full"
      >
        <img
          src={authUser.profilePicture}
          className="size-12 rounded-full object-cover"
        />
      </button>
      <ul className="flex flex-col items-center px-2 py-6 gap-5 border-2 border-black rounded-full bg-[#161A20]">
        <Tooltip content="Chats" placement="right">
          <li
            onClick={() => handleSidebarCategoryClick("AllChats")}
            className={`flex items-center justify-center size-9 border-2 border-black rounded-lg cursor-pointer ${
              sidebarCategory === "AllChats" ? "bg-[#0258BD]" : "bg-[#1E2630]"
            } hover:bg-[#0258BD]`}
          >
            <IoChatbubble className="size-5" />
          </li>
        </Tooltip>
        <Tooltip content="Groups" placement="right">
          <li
            onClick={() => handleSidebarCategoryClick("GroupChats")}
            className={`flex items-center justify-center size-9 border-2 border-black rounded-lg cursor-pointer ${
              sidebarCategory === "GroupChats" ? "bg-[#0258BD]" : "bg-[#1E2630]"
            } hover:bg-[#0258BD]`}
          >
            <FaUserGroup className="size-5" />
          </li>
        </Tooltip>
        <Tooltip content="Images" placement="right">
          <li
            onClick={() => handleSidebarCategoryClick("ArchivedChats")}
            className={`flex items-center justify-center size-9 border-2 border-black rounded-lg cursor-pointer ${
              sidebarCategory === "ArchivedChats"
                ? "bg-[#0258BD]"
                : "bg-[#1E2630]"
            } hover:bg-[#0258BD]`}
          >
            <FaBoxArchive className="size-5" />
          </li>
        </Tooltip>
      </ul>
      <Tooltip content="Logout" placement="top">
        <button
          onClick={() => logoutMutation()}
          className="flex items-center justify-center size-12 rounded-full border-2 border-black hover:bg-[#0258BD]"
        >
          <IoLogOut className="size-7" />
        </button>
      </Tooltip>
    </div>
  );
};

export default Sidebar;
