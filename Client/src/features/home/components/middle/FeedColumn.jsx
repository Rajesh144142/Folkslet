import { useSelector } from 'react-redux';
import PostComposer from './PostComposer';
import PostList from './PostList';
import FollowSuggestions from '../left/FollowSuggestions';
import TrendingTopics from '../right/TrendingTopics';
import PostComposerSkeleton from '../skeletons/PostComposerSkeleton';

const FeedColumn = () => {
  const user = useSelector((state) => state.authReducer.authData?.user);

  return (
    <section className="flex flex-col gap-6">
      {user ? <PostComposer /> : <PostComposerSkeleton />}
      <div className="flex flex-col gap-6 lg:hidden">
        <FollowSuggestions />
        <TrendingTopics />
      </div>
      <PostList />
    </section>
  );
};

export default FeedColumn;
