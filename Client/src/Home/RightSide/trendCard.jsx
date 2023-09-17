import React from 'react';
import { trendData } from './trendData';

const TrendCard = () => {
  return (

    <div className=' flex-col gap-[1rem]  bg-slate-200 p-[1rem] rounded-[1rem] pl-[2rem] mr-1 shadow-2xl hidden sm:hidden md:hidden lg:flex'>
        <h2 className='font-bold'>Trend for you</h2>
      {trendData.map((data, key) => (
        <div className='flex flex-col gap-[0.5rem]' key={key}>
          <span className='font-bold'>#{data.name}</span>
          <span className='text-[13px]'>#{data.shares} <span>shares</span></span>
        </div>
      ))}
    </div>
  );
};

export default TrendCard;
