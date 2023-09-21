import React, { useState, useEffect } from "react";
import { BiSolidPencil ,BiSolidMapPin} from "react-icons/bi";
import ProfileModal from "./profileModel";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as UserApi from "../api/UserRequests";
import { logout } from "../action/AuthActions";
import {AiOutlineHeart}from 'react-icons/ai'
import {CgWorkAlt}from 'react-icons/cg'
import {SiHomebridge}from 'react-icons/si'
const InfoCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const params = useParams();
  const [modalOpened, setModalOpened] = useState(false);
  const [profileUser, setProfileUser] = useState({});
  const profileUserId = params.id;

  const handleLogOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const fatchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
      }
      else {
        const profileUser = await UserApi.getUser(profileUserId);
        setProfileUser(profileUser);
      }
    }
    fatchProfileUser();
  }, [user]);

  return (
    <div className="flex flex-col gap-[1rem] p-[1rem] rounded-[1rem]  bg-slate-200 m-auto w-[100%] ">
      <div className="flex justify-between items-center hover:cursor-pointer">
        <h4 className="font-bold">Profile Info</h4>
        
        {user._id === profileUserId ? (<div>
          <BiSolidPencil
            className="w-[2rem] h-[1.2rem]"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
            data={user}
          />
        </div>) : ("")}

      </div>

      {/* Display user information here */}
     
      <div className="mt-1 flex items-center">
      <span className=" text-2xl ">
       < BiSolidMapPin/>
        </span>
        <span className="font-thin  ml-2">
          Lives in
        </span>
        <span className=" font-bold ml-1">
          {profileUser.livesin}</span>
      </div>

      <div className="mt-1 flex items-center">
      <span className=" text-2xl ">
       < CgWorkAlt/>
        </span>
        <span className="font-thin  ml-2">
          Works at
        </span>
        <span className=" font-bold ml-1">
          {profileUser.worksAt}</span>
      </div>
      <div className="mt-1 flex items-center">
      <span className=" text-2xl ">
       < SiHomebridge/>
        </span>
        <span className="font-thin  ml-2">
          Country        </span>
        <span className=" font-bold ml-1">
          {profileUser.country}</span>
      </div>
      <div className="mt-1 flex items-center">
      <span className=" text-2xl ">
       < AiOutlineHeart/>
        </span>
     
        <span className=" font-bold ml-2">
          {profileUser.relationship}</span>
      </div>

      <button
        className="w-[7rem] h-[2rem] mt-[2rem] self-end bg-slate-300 rounded-md hover:bg-slate-400"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </div>
  );
};

export default InfoCard;
