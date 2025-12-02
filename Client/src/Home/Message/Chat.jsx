import React, { useState, useEffect, useRef, useCallback } from "react";
import { getUser } from "../../features/home/api/UserRequests";
import { PiMessengerLogoLight } from "react-icons/pi";
import { useSelector } from "react-redux";
import { BsCameraVideo } from "react-icons/bs";
import { IoCallOutline } from "react-icons/io5";
import { AiOutlineSend } from "react-icons/ai";
import { addMessage, getMessages } from "../../features/home/api/MessageRequests";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { assetUrl } from "../../utils/assets";
import VideoCall from "./VideoCall";

const Chat = ({ chat, currentUser, setsendMessage, recieveMessage, setsendTyping, typingUserId, socket, onIncomingCall }) => {
  const user = useSelector((state) => state.authReducer.authData.user);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeCall, setActiveCall] = useState(null);
  const [localIncomingCall, setLocalIncomingCall] = useState(null);
  const scroll = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!socket || !chat) return;

    const handleIncomingCall = (data) => {
      const receiverId = chat?.members?.find((id) => id !== currentUser);
      if (data && receiverId === data.senderId) {
        setLocalIncomingCall(data);
        if (onIncomingCall) {
          onIncomingCall(data);
        }
      }
    };

    socket.on('incoming-call', handleIncomingCall);
    return () => {
      socket.off('incoming-call', handleIncomingCall);
    };
  }, [socket, chat, currentUser, onIncomingCall]);

  const emitTyping = useCallback(
    (isTyping) => {
      if (!chat) {
        return;
      }
      const receiverId = chat.members.find((id) => id !== currentUser);
      if (!receiverId) {
        return;
      }
      setsendTyping({
        chatId: chat._id,
        receiverId,
        senderId: currentUser,
        isTyping,
      });
    },
    [chat, currentUser, setsendTyping]
  );

  useEffect(() => {
    if (!recieveMessage || !chat || recieveMessage.chatId !== chat._id) {
      return;
    }
    setMessages((prev) => [...prev, recieveMessage]);
  }, [recieveMessage, chat]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (chat) {
      getUserData();
    }
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (chat) {
      fetchMessages();
    }
  }, [chat, currentUser]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
      }
      emitTyping(false);
    };
  }, [chat, emitTyping]);

  const handleInputChange = (value) => {
    setNewMessage(value);
    if (!chat) {
      return;
    }
    emitTyping(true);
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
    typingTimeout.current = setTimeout(() => {
      emitTyping(false);
      typingTimeout.current = null;
    }, 2000);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !chat) {
      return;
    }
    const message = {
      senderId: currentUser,
      text: newMessage.trim(),
      chatId: chat._id,
    };
    try {
      const { data } = await addMessage(message);
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
      const receiverId = chat.members.find((id) => id !== currentUser);
      setsendMessage({ ...message, receiverId });
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
      }
      emitTyping(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--color-surface)] px-6 text-center text-[var(--color-text-muted)]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--color-border)]">
          <PiMessengerLogoLight className="text-4xl" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-[var(--color-text-base)]">
            Select a conversation
          </p>
          <p className="text-sm">
            Choose a chat to see messages or start a new one.
          </p>
        </div>
      </div>
    );
  }

  const fullName = [userData?.firstname, userData?.lastname].filter(Boolean).join(" ");

  return (
    <div className="flex h-full flex-1 flex-col bg-[var(--color-surface)] rounded-3xl">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-4">
        <div className="flex items-center gap-3">
          <img
            src={assetUrl(userData?.profilePicture, "defaultProfile.png")}
            alt={fullName || "profile"}
            className="h-12 w-12 rounded-full border border-[var(--color-border)] object-cover"
            loading="lazy"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--color-text-base)]">
              {fullName || "Unknown user"}
            </span>
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              {userData?.username || ""}
            </span>
            {typingUserId && typingUserId !== currentUser && (
              <span className="text-xs font-medium text-[var(--color-primary)]">
                {(fullName || "Someone") + " is typing..."}
              </span>
            )}
          </div>
        </div>
        <div className="hidden items-center gap-4 text-xl text-[var(--color-text-muted)] sm:flex">
          <button
            onClick={() => setActiveCall({ type: 'audio', user: userData })}
            className="transition hover:text-[var(--color-text-base)]"
            disabled={!userData}
          >
            <IoCallOutline />
          </button>
          <button
            onClick={() => setActiveCall({ type: 'video', user: userData })}
            className="transition hover:text-[var(--color-text-base)]"
            disabled={!userData}
          >
            <BsCameraVideo />
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          {messages.map((message, index) => {
            const isOwn = message.senderId === currentUser;
            return (
              <div
                key={message._id || index}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                ref={index === messages.length - 1 ? scroll : null}
              >
                <span className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
                  {isOwn ? ([user.firstname, user.lastname].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'You') : fullName || "Unknown user"}
                </span>
                {message?.text && (
                  <span
                    className={`rounded-2xl border px-4 py-2 text-sm ${
                      isOwn
                        ? "border-[var(--color-primary)]/30 bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-border)]/40 text-[var(--color-text-base)]"
                    }`}
                  >
                    {message.text}
                  </span>
                )}
                {message?.createdAt && (
                  <time className="mt-1 text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">
                    {format(message.createdAt)}
                  </time>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <form
        onSubmit={handleSend}
        className="border-t border-[var(--color-border)] px-4 py-3"
      >
        <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2">
          <div className="flex-1">
            <InputEmoji
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message"
              borderColor="transparent"
            />
          </div>
          <button
            type="submit"
            className="text-xl text-[var(--color-primary)] transition hover:scale-110 hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <AiOutlineSend />
          </button>
        </div>
      </form>
      {activeCall && (
        <VideoCall
          callType={activeCall.type}
          remoteUser={activeCall.user}
          onEndCall={() => setActiveCall(null)}
          socket={socket}
          isIncoming={false}
        />
      )}
      {localIncomingCall && (
        <VideoCall
          callType={localIncomingCall.callType}
          remoteUser={localIncomingCall.sender || { _id: localIncomingCall.senderId, firstname: localIncomingCall.senderName }}
          onEndCall={() => {
            setLocalIncomingCall(null);
            if (onIncomingCall) {
              onIncomingCall(null);
            }
          }}
          socket={socket}
          isIncoming={true}
          offer={localIncomingCall.offer}
          onCallAccepted={() => {
            const senderUser = localIncomingCall.sender || { _id: localIncomingCall.senderId, firstname: localIncomingCall.senderName };
            setActiveCall({ type: localIncomingCall.callType, user: senderUser });
            setLocalIncomingCall(null);
            if (onIncomingCall) {
              onIncomingCall(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default Chat;
