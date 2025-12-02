import React from 'react';
import Postshare from './postshare';
import Posts from './Posts';

const Middle = () => {
  return (
    <div className='p-5 flex flex-col gap-[1rem] bg-[var(--color-background)]'>
     <Postshare />
      <Posts />
    </div>
  );
};

export default Middle;
