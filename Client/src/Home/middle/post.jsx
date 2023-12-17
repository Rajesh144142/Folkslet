import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // Import useSelector
import { PiShareFatBold } from "react-icons/pi";
import { AiOutlineHeart, AiOutlineMessage, AiFillHeart } from "react-icons/ai";
import { likePost } from "../api/PostsRequests";
import { getAllUser } from "../api/UserRequests.jsx";
import { useLocation } from "react-router-dom";
import { format } from "timeago.js"; // Import the time formatting library
import { Link } from "react-router-dom";
import Comments from "../../components/commentsSection/comments";
import ShowComents from "../../components/commentsSection/showComents";
const Post = ({ data }) => {
  // cosnt[liked,setlike]=useState(true)
  // Use the useSelector hook to access the user object from the Redux store
  const user = useSelector((state) => state.authReducer.authData.user);

  const location = useLocation();
  const home = location.pathname === "/home";
  // Ensure that data.likes is always an array
  const [allcomment, setallComment] = useState(false);
  const initialLikes = Array.isArray(data.likes) ? data.likes : [];
  const [liked, setLiked] = useState(initialLikes.includes(user?._id));
  const [likes, setLikes] = useState(initialLikes.length);
  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
  };

  const [persons, setPersons] = useState([]);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const { data } = await getAllUser();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPersons();
  }, []);

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
        {data.image ? (
          <div className="flex flex-col p-[1rem] shadow-md m-auto w-[97%] bg-white  rounded-3xl gap-[1rem] sm:w-[80%] ">
            {persons.map((person) => {
              if (person._id === data.userId) {
                return (
                  <div className="flex gap-3 items-center" key={person._id}>
                    <img
                      className="border-2 rounded-[50%] w-[2.5rem] h-[2.5rem]"
                      src={
                        person.profilePicture
                          ? serverPublic + person.profilePicture
                          : serverPublic + "defaultProfile.png"
                      }
                      alt="Profile"
                    />
                    <div>
                      <h1 className="text-xl">
                        {person.firstname} {person.lastname}
                      </h1>
                      <span className="text-sm text-gray-400">
                        {format(person.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              }
              return null; // Add this to return null for non-matching persons
            })}
            <div className={data.desc ? "text-blue" : "hidden"}>
              {data.desc}
            </div>
            <img
              className="w-full max-h-[30rem] object-cover rounded-[0.5rem]"
              src={
                data.image
                  ? import.meta.env.VITE_PUBLIC_FOLDER + data.image
                  : ""
              }
              alt="error"
            />
            <div className="flex text-2xl gap-[1.5rem] items-start">
              <div className="" onClick={handleLike}>
                {!liked ? (
                  <div className="">
                    <AiOutlineHeart />
                  </div>
                ) : (
                  <div className="text-red-700 ">
                    <AiFillHeart />
                  </div>
                )}
              </div>
              <div className="" onClick={handleComments}>
                <AiOutlineMessage />
              </div>
              <div className="">
                <Link to="/Upcoming">
                  <PiShareFatBold />
                </Link>
              </div>
            </div>
            <h1>{likes} likes</h1>
            <div className="">
              <Comments
                postId={data._id}
                userId={user._id}
                userName={user.username}
              />
            </div>
            <h1 className="pl-2 pt-1">Comments:</h1>

            <div>
              {allcomment ? <ShowComents postcomment={data.comments} /> : ""}
            </div>
          </div>
        ) : (
          <div className="flex flex-col p-[1rem] shadow-md m-auto w-[97%] bg-white  rounded-3xl gap-[1rem] sm:w-[80%] ">
            <div className=" flex flex-col justify-start">
              {persons.map((person) => {
                if (person._id === data.userId) {
                  return (
                    <div className="flex gap-3 items-center" key={person._id}>
                      <img
                        className="border-2 rounded-[50%] w-[2.5rem] h-[2.5rem]"
                        src={
                          person.profilePicture
                            ? serverPublic + person.profilePicture
                            : serverPublic + "defaultProfile.png"
                        }
                        alt="Profile"
                      />

                      <h1 className="text-xl">
                        {person.firstname} {person.lastname}
                      </h1>
                    </div>
                  );
                }
                return null; // Add this to return null for non-matching persons
              })}
              <span className=" text-xl p-3">{data.desc}</span>
            </div>
            <div>
              <div className="flex text-2xl gap-[1.5rem] p-1 items-start">
                <div className="" onClick={handleLike}>
                  {!liked ? (
                    <div className="">
                      <AiOutlineHeart />
                    </div>
                  ) : (
                    <div className="text-red-700 ">
                      <AiFillHeart />
                    </div>
                  )}
                </div>
                <div className="" onClick={handleComments}>
                  <AiOutlineMessage />
                </div>
                <div className="">
                  <Link to="/Upcoming">
                    <PiShareFatBold />
                  </Link>
                </div>
              </div>
              <h1 className="pl-2">{!likes ? 0 : likes} likes</h1>
              <div className="">
                <Comments
                  postId={data._id}
                  userId={user._id}
                  userName={user.username}
                />
              </div>
              <h1 className="pl-2 pt-1">Comments:</h1>

              <div>
                {allcomment ? <ShowComents postcomment={data.comments} /> : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
