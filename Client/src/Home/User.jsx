import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { followUser, unfollowUser, getUser } from "./api/UserRequests";
import { createChat } from "./api/ChatRequests";
const User = ({ person }) => {
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const [following, setFollowing] = useState(
    person.isFollowing || false
  );
  
  useEffect(() => {
    setFollowing(person.isFollowing || false);
  }, [person.isFollowing]);
  const chatting = {
    senderId: user._id,
    receiverId: person._id,
  };
  const handleFollow = async () => {
    const newFollowingState = !following;
    setFollowing(newFollowingState);
    
    try {
      if (following) {
        await unfollowUser(person._id, user);
        dispatch({ type: "UNFOLLOW_USER", data: person._id });
      } else {
        await followUser(person._id, user);
        dispatch({ type: "FOLLOW_USER", data: person._id });
        dispatch({ type: "SAVE_USER", chatting });
        try {
          await createChat(chatting);
          window.dispatchEvent(new CustomEvent('chatCreated'));
        } catch (error) {
          console.error('Error creating chat:', error);
        }
      }
      window.dispatchEvent(new CustomEvent('userListRefresh'));
    } catch (error) {
      setFollowing(following);
      console.error('Error updating follow status:', error);
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
          <span>{[person.firstName || person.firstname, person.lastName || person.lastname].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User'}</span>
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
