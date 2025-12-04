import { useState } from 'react';

import FollowSuggestions from '../left/FollowSuggestions';
import ShareModal from './ShareModal';
import TrendingTopics from './TrendingTopics';

const RightSidebar = ({ className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <aside className={`flex w-full flex-col gap-6 lg:max-w-sm ${className}`}>
      <FollowSuggestions />
      <TrendingTopics />
    </aside>
  );
};

export default RightSidebar;


