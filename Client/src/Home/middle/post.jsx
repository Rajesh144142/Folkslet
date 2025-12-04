import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PiShareFatBold } from "react-icons/pi";
import { AiOutlineHeart, AiOutlineMessage, AiFillHeart } from "react-icons/ai";
import { likePost } from "../api/PostsRequests";
import { getAllUser } from "../api/UserRequests.jsx";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import Comments from "../../components/commentsSection/comments";
import ShowComents from "../../components/commentsSection/showComents";
import useRealtimePosts from "../../features/home/hooks/useRealtimePosts";

const Post = ({ data }) => {
  const user = useSelector((state) => state.authReducer.authData.user);
  const posts = useSelector((state) => state.postReducer.posts);
  const postId = data?._id || data?.id;
  
  useRealtimePosts([postId]);

  const location = useLocation();
  const home = location.pathname === "/home";
  
  const currentPost = posts.find((p) => (p._id === postId || p.id === postId)) || data;
  const postData = currentPost || data;
  
  const [allcomment, setallComment] = useState(false);
  const initialLikes = Array.isArray(postData.likes) ? postData.likes : [];
  const [liked, setLiked] = useState(initialLikes.includes(user?._id));
  const [likes, setLikes] = useState(initialLikes.length);
  
  useEffect(() => {
    const updatedLikes = Array.isArray(postData.likes) ? postData.likes : [];
    setLiked(updatedLikes.includes(user?._id));
    setLikes(updatedLikes.length);
  }, [postData.likes, user?._id]);

  useEffect(() => {
    const updatedPost = posts.find((p) => (p._id === postId || p.id === postId));
    if (updatedPost) {
      const updatedLikes = Array.isArray(updatedPost.likes) ? updatedPost.likes : [];
      setLiked(updatedLikes.includes(user?._id));
      setLikes(updatedLikes.length);
    }
  }, [posts, postId, user?._id]);
  const handleLike = () => {
    likePost(postId, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const [persons, setPersons] = useState([]);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser(user?._id);
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (user?._id) {
      fetchPersons();
    }
  }, [user?._id]);

  const handleComments = () => {
    setallComment(!allcomment);
  };

  return (
    <>
      <div className=" flex flex-col sm:flex-row  ">
        <div
          className={`w-[0] m-auto sm:${
            home ? "w-[6px]" : "hidden"
          } md:w-[6px] lg:hidden`}
        ></div>
        {postData.image ? (
          <div className="flex flex-col p-[1rem] shadow-md m-auto w-[97%] bg-[var(--color-surface)] rounded-3xl gap-[1rem] sm:w-[80%] border border-[var(--color-border)]">
            {persons.map((person) => {
              if (person._id === postData.userId) {
                return (
                  <div className="flex gap-3 items-center" key={person._id}>
                    <img
                      className="border-2 border-[var(--color-border)] rounded-[50%] w-[2.5rem] h-[2.5rem] object-cover"
                      src={
                        person.profilePicture
                          ? serverPublic + person.profilePicture
                          : serverPublic + "defaultProfile.png"
                      }
                      alt="Profile"
                    />
                    <div>
                      <h1 className="text-xl text-[var(--color-text-base)]">
                        {[person.firstname || person.firstName, person.lastname || person.lastName].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User'}
                      </h1>
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {format(person.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <div className={postData.desc ? "text-[var(--color-text-base)]" : "hidden"}>
              {postData.desc}
            </div>
            <img
              className="w-full max-h-[30rem] object-cover rounded-[0.5rem]"
              src={
                postData.image
                  ? import.meta.env.VITE_PUBLIC_FOLDER + postData.image
                  : ""
              }
              alt="error"
            />
            <div className="flex text-2xl gap-[1.5rem] items-start text-[var(--color-text-muted)]">
              <div className="cursor-pointer hover:text-[var(--color-primary)] transition" onClick={handleLike}>
                {!liked ? (
                  <div>
                    <AiOutlineHeart />
                  </div>
                ) : (
                  <div className="text-[var(--color-primary)]">
                    <AiFillHeart />
                  </div>
                )}
              </div>
              <div className="cursor-pointer hover:text-[var(--color-primary)] transition" onClick={handleComments}>
                <AiOutlineMessage />
              </div>
              <div className="cursor-pointer hover:text-[var(--color-primary)] transition">
                <Link to="/Upcoming">
                  <PiShareFatBold />
                </Link>
              </div>
            </div>
            <h1 className="text-[var(--color-text-base)]">{likes} likes</h1>
            <div className="">
              <Comments
                postId={postId}
                userId={user._id}
              />
            </div>
            <h1 className="pl-2 pt-1 text-[var(--color-text-base)]">Comments:</h1>

            <div>
              {allcomment ? <ShowComents postcomment={postData.comments || []} /> : ""}
            </div>
          </div>
        ) : (
          <div className="flex flex-col p-[1rem] shadow-md m-auto w-[97%] bg-[var(--color-surface)] rounded-3xl gap-[1rem] sm:w-[80%] border border-[var(--color-border)]">
            <div className="flex flex-col justify-start">
              {persons.map((person) => {
                if (person._id === postData.userId) {
                  return (
                    <div className="flex gap-3 items-center" key={person._id}>
                      <img
                        className="border-2 border-[var(--color-border)] rounded-[50%] w-[2.5rem] h-[2.5rem] object-cover"
                        src={
                          person.profilePicture
                            ? serverPublic + person.profilePicture
                            : serverPublic + "defaultProfile.png"
                        }
                        alt="Profile"
                      />
                      <h1 className="text-xl text-[var(--color-text-base)]">
                        {[person.firstname || person.firstName, person.lastname || person.lastName].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User'}
                      </h1>
                    </div>
                  );
                }
                return null;
              })}
              <span className="text-xl p-3 text-[var(--color-text-base)]">{postData.desc}</span>
            </div>
            <div>
              <div className="flex text-2xl gap-[1.5rem] p-1 items-start text-[var(--color-text-muted)]">
                <div className="cursor-pointer hover:text-[var(--color-primary)] transition" onClick={handleLike}>
                  {!liked ? (
                    <div>
                      <AiOutlineHeart />
                    </div>
                  ) : (
                    <div className="text-[var(--color-primary)]">
                      <AiFillHeart />
                    </div>
                  )}
                </div>
                <div className="cursor-pointer hover:text-[var(--color-primary)] transition" onClick={handleComments}>
                  <AiOutlineMessage />
                </div>
                <div className="cursor-pointer hover:text-[var(--color-primary)] transition">
                  <Link to="/Upcoming">
                    <PiShareFatBold />
                  </Link>
                </div>
              </div>
              <h1 className="pl-2 text-[var(--color-text-base)]">{!likes ? 0 : likes} likes</h1>
              <div className="">
                <Comments
                  postId={postId}
                  userId={user._id}
                />
              </div>
              <h1 className="pl-2 pt-1 text-[var(--color-text-base)]">Comments:</h1>

              <div>
                {allcomment ? <ShowComents postcomment={postData.comments || []} /> : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
