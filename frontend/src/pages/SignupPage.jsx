import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { IoPersonAddOutline } from "react-icons/io5";

import axiosInstance from "../api/axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const { mutate: signupMutation } = useMutation({
    mutationFn: async (newUser) => {
      const res = await axiosInstance.post("/auth/signup", newUser);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(formData);
  };

  return (
    <div className="flex flex-1 items-center justify-center border-2 border-black rounded-2xl gap-36 bg-[#1E2630]">
      <div className="space-y-4 rounded-2xl">
        <p className="text-4xl px-5 font-semibold text-[#0099FF]">
          Messenger App
        </p>
        <p className="text-2xl p-5 border-2 border-black rounded-2xl bg-[#161A20]">
          Explore, like, and save posts effortlessly. Connect with the <br></br>
          content that matters to you.
        </p>
      </div>
      <div className="min-w-96 p-5 rounded-2xl border-2 border-black space-y-4 bg-[#161A20]">
        <h2 className="text-center font-medium text-2xl text-[#0099FF]">
          Create your Account
        </h2>
        <hr className="border-black" />
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label htmlFor="fullName" className="sr-only">
              FullName
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              placeholder="Full Name"
              className="rounded-xl w-full bg-[#29313A] border-black "
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
          </div>

          <div>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              placeholder="Username"
              className="rounded-xl w-full bg-[#29313A] border-black "
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              placeholder="Email"
              className="rounded-xl w-full bg-[#29313A] border-black "
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              placeholder="Password"
              className="rounded-xl w-full bg-[#29313A] border-black "
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              placeholder="Confirm Password"
              className="rounded-xl w-full bg-[#29313A] border-black "
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="py-2 w-full rounded-md shadow-md bg-green-700 hover:bg-green-800"
          >
            <div className="flex items-center justify-center gap-2">
              <IoPersonAddOutline className="size-5" />
              <p>Sign Up</p>
            </div>
          </button>
        </form>
        <hr className="border-black" />
        <p className="text-center">
          Already have an account?
          <span className="font-medium text-green-500">
            <Link to="/login"> Login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
