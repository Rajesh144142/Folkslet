import FeedColumn from '../middle/FeedColumn';
import RightSidebar from '../right/RightSidebar';

const HomeLayout = () => (
  <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-4 pb-12 lg:flex-row lg:px-8">
    <div className="flex w-full flex-col gap-6 lg:flex-[2]">
      <FeedColumn />
    </div>
    <RightSidebar className="hidden lg:flex" />
  </div>
);

export default HomeLayout;


