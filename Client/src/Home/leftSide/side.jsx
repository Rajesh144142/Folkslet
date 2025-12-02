import React from "react";
import { Link } from "react-router-dom";
import LogoSearch from "./logoSearch";
import { useDispatch, useSelector } from "react-redux";

const side = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const serverPublic = import.meta.env.VITE_PUBLIC_FOLDER;
  return (
    <>
      {/* <LogoSearch/> */}
      <div className="flex-col gap-4 hidden sm:hidden md:hidden lg:flex">
        <LogoSearch />
        <div className="p-1 h-[580px] shadow-2xl flex flex-col gap-[1rem] overflow-x-clip rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)]">
          <div className="flex flex-col justify-center items-center gap-[1rem]">
            <img
              className="w-full h-[12.8rem] object-cover"
              src={serverPublic + (user.coverPicture || "BackgroundProfiledefault.jpg")}
              alt="Cover"
              loading="lazy"
              onError={(e) => {
                if (!e.target.dataset.fallbackSet) {
                  e.target.dataset.fallbackSet = 'true';
                  e.target.src = serverPublic + "BackgroundProfiledefault.jpg";
                }
              }}
            />
            <img
              className="border-4 border-[var(--color-surface)] bg-[var(--color-surface)] w-[7rem] h-[7rem] top-[14.7rem] absolute rounded-[50%] shadow-2xl object-cover"
              src={serverPublic + (user.profilePicture || "defaultProfile.png")}
              alt="Profile"
              loading="lazy"
              onError={(e) => {
                if (!e.target.dataset.fallbackSet) {
                  e.target.dataset.fallbackSet = 'true';
                  e.target.src = serverPublic + "defaultProfile.png";
                }
              }}
            />
          </div>
          <div className="flex flex-col items-center mt-[3rem] gap-[10px]">
            <span className="font-bold text-2xl text-[var(--color-text-base)]">
              {[user.firstname, user.lastname].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-center text-[var(--color-text-muted)]">
              {user.about ? user.about : " Write About YourSelf"}
            </span>
          </div>
          <div>
            <div className="m-auto w-[80%] border-[1px] border-[var(--color-border)]">
              <hr />
            </div>

            <div className="flex flex-row items-center justify-around gap-[0.1rem]">
              <div className="p-1 text-[13px] flex flex-col justify-center items-center text-[var(--color-text-muted)]">
                <span className="font-bold text-[var(--color-text-base)]">{Array.isArray(user.following) ? user.following.length : 0}</span>
                <span>Following</span>
              </div>
              <div className="border-[1.6px] border-[var(--color-border)] h-8"></div>
              <div className="p-1 text-[13px] flex flex-col justify-center items-center text-[var(--color-text-muted)]">
                <span className="font-bold text-[var(--color-text-base)]">{Array.isArray(user.followers) ? user.followers.length : 0}</span>
                <span>Followers</span>
              </div>
            </div>
            <div className="m-auto w-[80%] border-[1px] border-[var(--color-border)] mb-3">
              <hr />
            </div>
          </div>
          <span className="text-center font-bold text-[var(--color-primary)] border-2 border-[var(--color-border)] rounded-2xl cursor-pointer m-auto w-[95%] p-3 hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition">
            <Link to={`/profile/${user._id}`}>My profile</Link>
          </span>
        </div>
      </div>
    </>
  );
};

export default side;
