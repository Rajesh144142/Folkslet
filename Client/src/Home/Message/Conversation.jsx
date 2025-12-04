import React, { useState, useEffect } from "react";
import { getUser } from "../../features/home/api/UserRequests";
import { useDispatch } from "react-redux";
import { SAVE_USER } from "../../redux/actionTypes";
import { assetUrl } from "../../utils/assets";
const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!data?.members || !currentUser) {
      return;
    }
    
    const otherMember = data.members.find((member) => {
      const memberId = typeof member === 'object' ? member._id?.toString() || member.id?.toString() : member?.toString();
      const currentUserId = currentUser?.toString();
      return memberId && memberId !== currentUserId;
    });
    
    if (!otherMember) {
      return;
    }
    
    const userId = typeof otherMember === 'object' ? otherMember._id || otherMember.id : otherMember;
    
    if (typeof otherMember === 'object' && otherMember.firstName) {
      setUserData(otherMember);
      dispatch({ type: SAVE_USER, data: otherMember });
      return;
    }
    
    const getUserData = async () => {
      try {
        const response = await getUser(userId);
        const userData = response?.data || response;
        if (userData) {
          setUserData(userData);
          dispatch({ type: SAVE_USER, data: userData });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    getUserData();
  }, [currentUser, data, dispatch]);
  const fullName = [userData?.firstName, userData?.lastName].filter(Boolean).join(" ") || userData?.email?.split('@')[0] || "Unknown user";
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <img
          src={assetUrl(userData?.profilePicture, "defaultProfile.png")}
          alt={fullName || "profile"}
          className="h-12 w-12 rounded-full border border-[var(--color-border)] object-cover"
          loading="lazy"
        />
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--color-surface)] ${
            online ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"
          }`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-sm font-semibold text-[var(--color-text-base)] truncate">
          {fullName || "Unknown user"}
        </span>
        <span className="text-xs font-medium text-[var(--color-text-muted)]">
          {online ? "Active now" : "Offline"}
        </span>
      </div>
    </div>
  );
};
export default Conversation;