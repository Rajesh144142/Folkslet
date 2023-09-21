import React from 'react';
import LogoSearch from '../leftSide/logoSearch.jsx';
import InfoCard from './infoCard';
import FollowersCard from '../leftSide/followCard';

const ProfileLeft = () => {
  return (
    <div className='flex flex-col md:flex-row lg:flex-col gap-[1.5rem]'>
      <InfoCard />
      <FollowersCard />
    </div>
  );
};

export default ProfileLeft;
