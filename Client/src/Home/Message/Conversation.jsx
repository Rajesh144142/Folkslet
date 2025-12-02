import React, { useState, useEffect } from "react";
import { getUser } from "../../features/home/api/UserRequests";
import { useDispatch } from "react-redux";
import { SAVE_USER } from "../../redux/actionTypes";
import { assetUrl } from "../../utils/assets";
const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const userId = data?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
        dispatch({ type: SAVE_USER, data });
      } catch (error) {
        console.error(error);
      }
    };
    getUserData();
  }, [currentUser, data, dispatch]);
  const fullName = [userData?.firstname, userData?.lastname].filter(Boolean).join(" ");
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