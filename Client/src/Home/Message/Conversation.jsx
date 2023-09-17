import React, { useState, useEffect } from "react";
import { getUser } from "../api/UserRequests";
import { useDispatch } from "react-redux";

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = data?.members?.find((id) => id != currentUser);

    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        dispatch({ type: "SAVE_USER", data: data });
      } catch (error) {
        console.error(error);
      }
    };

    getUserData();
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 mt-[0.7rem] mb-2 hover:bg-gray-100 p-1">
        <div className="m-auto sm:m-auto md:m-0 lg:m-0">
          {online && (
            <div className="bg-green-400 rounded-full  w-[1rem] h-[1rem] border-[3px]   border-white hidden md:block lg:block absolute mt-10 ml-12"></div>
          )}
          <img
            src={
              userData?.profilePicture
                ? publicFolder + userData.profilePicture
                : publicFolder + "defaultProfile.png"
            }
            alt="profile"
            className="   w-[3.5rem] h-[3.5rem] sm:w-[4rem] sm:h-[4rem] md:w-[4rem] md:h-[4rem] lg:w-[4rem] lg:h-[4rem]  rounded-[50%] border-[0.1px]"
          />
        </div>
        <div className=" flex-col justify-start hidden sm:hidden md:flex lg:flex ">
          <span className="flex justify-start gap-1  ">
            <h1 className="font-medium">{userData?.firstname}</h1>
            <h1 className="font-medium">{userData?.lastname}</h1>
          </span>
          <span className="flex text-sm font-bold text-gray-400">
            {online ? "Active now" : "Offline"}
          </span>
        </div>
      </div>
    </>
  );
};

export default Conversation;
