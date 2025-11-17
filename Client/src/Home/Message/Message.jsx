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
  const [isDesktop, setIsDesktop] = useState(false);
  const [showList, setShowList] = useState(true);
  const [typingStatus, setTypingStatus] = useState({});
  const [incomingCall, setIncomingCall] = useState(null);
  const [setsendTyping, setSetsendTyping] = useState(null);
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:8800";
    const socketInstance = io(socketUrl);
    socket.current = socketInstance;
    socketInstance.emit("new-user-add", user._id);
    const handleUsers = (users) => setOnlineUsers(users);
    const handleMessage = (data) => setRecieveMessage(data);
    const handleTyping = (data) => {
      if (!data || !data.chatId) {
        return;
      }
      setTypingStatus((prev) => ({
        ...prev,
        [data.chatId]: data.isTyping ? data.senderId : null,
      }));
    };
    const handleIncomingCall = async (data) => {
      try {
        const { getUser } = await import("../../features/home/api/UserRequests");
        const response = await getUser(data.senderId);
        setIncomingCall({
          ...data,
          sender: response.data,
        });
      } catch (error) {
        setIncomingCall(data);
      }
    };
    socketInstance.on("get-users", handleUsers);
    socketInstance.on("recieve-message", handleMessage);
    socketInstance.on("typing-status", handleTyping);
    socketInstance.on("incoming-call", handleIncomingCall);
    return () => {
      socketInstance.off("get-users", handleUsers);
      socketInstance.off("recieve-message", handleMessage);
      socketInstance.off("typing-status", handleTyping);
      socketInstance.off("incoming-call", handleIncomingCall);
      socketInstance.disconnect();
    };
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
             <Link to='../home' className='hidden sm:hidden md:block lg:block '><BsPencilSquare /></Link> 
             <span className=" text-sm font-bold md:hidden ">Inbox</span>
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
        <div
          className={`${
            showList && !isDesktop ? "hidden" : "flex"
          } min-h-[60vh] flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm`}
        >
          {currentChat ? (
            <>
              {!isDesktop && (
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                  <button
                    type="button"
                    className="text-[var(--color-text-muted)] transition hover:text-[var(--color-text-base)]"
                    onClick={() => setShowList(true)}
                  >
                    <BsArrowLeft className="h-5 w-5" />
                  </button>
                  <p className="text-sm font-medium text-[var(--color-text-muted)]">Conversation</p>
                  <span className="h-5 w-5" />
                </div>
              )}
              <Chat
                chat={currentChat}
                currentUser={user._id}
                setsendMessage={setsendMessage}
                recieveMessage={recieveMessage}
                setsendTyping={setsendTyping}
                typingUserId={currentChat ? typingStatus[currentChat._id] : null}
                socket={socket.current}
                onIncomingCall={(call) => {
                  if (call) {
                    setIncomingCall(call);
                  } else {
                    setIncomingCall(null);
                  }
                }}
              />
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-[var(--color-text-muted)]">
              <p className="text-2xl font-semibold text-[var(--color-text-base)]">Your Messages</p>
              <p className="text-sm">Send private messages to friends and followers.</p>
            </div>
          )}
        </div>
      </div>

      {/* <div className="hidden bg-blue-50 sm:hidden md:hidden lg:block"></div> */}
    </div>
  );
};

export default Message;
