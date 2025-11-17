<<<<<<< HEAD
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
=======
import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import ProfileLeft from './ProfileLeft';
import PostComposer from '../../features/home/components/middle/PostComposer';
import PostList from '../../features/home/components/middle/PostList';
import { assetUrl } from '../../utils/assets';
import * as UserApi from '../../features/home/api/UserRequests';

const ProfileSection = () => {
  const authData = useSelector((state) => state.authReducer.authData);
  const postsState = useSelector((state) => state.postReducer.posts);
  const user = authData?.user;
  const posts = Array.isArray(postsState) ? postsState : [];
  const params = useParams();
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!profileUserId) {
        setProfileUser(user);
        return;
      }
      if (profileUserId === user?._id) {
        setProfileUser(user);
      } else {
        try {
          const profileDetails = await UserApi.getUser(profileUserId);
          setProfileUser(profileDetails);
        } catch (error) {
          setProfileUser(null);
        }
      }
    };
    if (user) {
      fetchProfileUser();
    }
  }, [profileUserId, user]);

  if (!user || !profileUser) {
    return null;
  }

  const isOwnProfile = user._id === profileUserId || !profileUserId;
  const totalPosts = posts.reduce((count, post) => (post?.userId === profileUser._id ? count + 1 : count), 0);
  const fullName = [profileUser.firstname, profileUser.lastname].filter(Boolean).join(' ').trim() || profileUser.username || 'User';
  const about = profileUser.about?.trim() || 'Write about yourself';
  const followingCount = Array.isArray(profileUser.following) ? profileUser.following.length : 0;
  const followerCount = Array.isArray(profileUser.followers) ? profileUser.followers.length : 0;
  const coverSrc = assetUrl(profileUser.coverPicture, 'BackgroundProfiledefault.jpg');
  const avatarSrc = assetUrl(profileUser.profilePicture, 'defaultProfile.png');
>>>>>>> c32dbde (feat: Add WebRTC video/audio calling, profile improvements, and update documentation)

  const totalPosts = posts.reduce((count, post) => {
    if (post.userId === user._id) {
      return count + 1;
    }
    return count;
  }, 0);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
<<<<<<< HEAD
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
=======
    <div className="w-full ">
      <Grid container spacing={3} className="w-full">
        <Grid item xs={12}>
          <section className="w-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] shadow-xl">
            <div className="relative h-48 w-full sm:h-64 lg:h-80">
              <img src={coverSrc} alt={`${fullName} cover`} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-6 sm:px-10">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-background)] shadow-lg sm:mx-0">
                  <img
                    src={avatarSrc}
                    alt={fullName}
                    className="h-28 w-28 rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-3 px-6 pb-8 text-center sm:mt-16 sm:px-10 sm:text-left">
              <h1 className="text-3xl font-semibold text-[var(--color-text-base)]">{fullName}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">{about}</p>
              <div className="mt-6 grid w-full grid-cols-3 divide-x divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 backdrop-blur">
                <Link
                  to={`/profile/${profileUser._id}/following`}
                  className="flex flex-col items-center gap-1 py-5 transition hover:bg-[var(--color-background)]/80"
                >
                  <span className="text-xl font-semibold text-[var(--color-primary)]">{followingCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Following
                  </span>
                </Link>
                <Link
                  to={`/profile/${profileUser._id}/followers`}
                  className="flex flex-col items-center gap-1 py-5 transition hover:bg-[var(--color-background)]/80"
                >
                  <span className="text-xl font-semibold text-[var(--color-accent)]">{followerCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Followers
                  </span>
                </Link>
                <div className="flex flex-col items-center gap-1 py-5">
                  <span className="text-xl font-semibold text-[var(--color-secondary)]">{totalPosts}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Posts
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ProfileLeft />
        </Grid>
        <Grid item xs={12} lg={8}>
          <div className="flex flex-col gap-4">
            {isOwnProfile && <PostComposer />}
            <PostList />
>>>>>>> c32dbde (feat: Add WebRTC video/audio calling, profile improvements, and update documentation)
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
