import React, { useEffect, useState, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import {Link}from 'react-router-dom'
import { BsPencilSquare,BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userChats } from "../api/ChatRequests";
import Conversation from "./Conversation"; // Import the Conversation component
import Chat from "./Chat";
import { io } from "socket.io-client";
const Message = () => {
  const user = useSelector((state) => state.authReducer.authData.user);
  const [chats, setChats] = useState([]);
  const [sendMessage, setsendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [currentChat, setcurrentChat] = useState(null);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket.current = io("http://localhost:8800");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      // console.log(users)
      setOnlineUsers(users);
    });
  }, [user]);
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      setRecieveMessage(data);
    });
  }, []);
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className=" grid  grid-cols-[6rem,auto] sm:grid-cols-[4.3rem,7rem,auto] md:grid-cols-[4.4rem,21rem,auto] lg:grid-cols-[4.4rem,23rem,auto]   ">
      <div className="hidden  sm:block md:block lg:block"></div>
      <div className="overflow-y-auto h-[calc(100vh-2rem)]">
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
        <div className=" flex flex-col  ">
          {/* <div className=" justify-center m-auto w-[18rem]  bg-white  items-center mt-5 border-[2px] border-black  rounded-md hidden sm:hidden md:flex lg:flex">
          <input
            type="text"
            className="p-2 outline-none bg-white "
            placeholder="#Explore"
          />
          <div className=" text-center  p-2  ">
            <BiSearch />
          </div>
        </div> */}
          <div className="m-auto w-[100%] min-h-[350px] mt-7 flex flex-col">
            <div className="flex justify-center md:justify-between lg:justify-between items-center p-1">
              <h2 className="text-lg text-black font-bold hidden md:block lg:block   ">
                Messages
              </h2>
              <span className="text-2xl ">
              <Link to='../home' className="block sm:hidden md:hidden lg:hidden"> <BsArrowLeft/></Link>
             <Link to='../home' className='hidden sm:block md:block lg:block '><BsPencilSquare /></Link> 
              </span>
            </div>
            {chats.map((chat, id) => (
              <div key={id} onClick={() => setcurrentChat(chat)}>
                {/* Render the Conversation component with chat data */}
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-2rem)]">
        <style>
          {`
       
        `}
        </style>
        <div className="text-center">
          <Chat
            chat={currentChat}
            currentUser={user._id}
            setsendMessage={setsendMessage}
            recieveMessage={recieveMessage}
          />
        </div>
      </div>

      {/* <div className="hidden bg-blue-50 sm:hidden md:hidden lg:block"></div> */}
    </div>
  );
};

export default Message;
