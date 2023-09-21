import React from "react";
import { Link } from "react-router-dom";
const Upcomingfeatures = () => {
  return (
    <div>
      <Link to="../home" className="absolute top-2 left-6 p-2 bg-slate-100 rounded-lg hover:text-lg hidden lg:block">Back to home</Link>

      <div class="flex justify-center items-center h-screen">
        <p class="text-center text-3xl  md:text-4xl"> This Feature Is Coming Soon</p>
      </div>
    </div>
  );
};

export default Upcomingfeatures;
