<<<<<<< Updated upstream
import React from 'react'
// import Side from '../leftSide/side'
import TrendCard from '../RightSide/trendCard'
const Profileright = () => {
  return (
    <div className='flex flex-col gap-[2rem]'>
     <div className=''> <TrendCard/></div>
     
     <button className='rounded-3xl p-2 w-[70%] ml-auto mr-auto h-[3rem] bg-blue-300'>Share</button>
     
    

    </div>
  )
}

export default Profileright
=======
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
>>>>>>> Stashed changes
