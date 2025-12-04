import { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { assetUrl } from '../../../../utils/assets';
import ProfileCardSkeleton from '../skeletons/ProfileCardSkeleton';
import { getFollowCounts } from '../../api/UserRequests';

const LeftSidebar = () => {
  const authState = useSelector((state) => state.authReducer.authData);
  const user = authState?.user;
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (!user?._id) return;
      
      try {
        const response = await getFollowCounts(user._id);
        const data = response?.data || response;
        if (data) {
          setFollowCounts({
            followers: data.followersCount || 0,
            following: data.followingCount || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching follow counts:', error);
        // Fallback to Redux state
        setFollowCounts({
          followers: Array.isArray(user?.followers) ? user.followers.length : 0,
          following: Array.isArray(user?.following) ? user.following.length : 0,
        });
      }
    };

    fetchFollowCounts();

    // Listen for follow/unfollow events to refresh counts
    const handleFollowUpdate = () => {
      fetchFollowCounts();
    };

    window.addEventListener('userListRefresh', handleFollowUpdate);
    window.addEventListener('followersUpdated', handleFollowUpdate);
    window.addEventListener('followingUpdated', handleFollowUpdate);

    return () => {
      window.removeEventListener('userListRefresh', handleFollowUpdate);
      window.removeEventListener('followersUpdated', handleFollowUpdate);
      window.removeEventListener('followingUpdated', handleFollowUpdate);
    };
  }, [user?._id]);

  const profileData = useMemo(() => {
    if (!user) {
      return null;
    }

    const name = [user.firstname || user.firstName, user.lastname || user.lastName].filter(Boolean).join(' ').trim() || user.email?.split('@')[0] || 'User';
    const about = user.about?.trim() || 'Write about yourself';
    const cover = assetUrl(user.coverPicture, 'BackgroundProfiledefault.jpg');
    const avatar = assetUrl(user.profilePicture, 'defaultProfile.png');
    const profileUrl = user._id ? `/profile/${user._id}` : '/';

    return { name, about, cover, avatar, followers: followCounts.followers, following: followCounts.following, profileUrl };
  }, [user, followCounts]);

  if (!profileData) {
    return (
      <aside className="hidden flex-col gap-3 lg:flex">
        <ProfileCardSkeleton />
      </aside>
    );
  }

  return (
    <aside className="hidden flex-col gap-3 lg:flex">
      <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
        <div className="relative">
          <img 
            className="h-40 w-full object-cover" 
            src={profileData.cover} 
            alt="Cover" 
            loading="lazy"
            onError={(e) => {
              if (!e.target.dataset.fallbackSet) {
                e.target.dataset.fallbackSet = 'true';
                e.target.src = assetUrl('BackgroundProfiledefault.jpg');
              }
            }}
          />
          <img
            className="absolute left-1/2 top-24 h-24 w-24 -translate-x-1/2 rounded-full border-4 border-[var(--color-surface)] object-cover shadow-md"
            src={profileData.avatar}
            alt="Avatar"
            loading="lazy"
            onError={(e) => {
              if (!e.target.dataset.fallbackSet) {
                e.target.dataset.fallbackSet = 'true';
                e.target.src = assetUrl('defaultProfile.png');
              }
            }}
          />
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 px-6 pb-6 text-center">
          <p className="text-xl font-semibold text-[var(--color-text-base)]">{profileData.name}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{profileData.about}</p>
          <div className="my-4 grid w-full grid-cols-2 gap-4 border-y border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)]">
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-semibold text-[var(--color-text-base)]">{profileData.following}</span>
              <span>Following</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-base font-semibold text-[var(--color-text-base)]">{profileData.followers}</span>
              <span>Followers</span>
            </div>
          </div>
          <a
            href={profileData.profileUrl}
            className="mt-auto w-full rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            My profile
          </a>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;

