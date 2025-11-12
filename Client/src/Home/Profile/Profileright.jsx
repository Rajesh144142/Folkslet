import TrendingTopics from '../../features/home/components/right/TrendingTopics';

const Profileright = () => (
  <div className="flex flex-col gap-[2rem]">
    <TrendingTopics />
    <button type="button" className="ml-auto mr-auto h-[3rem] w-[70%] rounded-3xl bg-blue-300">
      Share
    </button>
  </div>
);

export default Profileright;