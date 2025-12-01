import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUser } from '../api/UserRequests';

const FollowAndUnfollow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        // Filter out the user you are interested in
        const myPerson = data.find((person) => person._id === user._id);
        setPersons(myPerson);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchPersons();
  }, []); // Include 'user' in the dependency array to refetch when 'user' changes
  return (
    <div>
      <div className='p-1 text-[17px] flex flex-col justify-center items-center '>
        <span className='font-bold'>{persons.following.length}</span>
        <span>Following</span>
      </div>
      <div className='border-[1.6px] h-8'></div>
      <div className=' p-1 text-[17px] flex flex-col justify-center items-center'>
        <span className='font-bold'>{persons.followers.length}</span>
        <span>Followers</span>
      </div>
    </div>
  );
};

export default FollowAndUnfollow;
