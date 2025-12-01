import PostComposer from './PostComposer';
import PostList from './PostList';
import FollowSuggestions from '../left/FollowSuggestions';
import TrendingTopics from '../right/TrendingTopics';

const FeedColumn = () => (
  <section className="flex flex-col gap-6">
    <PostComposer />
    <div className="flex flex-col gap-6 lg:hidden">
      <FollowSuggestions />
      <TrendingTopics />
    </div>
    <PostList />
  </section>
);

export default FeedColumn;
