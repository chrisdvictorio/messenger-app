import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "flowbite-react";

import { MdGroups } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoAddCircleSharp } from "react-icons/io5";

import axiosInstance from "../api/axios";
import Group from "./Group";
import useGroupStore from "../store/useGroupStore";

const GroupChats = ({ handleMainComponentClick }) => {
  const [search, setSearch] = useState("");
  const { groups, setGroups } = useGroupStore();

  const { data: allGroupChats } = useQuery({
    queryKey: ["allGroupChats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chats/groups");
      setGroups(res.data);
      return res.data;
    },
  });

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-96 min-w-96 p-3 space-y-4 border-r-2 border-black bg-[#161A20]">
      <h2 className="text-2xl font-bold ">Messages</h2>
      <div className="relative flex items-center">
        <IoIosSearch className="absolute left-3 size-5 text-[#65676B]" />
        <label htmlFor="searchGroup" className="sr-only"></label>
        <input
          id="searchGroup"
          type="text"
          placeholder="Search Group"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 py-1 rounded-full w-full font-light bg-[#29313A] border-black "
        />
      </div>
      <div className="flex items-center justify-between text-[#0099FF]">
        <div className="flex items-center gap-2">
          <MdGroups className="size-5" />
          <h3 className="font-semibold">Group Chats</h3>
        </div>
        <div>
          <Tooltip content="Create Group">
            <IoAddCircleSharp
              onClick={() => handleMainComponentClick("CreateGroup")}
              className="size-6 cursor-pointer hover:text-blue-600"
            />
          </Tooltip>
        </div>
      </div>
      <div className="space-y-1">
        {filteredGroups.map((group) => (
          <Group
            key={group._id}
            group={group}
            handleMainComponentClick={handleMainComponentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupChats;
