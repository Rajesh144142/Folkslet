import React, { useState, useEffect, useRef } from "react";
import { getUser } from "../api/UserRequests";
import { PiMessengerLogoLight } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { BsCameraVideo } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { AiOutlineSend, AiOutlinePlusSquare } from "react-icons/ai";
import { addMessage, getMessages } from "../api/MessageRequests";
import { format } from "timeago.js"; // Import the time formatting library
import InputEmoji from "react-input-emoji";
import { Link } from "react-router-dom";

const Chat = ({ chat, currentUser, setsendMessage, recieveMessage }) => {
  // Get user data from Redux store
  const user = useSelector((state) => state.authReducer.authData.user);

  // State to hold user data, messages, and new message input
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  // Path to the public folder (assuming you're using Vite)
  const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER;
  useEffect(() => {
    if (recieveMessage !== null && recieveMessage.chatId === chat._id) {
      setMessages({ ...messages, recieveMessage });
    }
  }, [recieveMessage]);
  // Effect to fetch user data based on the chat members
  useEffect(() => {
    // Find the other user in the chat
    const userId = chat?.members?.find((id) => id !== currentUser);

    // Fetch user data
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch user data when the chat or currentUser changes
    if (chat != null) {
      getUserData();
    }
  }, [chat, currentUser]);

  // Effect to fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    // Fetch messages when the chat or currentUser changes
    if (chat != null) {
      fetchMessages();
    }
  }, [chat, currentUser]);

  // Handle input change for the new message
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };
    if (!message.text) {
      alert("You can't send an empty message..."); // Show an alert
      return;
    }
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    const recievedId = chat.members.find((id) => id !== currentUser);
    setsendMessage({ ...message, recievedId });
  };
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  });
  return (
    <>
      {/* Background divider */}
      <div className="bg-gray-300 top-0 bottom-0 absolute w-[0.1px] sm:block md:block lg:block"></div>

      {/* Render chat header and icons when chat exists */}
      {chat && (
        <div className="flex items-center justify-between self-end gap-[1rem] p-[0.8rem]   border-2 border-white  rounded-md bg-gray-50 ml-[6.1rem] sm:ml-[11.4rem] fixed md:ml-[25.5rem] lg:ml-[27.5rem] left-0  top-0 sm:top-0 md:top-0 lg:top-0  z-20 right-0   ">
          <div className="flex justify-around items-center gap-2">
            {/* Render user profile picture */}
            <img
              src={
                userData?.profilePicture
                  ? publicFolder + userData.profilePicture
                  : publicFolder + "defaultProfile.png"
              }
              alt="profile"
              className="w-[3.5rem] h-[3.5rem] rounded-[50%] border-[0.1px]"
            />
            <div className="flex flex-col justify-start ">
              <span className="flex justify-start gap-1">
                {/* Render user's first and last name */}
                <h1 className="font-bold">{userData?.firstname}</h1>
                <h1 className="font-bold">{userData?.lastname}</h1>
              </span>
            </div>
          </div>

          {/* Render call and video icons */}
          <div
            className="
           gap-3 justify-center items-center mr-4 hidden sm:flex md:flex lg:flex "
          >
            <Link to="/Upcoming" className="text-2xl hover:text-3xl">
              <IoCallOutline />
            </Link>
            <Link to="/Upcoming" className="text-2xl hover:text-3xl">
              <BsCameraVideo />
            </Link>
          </div>
        </div>
      )}

      {/* Render chat messages */}
      <div className="bg-gray-300 w-[100%] h-[0.1px]"></div>
      <div className="w-[95%] m-auto pb-[3rem] pt-[5rem]">
        {messages.map((message, id) => (
          <div
            ref={scroll}
            className={`
             ${
               message.senderId === currentUser
                 ? "chat chat-start "
                 : "chat chat-end"
             }  flex flex-col  
            `}
            key={id} // Provide a unique key for each message
          >
            <div>
              {/* Render sender's name */}
              {message.senderId === currentUser ? (
                <span className="chat-header">
                  {user.firstname} {user.lastname}
                </span>
              ) : (
                <span className="chat-header">
                  {userData?.firstname} {userData?.lastname}
                </span>
              )}
            </div>
            {message?.text && (
              // Render the message text
              <span className="chat-bubble">{message.text}</span>
            )}
            {message?.createdAt && (
              // Format and render message creation time using timeago.js
              <time className="text-xs opacity-50">
                {format(message.createdAt)}
              </time>
            )}
          </div>
        ))}
      </div>

      {/* Render new message input */}
      {chat && (
        <div className="flex items-center justify-between self-end gap-[1rem] p-[0.8rem]   border-2 border-white  rounded-md bg-gray-50 ml-[6.1rem] sm:ml-[11.4rem] fixed md:ml-[25.5rem] lg:ml-[27.5rem] left-0  bottom-0 sm:bottom-0 md:bottom-0 lg:bottom-0  right-0">
          <div className="">
            <Link to="/Upcoming" className="text-2xl hover:text-3xl">
              {" "}
              <AiOutlinePlusSquare />
            </Link>
          </div>
          <InputEmoji value={newMessage} onChange={handleChange} />
          <div className="text-2xl  hover:text-3xl  " onClick={handleSend}>
            <AiOutlineSend />
          </div>
        </div>
      )}

      {/* Render a placeholder when no chat exists */}
      {!chat && (
        <div className="flex flex-col h-[30rem] md:h-[25rem] justify-center items-center">
          <div className="border-[3px] rounded-full p-3 mt-2 border-black">
            <div className="text-5xl sm:text-6xl md:text-6xl lg:text-6xl">
              <PiMessengerLogoLight />
            </div>
          </div>
          <h1 className="text-lg">Your Messages</h1>
          <h1 className="font-xs">
            Send private photos and messages to a friend or group
          </h1>
        </div>
      )}
    </>
  );
};

export default Chat;
