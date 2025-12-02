import React from "react";
import { BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { GiWhaleTail } from "react-icons/gi";
const logoSearch = () => {
  return (
    <div className="flex gap-[0.35rem] mt-4 mb-5 ">
      <h1 className="pt-1 ml-[10px] w-[10%] text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hidden sm:hidden md:hidden lg:hidden">
        <Link to="../home">
          <i>Folkslet</i>
        </Link>
      </h1>
      <Link
        to="../home"
        className="text-3xl   border-2 rounded-full p-1 bg-[var(--color-primary)] text-[var(--color-on-primary)]  hidden sm:hidden md:block lg:block border-[var(--color-border)]"
      >
        <GiWhaleTail />
      </Link>
      <div className="flex  w-[80%] bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl p-[3px]">
        <input
          className="p-1 bg-transparent border-none outline-none text-[var(--color-text-base)] placeholder:text-[var(--color-text-muted)]"
          type="text"
          placeholder="#Explore"
        />
        <div className=" flex w-[70%] text-center items-center justify-center text-[var(--color-text-muted)]">
          <BiSearch />
        </div>
      </div>
    </div>
  );
};

export default logoSearch;
