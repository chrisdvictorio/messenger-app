import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Select from "react-select";

import { FaEdit, FaImage, FaSpinner } from "react-icons/fa";

import axiosInstance from "../api/axios";

const CreateGroup = ({ handleMainComponentClick }) => {
  const [formData, setFormData] = useState({
    groupName: "",
    groupPicture:
      "https://cdn.pixabay.com/photo/2020/05/29/13/26/icons-5235125_1280.png",
    message: "",
    participants: [],
  });

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: allUsers, isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
    },
  });

  const { mutate: createGroupMutation } = useMutation({
    mutationFn: async (groupData) => {
      const res = await axiosInstance.post("/chats/groups/create", groupData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGroupChats"] });
      toast.success("Group chat created successfully!");
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const options = allUsers
    ?.filter((user) => user._id !== authUser?._id)
    .map((user) => ({
      value: user._id,
      label: user.fullName,
    }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#161A20",
      color: "#ffffff",
      border: "1px solid #000000",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #000000",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#0258BD"
        : "transparent",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#0258BD",
      },
    }),
    menu: (provided) => ({
      ...provided,
      border: "1px solid #000000",
      backgroundColor: "#161A20",
    }),
    input: (provided) => ({
      ...provided,
      color: "#ffffff",
      border: "none",
      outline: "none",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#0258BD",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#ffffff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      ":hover": {
        backgroundColor: "#c81e1e",
        color: "#ffffff",
      },
    }),
  };

  const handleSelectChange = (selectedOptions) => {
    const participants = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      participants,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          groupPicture: reader.result,
        }));
      };
      reader.readAsDataURL(file); //base64 format
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createGroupMutation(formData);
  };

  const isPending = false;

  return (
    <div className="flex-1 px-3 pt-5 space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Group Chat</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10"
        autoComplete="off"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={formData.groupPicture || ""}
                className=" relative rounded-full size-56 border-2 border-black object-cover"
              />
              <input
                id="groupPicture"
                type="file"
                disabled={isPending}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="groupPicture"
                className="absolute bottom-5 right-5 flex items-center justify-center rounded-lg cursor-pointer bg-[#0258BD] size-8"
              >
                <FaImage className="size-5" />
              </label>
            </div>
            <p className="text-xl font-medium">{formData.groupName}</p>
          </div>

          <div className="px-32 space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="groupName" className="font-medium">
                  Group Name
                </label>
                <input
                  id="groupName"
                  value={formData.groupName}
                  type="text"
                  className="rounded-lg bg-[#161A20] border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, groupName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="participants" className="font-medium">
                Add Members
              </label>
              <Select
                id="participants"
                styles={customStyles}
                isMulti
                options={options}
                onChange={handleSelectChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select members..."
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="message" className="font-medium">
                  Add a message
                </label>
                <input
                  id="message"
                  value={formData.message}
                  type="text"
                  placeholder="Type a message"
                  className="rounded-lg bg-[#161A20] border-black"
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-32 gap-8">
          <button
            type="button"
            onClick={() => handleMainComponentClick("WelcomeMessage")}
            disabled={isPending}
            className="w-full py-2 rounded-lg bg-gray-600 hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center w-full py-2 rounded-lg gap-2 bg-[#0258BD] hover:bg-blue-600"
          >
            {isPending ? (
              <>
                <FaSpinner className="animate-spin" />
                <p>Creating Group...</p>
              </>
            ) : (
              <>
                <FaEdit className="size-5" />
                <p>Create Group</p>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
