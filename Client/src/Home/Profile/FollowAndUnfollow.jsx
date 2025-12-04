import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUser } from '../api/UserRequests';

const FollowAndUnfollow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchFollowCounts = async () => {
      try {
        const { getUser } = await import('../api/UserRequests');
        const response = await getUser(user._id);
        const userData = response?.data || response;
        if (userData) {
          setPersons({
            followingCount: userData.followingCount || 0,
            followersCount: userData.followersCount || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching follow counts:', error);
      }
    };
    if (user?._id) {
      fetchFollowCounts();
    }
  }, [user?._id]);
  
  return (
    <div>
      <div className='p-1 text-[17px] flex flex-col justify-center items-center '>
        <span className='font-bold'>{persons.followingCount || 0}</span>
        <span>Following</span>
      </div>
      <div className='border-[1.6px] h-8'></div>
      <div className=' p-1 text-[17px] flex flex-col justify-center items-center'>
        <span className='font-bold'>{persons.followersCount || 0}</span>
        <span>Followers</span>
      </div>
    </div>
  );
};

export default FollowAndUnfollow;
