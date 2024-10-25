import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

import axiosInstance from "./api/axios";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ErrorPage from "./pages/ErrorPage";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401 || error.response.status === 404) {
            return null;
          }
        }
        toast.error(error.response.data.error);
      }
    },
  });

  if (isLoading) return null;

  return (
    <div className="flex flex-col min-h-screen p-5 bg-slate-900">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
