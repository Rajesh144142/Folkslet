import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser, getUser } from "./api/UserRequests";
import { createChat } from "./api/ChatRequests";
const User = ({ person }) => {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const [following, setFollowing] = useState(
    person.followers.includes(user._id)
  );
  const chatting = {
    senderId: user._id,
    receiverId: person._id,
  };
  const handleFollow = () => {
    setFollowing((prev) => !prev);
    if (following) {
      unfollowUser(person._id, user);
      dispatch({ type: "UNFOLLOW_USER", data: person._id });

      // Dispatch the action
    } else {
      followUser(person._id, user);
      // Dispatch the action
      dispatch({ type: "FOLLOW_USER", data: person._id });
      dispatch({ type: "SAVE_USER", chatting });
      createChat(chatting);
    }
  };
  return (
    <div className=" flex items-center justify-between">
      <div className="flex  items-center ">
        <img
          src={
            person.profilePicture
              ? publicFolder + person.profilePicture
              : publicFolder + "defaultProfile.png"
          }
          alt="profile"
          className="w-[3.5rem] h-[3.5rem] rounded-[50%] p-1"
        />
        <div className="font-bold text-sm flex flex-col ">
          <span>{person.firstname || person.email?.split('@')[0] || 'User'}</span>
          <span>{person.email?.split('@')[0] || 'user'}</span>
        </div>
      </div>
      <button
        className="bg-orange-400 w-20 text-center text-white font-bold border-2 border-orange-400 p-2 rounded-xl hover:bg-white hover:text-orange-600"
        onClick={handleFollow}
      >
        {following ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
};

export default User;
