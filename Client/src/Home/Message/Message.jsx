import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { BsPencilSquare, BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import { userChats } from "../../features/home/api/ChatRequests";
import Conversation from "./Conversation";
import Chat from "./Chat";
import { io } from "socket.io-client";
const Message = () => {
  const user = useSelector((state) => state.authReducer.authData.user);
  const [chats, setChats] = useState([]);
  const [sendMessage, setsendMessage] = useState(null);
  const [sendTyping, setsendTyping] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [currentChat, setcurrentChat] = useState(null);
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showList, setShowList] = useState(true);
  const [typingStatus, setTypingStatus] = useState({});
  useEffect(() => {
    const socketInstance = io("http://localhost:8800");
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
    socketInstance.on("get-users", handleUsers);
    socketInstance.on("recieve-message", handleMessage);
    socketInstance.on("typing-status", handleTyping);
    return () => {
      socketInstance.off("get-users", handleUsers);
      socketInstance.off("recieve-message", handleMessage);
      socketInstance.off("typing-status", handleTyping);
      socketInstance.disconnect();
    };
  }, [user]);
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };
    getChats();
  }, [user]);
  useEffect(() => {
    if (!socket.current || !sendMessage) {
      return;
    }
    socket.current.emit("send-message", sendMessage);
  }, [sendMessage]);
  useEffect(() => {
    if (!socket.current || !sendTyping) {
      return;
    }
    socket.current.emit("typing", sendTyping);
  }, [sendTyping]);
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const updateLayout = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktop(desktop);
      setShowList(desktop ? true : !currentChat);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [currentChat]);
  const handleChatSelect = (chat) => {
    setcurrentChat(chat);
    if (!isDesktop) {
      setShowList(false);
    }
  };
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pb-12 lg:px-8">
      <div className="grid min-h-[70vh] grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
        <div
          className={`${
            showList ? "flex" : "hidden lg:flex"
          } flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm`}
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
            <div className="flex items-center gap-3">
              <Link
                to="../home"
                className="text-[var(--color-text-muted)] transition hover:text-[var(--color-text-base)] lg:hidden"
              >
                <BsArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold text-[var(--color-text-base)]">Messages</h1>
            </div>
            <Link
              to="../home"
              className="hidden text-[var(--color-text-muted)] transition hover:text-[var(--color-text-base)] lg:flex"
            >
              <BsPencilSquare className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 && (
              <div className="px-5 py-10 text-sm font-medium text-[var(--color-text-muted)]">
                No conversations yet.
              </div>
            )}
            {chats.map((chat, id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleChatSelect(chat)}
                className={`w-full border-b border-[var(--color-border)] px-5 text-left transition ${
                  currentChat?._id === chat._id
                    ? "bg-[var(--color-border)]/40"
                    : "bg-[var(--color-surface)]"
                } hover:bg-[var(--color-border)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]`}
              >
                <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
              </button>
            ))}
          </div>
        </div>
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
    </div>
  );
};

export default Message;
