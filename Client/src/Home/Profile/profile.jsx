import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileLeft from "./ProfileLeft";
import ProfileSection from "./profileSection";
import Right from "../RightSide/right";

const Profile = () => {
  // const [showHome, setShowHome] = useState(true);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowHome(false);
  //   }, 5000); // Set the duration to show the home page in milliseconds (e.g., 5000ms = 5 seconds)

  //   return () => clearTimeout(timer);
  // }, []);

  // const navigate = useNavigate();

  // Check if the user is logged in
  // const email = localStorage.getItem('EMAIL');
  // const isLoggedIn = email !== null;

  return (
    <>
      <div className="relative grid grid-cols-1 sm:grid-cols-[4rem,auto] md:grid-cols-[4rem,auto] lg:grid-cols-1">
        <div className="  "></div>
        <ProfileSection />
        {/* <Right /> */}
      </div>
    </>
  );
};

export default Profile;
