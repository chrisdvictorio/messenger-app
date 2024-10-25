import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { IoIosSearch } from "react-icons/io";
import { BiSolidMessageRounded } from "react-icons/bi";

import axiosInstance from "../api/axios";
import Chat from "./Chat";
import useChatStore from "../store/useChatStore";

const AllChats = ({ handleMainComponentClick, handleRightComponentClick }) => {
  const [search, setSearch] = useState("");
  const { chats, setChats } = useChatStore();

  const { data: allChats } = useQuery({
    queryKey: ["allChats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/chats");
      setChats(res.data);
      return res.data;
    },
  });

  const filteredChats = chats.filter((chat) =>
    chat?.participants[0]?.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-96 min-w-96 p-3 space-y-4 border-r-2 border-black bg-[#161A20]">
      <h2 className="text-2xl font-bold ">Messages</h2>
      <div className="relative flex items-center">
        <IoIosSearch className="absolute left-3 size-5 text-[#65676B]" />
        <label htmlFor="searchChat" className="sr-only"></label>
        <input
          id="searchChat"
          type="text"
          placeholder="Search Chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 py-1 rounded-full w-full font-light bg-[#29313A] border-black"
        />
      </div>
      <div className="flex items-center justify-between text-[#0099FF]">
        <div className="flex items-center gap-2">
          <BiSolidMessageRounded />
          <h3 className="font-semibold">All Chats</h3>
        </div>
      </div>
      <div className="space-y-1">
        {filteredChats.map((chat) => (
          <Chat
            key={chat._id}
            chat={chat}
            handleMainComponentClick={handleMainComponentClick}
            handleRightComponentClick={handleRightComponentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default AllChats;
