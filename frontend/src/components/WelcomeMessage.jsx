import React from "react";

import logo from "../assets/logo.png";

const WelcomeMessage = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center gap-3">
      <img src={logo} />
      <h1 className="text-2xl text-center">
        Welcome to <span className="text-[#0099FF]">Mern Messenger App</span>
      </h1>
      <p className="text-center text-gray-400">
        Start a conversation with other users!
        <br></br> Start chatting, share moments, and connect with those who
        matter most.
      </p>
    </div>
  );
};

export default WelcomeMessage;
