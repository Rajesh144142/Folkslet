import React from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { GiWhaleTail } from "react-icons/gi";
const logoSearch = () => {
  return (
    <div className="flex gap-[0.35rem] mt-4 mb-5 ">
      <h1 className="pt-1 ml-[10px] w-[10%] text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 hidden sm:hidden md:hidden lg:hidden">
        <Link to="../home">
          <i>Folkslet</i>
        </Link>
      </h1>
      <Link
        to="../home"
        className="text-3xl   border-2 rounded-full p-1 bg-blue-600 text-white  hidden sm:hidden md:block lg:block"
      >
        <GiWhaleTail />
      </Link>
      <div className="flex  w-[80%] bg-slate-300 rounded-xl p-[3px]">
        <input
          className="p-1 bg-transparent border-none outline-none"
          type="text"
          placeholder="#Explore"
        />
        <div className=" flex w-[70%] text-center items-center justify-center ">
          <BiSearch />
        </div>
      </div>
    </div>
  );
};

export default logoSearch;
