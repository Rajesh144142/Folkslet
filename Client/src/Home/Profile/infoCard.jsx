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
<<<<<<< HEAD
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

=======
    const fetchProfileUser = async () => {
      if (!profileUserId || profileUserId === user?._id) {
        setProfileUser(user || {});
      } else {
        try {
          const profileDetails = await UserApi.getUser(profileUserId);
          setProfileUser(profileDetails);
        } catch (error) {
          setProfileUser({});
        }
      }
    };
    if (user) {
      fetchProfileUser();
    }
  }, [profileUserId, user]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[var(--color-text-base)]">Profile Info</h4>
        {(user?._id === profileUserId || !profileUserId) && (
          <Link
            to="/settings"
            className="rounded-full border border-[var(--color-border)] px-4 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Edit in settings
          </Link>
        )}
>>>>>>> c32dbde (feat: Add WebRTC video/audio calling, profile improvements, and update documentation)
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
<<<<<<< HEAD

      <button
        className="w-[7rem] h-[2rem] mt-[2rem] self-end bg-slate-300 rounded-md hover:bg-slate-400"
        onClick={handleLogOut}
      >
        Logout
      </button>
=======
      {(user?._id === profileUserId || !profileUserId) && (
        <button
          className="self-end rounded-full bg-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          onClick={handleLogOut}
        >
          Logout
        </button>
      )}
>>>>>>> c32dbde (feat: Add WebRTC video/audio calling, profile improvements, and update documentation)
    </div>
  );
};

export default InfoCard;
