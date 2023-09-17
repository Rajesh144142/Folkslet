import React, { useState, useEffect } from "react";
import { BiSolidPencil } from "react-icons/bi";
import ProfileModal from "./profileModel";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as UserApi from "../api/UserRequests";
import { logout } from "../action/AuthActions";

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
    <div className="flex flex-col gap-[0.75] p-[1rem] rounded-[1rem] m-1 bg-slate-200">
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
      <div className="mt-1">
        <span>
          <b>Status </b>
        </span>
        <span>{profileUser.relationship}</span>
      </div>

      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{profileUser.livesin}</span>
      </div>

      <div className="info">
        <span>
          <b>Works at </b>
        </span>
        <span>{profileUser.worksAt}</span>
      </div>
      <div className="info">
        <span>
          <b>Country </b>
        </span>
        <span>{profileUser.country}</span>
      </div>

      <button
        className="w-[7rem] h-[2rem] mt-[6rem] self-end bg-slate-300 rounded-md hover:bg-slate-400"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </div>
  );
};

export default InfoCard;
