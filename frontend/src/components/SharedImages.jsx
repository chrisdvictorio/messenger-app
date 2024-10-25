import React from "react";
import { useQuery } from "@tanstack/react-query";

import { MdGroups } from "react-icons/md";
import { FaImage } from "react-icons/fa";
import axiosInstance from "../api/axios";

const SharedImages = ({}) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: userImagesSent } = useQuery({
    queryKey: ["userImagesSent"],
    queryFn: async () => {
      const res = await axiosInstance.get("/messages/images/sent");
      return res.data;
    },
  });

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  return (
    <div className="max-w-96 min-w-96 p-3 space-y-4 border-r-2 border-black bg-[#161A20]">
      <h2 className="text-2xl font-bold ">Messages</h2>
      <div className="flex items-center text-[#0099FF]">
        <div className="flex items-center gap-2">
          <FaImage className="size-5" />
          <h3 className="font-semibold">Shared Images</h3>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {userImagesSent?.map((image, index) => (
          <div key={index} className="w-full aspect-square cursor-pointer">
            <img
              onClick={() => handleImageClick(image.image)}
              src={image.image}
              alt={`Sent image ${index + 1}`}
              className="w-full h-full object-cover rounded-lg border-2 border-black"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SharedImages;
