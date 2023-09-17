import React, { useState } from 'react';
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai';
import { BiSolidMessageDetail,BiSearch } from 'react-icons/bi';
import { IoNotifications } from 'react-icons/io5';
import TrendCard from './TrendCard';
import ShareModal from '../shareModel/shareModel';
import { Link } from 'react-router-dom'
import FollowCard from '../leftSide/followCard';
const Right = () => {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <div className="flex flex-col gap-[2rem] ">
      <div className=" m-auto mt-5 w-[100%]   justify-between hidden sm:hidden md:hidden lg:flex ">
        <div className="text-2xl">
          <Link to='../home'><AiOutlineHome /></Link>
        </div>
        <div className="text-2xl">
          <Link  to='../settings'>
            <AiOutlineSetting />
          </Link >
        </div>
        <div className="text-2xl">
          <Link  to='../chat'>
            <BiSolidMessageDetail />
          </Link>
        </div>
        <div className="text-2xl">
          <Link  to='../Notification'>
            <IoNotifications />
          </Link>
        </div>
      </div>
      <div className=' justify-center items-center mt-5 border-2  rounded-md  w-[100%] hidden sm:hidden md:flex lg:hidden'>
        <input type="text" className='  rounded-lg w-[15rem] p-2 outline-none'placeholder='#Explore' />
        <div className="   w-[70%] text-center  p-2  ">
          <BiSearch />
        </div>
      </div>
     <div className=''><FollowCard/></div>
      <button
        className="rounded-3xl p-2 w-[70%] ml-auto mr-auto h-[3rem] bg-blue-300 hidden sm:hidden md:block lg:block"
        onClick={() => setModalOpened(true)}
      >
        Share
      </button>
      <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />
      <TrendCard/>
    </div>
  );
};

export default Right;
