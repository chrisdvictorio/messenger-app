import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { FaSpinner } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";

import axiosInstance from "../api/axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosInstance.post("/auth/login", userData);
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
    loginMutation({ email, password });
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
          Login to your Account
        </h2>
        <hr className="border-black" />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              placeholder="Email"
              className="rounded-xl w-full bg-[#29313A] border-black"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Password"
              className="rounded-xl w-full bg-[#29313A] border-black"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="py-2 w-full rounded-md shadow-md bg-green-700 hover:bg-green-800"
          >
            <div className="flex h-full items-center justify-center gap-2">
              {isPending ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <p>Logging In...</p>
                </>
              ) : (
                <>
                  <CiLogin className="size-5" />
                  <p>Login</p>
                </>
              )}
            </div>
          </button>
        </form>
        <hr className="border-black" />
        <p className="text-center">
          Don't have an account?
          <span className="font-medium text-green-500">
            <Link to="/signup"> Register</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
