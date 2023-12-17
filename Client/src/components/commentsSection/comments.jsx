import React, { useState } from "react";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { commentInthePost,getTimelinePosts } from "../../Home/action/PostAction";
const comments = ({ postId, userId, userName }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const handleInputChange = (e) => {
    setComment(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      userId: userId,
      username: userName,
      message: comment,
    };
    try {
      dispatch(commentInthePost(postId, postData));
      // dispatch(getTimelinePosts(userId));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="flex  flex-row items-center justify-between gap-2 "
      >
        <input
          type="text"
          placeholder="Add a comment"
          className=" input input-sm input-white m-auto w-[100%] input-bordered
          "
          value={comment}
          required
          onChange={handleInputChange}
        />
        <button type="submit" className="btn btn-sm ">
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
};

export default comments;
