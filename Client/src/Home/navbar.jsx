import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsPlusSquare, BsFillDropletFill } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { BiSolidMessageDetail } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { useSelector } from "react-redux";
import PostShareforNav from "./PostShareforNav";
import { GiLeafSkeleton, GiWhaleTail } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";

const navbar = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  const [posts, setPosts] = useState(false);

  const location = useLocation();
  const chatting = location.pathname !== "/chat";

  return (
    <div className="">
      <nav className="  z-50 fixed right-0 left-0 bottom-0 flex items-center justify-around  bg-white border-t-2 sm:border-t-0 md:border-t-0 border-r-0 border-gray-200 sm:flex-col md:flex-col sm:top-0 md:top-0 md:bottom-0 sm:bottom-0 sm:left-0 md:left-0  w-full sm:w-[70px] md:w-[70px] sm:border-r-2 md:border-r-2 sm:border-gray-300">
        <Link
          to="../home"
          className="text-3xl border-2 rounded-full p-2 mt-2 bg-blue-600 text-white  hidden sm:block md:block lg:block"
        >
          <GiWhaleTail />
        </Link>
        <Link
          to="../home"
          className="  text-2xl sm:text-3xl  transition duration-200 ease-in-out p-4"
        >
          <AiOutlineHome />
        </Link>

        {chatting && (
          <div className="  text-2xl sm:text-2xl  transition duration-200 ease-in-out p-4 hidden sm:block md:block lg:hidden">
            <BsPlusSquare onClick={() => setPosts(!posts)} />

            {posts && (
              <div className="absolute left-[4.5rem]  top-[14px]  flex items-center">
                <span
                  className="absolute right-[10px] mt-2 top-2 p-1 border-2 rounded-full text-sm"
                  onClick={() => setPosts(!posts)}
                >
                  <RxCross2 />
                </span>
                <div
                  className="w-0 h-0 
        border-t-[12.5px] border-t-transparent
        border-r-[25px] border-r-white
        border-b-[12.5px] border-b-transparent
        "
                ></div>
                <PostShareforNav />
              </div>
            )}
          </div>
        )}
        {/* <div 
          className="   text-2xl  sm:text-3xl mt-3 transition duration-200 ease-in-out p-4"
          >
          <FaShare />
        </div> */}
        {chatting && (
          <Link
            to=""
            className="   text-2xl sm:text-3xl  transition duration-200 ease-in-out p-4"
          >
            <BiSolidMessageDetail />
          </Link>
        )}
        <Link
          to=""
          className="  text-2xl sm:text-3xl  transition duration-200 ease-in-out p-4"
        >
          <AiOutlineSetting />
        </Link>
        <Link
          to="../"
          className="  text-2xl sm:text-3xl  transition duration-200 ease-in-out p-4"
        >
          <IoNotifications />
        </Link>
        <Link to={`/profile/${user._id}`}>
          <img
            className="border-2 rounded-[50%] w-[2.5rem] h-[2.5rem] m-1"
            src={
              user.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            alt="Profile"
          />
        </Link>
      </nav>
    </div>
  );
};

export default navbar;
