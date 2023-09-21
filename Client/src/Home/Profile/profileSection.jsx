import React, { useState, useEffect } from "react";
import Postshare from "../middle/postshare";
import Posts from "../middle/Posts";
// import { getAllUser } from "../api/UserRequests.jsx";
import ProfileLeft from "./ProfileLeft";
import { useSelector } from "react-redux";
import {Link} from 'react-router-dom'
import {AiOutlineArrowLeft}from 'react-icons/ai'
const profileSection = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const { posts } = useSelector((state) => state.postReducer);
  // const dispatch = useDispatch();
  // const [newUser,setNewUser]=useState([]);
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const {data} = await getAllUser();
  //       setNewUser(data);
  //     } catch (error) {
  //       console.error('Error fetching user:', error);
  //       // You can handle errors here, e.g., display an error message to the user
  //     }
  //   };

  //   fetchUser();
  // }, []);
  // console.log(newUser)

  const totalPosts = posts.reduce((count, post) => {
    if (post.userId === user._id) {
      return count + 1;
    }
    return count;
  }, 0);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <div className=" w-[100%]   m-auto flex flex-col gap-[2rem] bg-slate-50 pt-[0.9rem]">
      <div className="absolute hidden lg:block  text-xl ml-[2rem] mt-3 z-50 rounded-md hover:text-2xl ">
   <Link to='../home' className=""><AiOutlineArrowLeft/></Link>
      </div>
      <div className=" sticky p-1 rounded-3xl shadow-md flex flex-col  bg-white w-[90%]  m-auto gap-[3rem] overflow-x-clip ">
        <div className="flex flex-col  justify-center items-center  gap-[1rem]">
          <img
            className="w-[100%] h-[13.3rem]   md:w-[85%] md:h-[20rem]  lg:w-[75%] lg:h-[25rem] rounded-md"
            src={
              user.coverPicture
                ? serverPublic + user.coverPicture
                : serverPublic + "BackgroundProfiledefault.jpg"
            }
            alt=""
          />
          <img
            className="w-[10rem] h-[10rem]  object-cover top-[7.7rem]  md:top-[15rem] lg:top-[20rem] absolute rounded-[50%] shadow-2xl border-2"
            src={
              user.profilePicture
                ? serverPublic + user.profilePicture
                : serverPublic + "defaultProfile.png"
            }
            alt=""
          />
        </div>
        <div className="flex flex-col items-center mt-[3rem] gap-[10px]">
          <span className="font-bold text-2xl">
            {user.firstname} {user.lastname}
          </span>
          <span>{user.about ? user.about : " Write About YourSelf"}</span>
        </div>
        <div>
          <div className=" m-auto w-[90%] border-[1px]">
            <hr />
          </div>

          <div className="flex flex-row items-center justify-around gap-[0.1rem]">
            <div className="p-1 text-[17px] flex flex-col justify-center items-center ">
              <span className="font-bold">{user.following.length}</span>
              <span>Following</span>
            </div>
            <div className="border-[1.6px] h-8"></div>
            <div className=" p-1 text-[17px] flex flex-col justify-center items-center">
              <span className="font-bold">{user.followers.length}</span>
              <span>Followers</span>
            </div>
            <div className="border-[1.6px] h-8"></div>
            <div className=" p-1 text-[17px] flex flex-col justify-center items-center">
              <span className="font-bold">{totalPosts}</span>
              <span>Posts</span>
            </div>
          </div>
          <div className=" m-auto w-[90%] border-[1px] mb-3">
            <hr />
          </div>
        </div>
        {/* <span className='text-center font-bold text-blue-500 p-1 cursor-pointer' >My profile</span> */}
      </div>
      <div className="grid grid-cols-[40% ,2%,60%] md:grid-cols-[35% 2%,63%] lg:grid-cols-[40%,2%,58%] m-auto w-[80%]">
        <div>
          <ProfileLeft />
        </div>
        <div></div>
        <div className=" m-auto w-[100%] flex flex-col gap-3 mt-1">
          <Postshare />
          <Posts />
        </div>
      </div>
    </div>
  );
};

export default profileSection;
