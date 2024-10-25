import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { FaEdit, FaImage, FaSpinner } from "react-icons/fa";

import axiosInstance from "../api/axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      bio: "",
      profilePicture: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: async (updatedProfile) => {
      const res = await axiosInstance.patch("/users/update", updatedProfile);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
      resetForm();
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
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file); //base64 format
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formData);
  };

  return (
    <div className="flex-1 px-3 pt-5 space-y-4">
      <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10"
        autoComplete="off"
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={formData.profilePicture || authUser.profilePicture}
                className=" relative rounded-full size-56 border-2 border-black object-cover"
              />
              <input
                id="profilePicture"
                type="file"
                disabled={isPending}
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
            </div>
            <p className="text-xl font-medium">{authUser.fullName}</p>
          </div>

          <div className="px-32 space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="fullName" className="font-medium">
                  Full Name
                </label>
                <input
                  id="fullName"
                  value={formData.fullName}
                  type="text"
                  className="rounded-lg bg-[#161A20] border-black"
                  placeholder={`${authUser.fullName}`}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="username" className="font-medium">
                  Username
                </label>
                <input
                  id="username"
                  value={formData.username}
                  type="text"
                  className="rounded-lg bg-[#161A20] border-black"
                  placeholder={`${authUser.username}`}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="bio" className="font-medium">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                type="text"
                rows="4"
                className="rounded-lg resize-none text-justify bg-[#161A20] border-black"
                placeholder={`${authUser.bio}`}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="currentPassword" className="font-medium">
                Current Password
              </label>
              <input
                id="currentPassword"
                value={formData.currentPassword}
                type="password"
                className="rounded-lg bg-[#161A20] border-black"
                placeholder="********"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="newPassword" className="font-medium">
                  New Password
                </label>
                <input
                  id="newPassword"
                  value={formData.newPassword}
                  type="password"
                  className="rounded-lg bg-[#161A20] border-black"
                  placeholder="********"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="confirmNewPassword" className="font-medium">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  type="password"
                  className="rounded-lg bg-[#161A20] border-black"
                  placeholder="********"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-32 gap-8">
          <button
            type="button"
            onClick={() => resetForm()}
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
                <p>Updating Profile...</p>
              </>
            ) : (
              <>
                <FaEdit className="size-5" />
                <p>Update Profile</p>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
