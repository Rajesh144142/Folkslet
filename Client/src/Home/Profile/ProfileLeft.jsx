<<<<<<< Updated upstream
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
=======
import InfoCard from './infoCard';
import FollowSuggestions from '../../features/home/components/left/FollowSuggestions';

const ProfileLeft = () => (
  <div className="flex flex-col gap-[1.5rem] md:flex-row lg:flex-col">
    <InfoCard />
    <FollowSuggestions />
  </div>
);
>>>>>>> Stashed changes

export default ProfileLeft;
