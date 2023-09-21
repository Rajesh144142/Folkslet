import React from 'react'
import { Link } from 'react-router-dom'
import LogoSearch from './logoSearch'
import { useDispatch, useSelector } from 'react-redux';

const side = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER
  return (
    
    <>
    {/* <LogoSearch/> */}
    <div className=' flex-col gap-4 hidden sm:hidden md:hidden lg:flex'>
        <LogoSearch/>
         <div className='p-1  h-[580px]  shadow-2xl flex flex-col gap-[1rem] overflow-x-clip'>
        <div className='flex flex-col  justify-center items-center gap-[1rem]'>
          <img className='w-full  h-[12.8rem]' 
 src={
  user.coverPicture
      ? serverPublic + user.coverPicture
      : serverPublic + "BackgroundProfiledefault.jpg"
}           alt="" />
          <img className='border-1 bg-slate-50 w-[7rem] h-[7rem] top-[14.7rem] absolute rounded-[50%] shadow-2xl'  src={
                            user.profilePicture
                                ? serverPublic + user.profilePicture
                                : serverPublic + "defaultProfile.png"
                        }  alt="" />

        </div>
        <div className='flex flex-col items-center mt-[3rem] gap-[10px]'>
          <span className='font-bold text-2xl'>{user.firstname} {user.lastname}</span>
          <span className='text-center'>{user.about?user.about:" Write About YourSelf"}</span>

        </div>
        <div >
          <div className=' m-auto w-[80%] border-[1px]'><hr/></div>
        
          <div className='flex flex-row items-center justify-around gap-[0.1rem]'>
          <div className='p-1 text-[13px] flex flex-col justify-center items-center '>
          <span className='font-bold'>{user.following.length}</span>
          <span>Following</span>
          </div>
          <div className='border-[1.6px] h-8'></div>
          <div className=' p-1 text-[13px] flex flex-col justify-center items-center'>
          <span className='font-bold'>{user.followers.length}</span>
          <span>Followers</span>
          </div>
          </div>
          <div className=' m-auto w-[80%] border-[1px] mb-3'><hr/></div>

        </div>
        <span className='text-center font-bold text-blue-500 border-2 rounded-2xl cursor-pointer m-auto w-[95%] p-3 hover:bg-slate-100' > 
      <Link to={`/profile/${user._id}`}>My profile</Link>        
        </span>

      </div>
      
      </div>
      
    
    </>
  )
}

export default side