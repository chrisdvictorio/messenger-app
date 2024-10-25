import React, { useState } from "react";

import useProfileStore from "../store/useProfileStore";
import useChatStore from "../store/useChatStore";

import profile from "../assets/bethdoe.png";
import profile2 from "../assets/janedoe.jpg";
import profile3 from "../assets/ishmimi.jpg";
import Sidebar from "../components/Sidebar";
import AllChats from "../components/AllChats";
import GroupChats from "../components/GroupChats";
import SharedImages from "../components/SharedImages";
import WelcomeMessage from "../components/WelcomeMessage";
import ChatWindow from "../components/ChatWindow";
import EditProfile from "../components/EditProfile";
import CreateGroup from "../components/CreateGroup";
import FriendsList from "../components/FriendsList";
import FriendRequest from "../components/FriendRequest";
import ProfileDetails from "../components/ProfileDetails";
import GroupDetails from "../components/GroupDetails";
import FindUser from "../components/FindUser";

const HomePage = () => {
  const DUMMY_USER = [
    {
      id: 1,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
    {
      id: 2,
      profilePicture: profile2,
      fullName: "Jane Doe",
      message: "Hello, My name is Jane Doe!",
    },
    {
      id: 3,
      profilePicture: profile3,
      fullName: "Chris Victorio",
      message: "Hello, My name is Chris Victorio!",
    },
    {
      id: 4,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
    {
      id: 5,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
    {
      id: 6,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
    {
      id: 7,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
    {
      id: 8,
      profilePicture: profile,
      fullName: "Beth Doe",
      message: "Hello, My name is Beth Doe!",
    },
  ];

  const [sidebarCategory, setSidebarCategory] = useState("AllChats");
  const [mainComponent, setMainComponent] = useState("WelcomeMessage");
  const [rightComponent, setRightComponent] = useState("FriendsList");
  const { selectedProfile, setSelectedProfile } = useProfileStore();

  const handleSidebarCategoryClick = (category) => {
    setSidebarCategory(category);
  };

  const handleMainComponentClick = (component) => {
    setMainComponent(component);
  };

  const handleRightComponentClick = (component) => {
    setRightComponent(component);
  };

  const handleSelectProfileClick = (profile) => {
    setSelectedProfile(profile);
    setRightComponent("ProfileDetails");
  };

  return (
    <div className="flex flex-1 justify-between border-2 border-black rounded-2xl bg-[#1E2630]">
      {/* SIDEBAR */}
      <Sidebar
        sidebarCategory={sidebarCategory}
        handleSidebarCategoryClick={handleSidebarCategoryClick}
        handleMainComponentClick={handleMainComponentClick}
      />

      {/* MESSAGES LIST  || GROUP CHAT || ARCHIVED MESSAGES*/}
      {sidebarCategory === "AllChats" && (
        <AllChats
          handleMainComponentClick={handleMainComponentClick}
          handleRightComponentClick={handleRightComponentClick}
        />
      )}
      {sidebarCategory === "GroupChats" && (
        <GroupChats handleMainComponentClick={handleMainComponentClick} />
      )}
      {sidebarCategory === "ArchivedChats" && <SharedImages />}

      {/*MAIN SECTION*/}
      {/* WELCOME MESSAGE  || CHAT WINDOW || EDIT PROFILE || CREATE GROUP*/}
      {mainComponent === "WelcomeMessage" && <WelcomeMessage />}
      {mainComponent === "ChatWindow" && (
        <ChatWindow
          handleRightComponentClick={handleRightComponentClick}
          handleSelectProfileClick={handleSelectProfileClick}
        />
      )}
      {mainComponent === "EditProfile" && <EditProfile />}
      {mainComponent === "CreateGroup" && (
        <CreateGroup handleMainComponentClick={handleMainComponentClick} />
      )}

      {/*RIGHT SECTION*/}
      {/* FRIENDS LIST  || FRIEND REQUEST || FIND USERS || PROFILE DETAILS*/}
      {rightComponent === "FriendsList" && (
        <FriendsList
          handleRightComponentClick={handleRightComponentClick}
          handleSelectProfileClick={handleSelectProfileClick}
        />
      )}
      {rightComponent === "FriendRequest" && (
        <FriendRequest
          handleRightComponentClick={handleRightComponentClick}
          handleSelectProfileClick={handleSelectProfileClick}
        />
      )}
      {rightComponent === "FindUser" && (
        <FindUser
          handleRightComponentClick={handleRightComponentClick}
          handleSelectProfileClick={handleSelectProfileClick}
        />
      )}
      {rightComponent === "ProfileDetails" && (
        <ProfileDetails
          handleRightComponentClick={handleRightComponentClick}
          handleMainComponentClick={handleMainComponentClick}
        />
      )}
      {rightComponent === "GroupDetails" && (
        <GroupDetails handleRightComponentClick={handleRightComponentClick} />
      )}
    </div>
  );
};

export default HomePage;
