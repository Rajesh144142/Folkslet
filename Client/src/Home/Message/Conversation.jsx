import React, { useState, useEffect } from "react";
<<<<<<< Updated upstream
import { getUser } from "../api/UserRequests";
import { useDispatch } from "react-redux";

const Conversation = ({ data, currentUser, online }) => {

  const [userData, setUserData] = useState(null);
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = data?.members?.find((id) => id != currentUser);

=======
import { getUser } from "../../features/home/api/UserRequests";
import { useDispatch } from "react-redux";
import { SAVE_USER } from "../../redux/actionTypes";
import { assetUrl } from "../../utils/assets";
const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUser);
>>>>>>> Stashed changes
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
<<<<<<< Updated upstream
        dispatch({ type: "SAVE_USER", data: data });
=======
        dispatch({ type: SAVE_USER, data });
>>>>>>> Stashed changes
      } catch (error) {
        console.error(error);
      }
    };
<<<<<<< Updated upstream

    getUserData();
  }, []);

  return (
    <>
      <div className="flex items-center gap-2 mt-[0.7rem] mb-2 hover:bg-gray-100 p-1" >
        <div className={`m-auto sm:m-auto md:m-0 lg:m-0  avatar ${online?"online":"offline"}` }  
>
        <div className="w-16 rounded-full border-2"  
        >
          <img
            src={
              userData?.profilePicture
                ? publicFolder + userData.profilePicture
                : publicFolder + "defaultProfile.png"
            }
            alt="profile"
            className="  "
          />
          </div>
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

=======
    getUserData();
  }, [currentUser, data, dispatch]);
  const fullName = [userData?.firstname, userData?.lastname].filter(Boolean).join(" ");
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="relative">
        <img
          src={assetUrl(userData?.profilePicture, "defaultProfile.png")}
          alt={fullName || "profile"}
          className="h-12 w-12 rounded-full border border-[var(--color-border)] object-cover"
          loading="lazy"
        />
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-[var(--color-surface)] ${
            online ? "bg-green-500" : "bg-[var(--color-border)]"
          }`}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-tight text-[var(--color-text-base)]">
          {fullName || "Unknown user"}
        </span>
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          {online ? "Active now" : "Offline"}
        </span>
      </div>
    </div>
  );
};
>>>>>>> Stashed changes
export default Conversation;
