import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from 'react-router-dom';
import { BsPencilSquare, BsArrowLeft } from "react-icons/bs";
import { HiOutlineChatBubbleLeftEllipsis } from 'react-icons/hi2';
import { useSelector } from "react-redux";
import { userChats } from "../api/ChatRequests";
import Conversation from "./Conversation";
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
  
  const handleSendTyping = useCallback((typingData) => {
    if (socket.current && typingData) {
      socket.current.emit('typing', typingData);
    }
  }, []);
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
  const fetchChats = useCallback(async () => {
    try {
      const response = await userChats(user._id);
      const chatsData = Array.isArray(response?.data) ? response.data : [];
      setChats(chatsData);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchChats();
    }
  }, [user?._id, fetchChats]);

  useEffect(() => {
    const handleChatCreated = () => {
      if (user?._id) {
        fetchChats();
      }
    };
    window.addEventListener('chatCreated', handleChatCreated);
    return () => window.removeEventListener('chatCreated', handleChatCreated);
  }, [user?._id, fetchChats]);

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
    if (!chat?.members || !user?._id) {
      return false;
    }
    const chatMember = chat.members.find((member) => {
      const memberId = typeof member === 'object' ? member._id?.toString() || member.id?.toString() : member?.toString();
      const currentUserId = user._id?.toString();
      return memberId && memberId !== currentUserId;
    });
    if (!chatMember) {
      return false;
    }
    const memberId = typeof chatMember === 'object' ? chatMember._id?.toString() || chatMember.id?.toString() : chatMember?.toString();
    const online = onlineUsers.find((onlineUser) => onlineUser.userId === memberId);
    return !!online;
  };

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-4 pb-12 lg:flex-row lg:px-8">
      <div className="flex w-full flex-col gap-6 lg:max-w-sm">
        <header className="flex flex-wrap items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-2xl text-[var(--color-on-primary)]">
            <HiOutlineChatBubbleLeftEllipsis />
          </span>
          <div className="mr-auto flex flex-col gap-1">
            <h1 className="text-3xl font-semibold text-[var(--color-text-base)]">Messages</h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              Send private messages to friends and followers.
            </p>
          </div>
          <Link
            to="/home"
            className="hidden rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-border)]/30 lg:inline-flex items-center gap-2"
          >
            <BsPencilSquare />
            <span>New</span>
          </Link>
        </header>

        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          {chats.length === 0 ? (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
              No conversations yet. Start chatting with friends and followers.
            </div>
          ) : (
            chats.map((chat) => {
              const chatId = chat._id || chat.id;
              const isSelected = currentChat && (currentChat._id === chatId || currentChat.id === chatId);
              return (
                <div
                  key={chatId}
                  onClick={() => {
                    setcurrentChat(chat);
                    setShowList(false);
                  }}
                  className={`cursor-pointer rounded-3xl border p-4 shadow-sm transition hover:shadow-md ${
                    isSelected
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/30'
                  }`}
                >
                  <Conversation
                    data={chat}
                    currentUser={user._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex w-full flex-col lg:flex-[2]">
        <div
          className={`${
            showList && !isDesktop ? "hidden" : "flex"
          } min-h-[60vh] flex-col rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] shadow-xl`}
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
                setsendTyping={handleSendTyping}
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
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-border)] bg-[var(--color-background)]">
                <HiOutlineChatBubbleLeftEllipsis className="text-4xl text-[var(--color-text-muted)]" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-[var(--color-text-base)]">Your Messages</p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Select a conversation to start messaging or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
