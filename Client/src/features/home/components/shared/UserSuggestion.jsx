import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { followUser, unfollowUser } from '../../api/UserRequests';
import { createChat } from '../../api/ChatRequests';
import { FOLLOW_USER, UNFOLLOW_USER, SAVE_USER } from '../../../../redux/actionTypes';
import { assetUrl } from '../../../../utils/assets';

const UserSuggestion = ({ person }) => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const followerIds = Array.isArray(person.followers) ? person.followers : [];
  const userId = user?._id;
  const [isFollowing, setIsFollowing] = useState(() => (userId ? followerIds.includes(userId) : false));

  if (!userId) {
    return null;
  }

  const toggleFollow = () => {
    const payload = { senderId: userId, receiverId: person._id };
    setIsFollowing((prev) => !prev);

    if (isFollowing) {
      unfollowUser(person._id, user);
      dispatch({ type: UNFOLLOW_USER, data: person._id });
    } else {
      followUser(person._id, user);
      dispatch({ type: FOLLOW_USER, data: person._id });
      dispatch({ type: SAVE_USER, data: payload });
      createChat(payload);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <Link
        to={`/profile/${person._id}`}
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <img
          src={assetUrl(person.profilePicture, 'defaultProfile.png')}
          alt={[person.firstname, person.lastname].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User'}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--color-border)]"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-[var(--color-text-base)]">
            {[person.firstname, person.lastname].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User'}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">@{person.email?.split('@')[0] || 'user'}</span>
        </div>
      </Link>
      <button
        type="button"
        onClick={toggleFollow}
        className={`inline-flex min-w-[96px] items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
          isFollowing
            ? 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-base)] hover:bg-[var(--color-border)]/30'
            : 'border border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[#1d4ed8]'
        }`}
      >
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};

export default UserSuggestion;

