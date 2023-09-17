import React from 'react'
import Left from './leftSide/side';
import Right from './RightSide/right';
import Middle from './middle/middle';
const handler = () => {
  return (
    <>
      <div className=' ml-3 mr-3 grid gap-[1rem] grid-cols-1 sm:grid-cols-1 md:grid-cols-[auto,15rem] lg:grid-cols-[20rem,auto,20rem]  xl:grid-cols-[40rem,auto ,35rem]'>
        <Left />
        
        <div className='overflow-y-auto h-[calc(100vh-2rem)]'>
          <style>
            {`
          /* Remove the scrollbar */
          ::-webkit-scrollbar {
            width: 0;
            height: 0;
            background-color: transparent;
          }
        `}
          </style>
          <Middle />

        </div>
        <div className='overflow-y-auto h-[calc(100vh-2rem)]'>
          <style>
            {`
          /* Remove the scrollbar */
          ::-webkit-scrollbar {
            width: 0;
            height: 0;
            background-color: transparent;
          }
        `}
          </style>
          <Right/>

        </div>



      </div>



    </>
  )
}

export default handler