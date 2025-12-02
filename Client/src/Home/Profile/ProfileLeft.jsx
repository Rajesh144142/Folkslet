import InfoCard from './infoCard';
import FollowSuggestions from '../../features/home/components/left/FollowSuggestions';

const ProfileLeft = () => (
  <div className="flex flex-col gap-[1.5rem] md:flex-row lg:flex-col">
    <InfoCard />
    <FollowSuggestions />
  </div>
);

export default ProfileLeft;