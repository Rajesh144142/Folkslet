import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { assetUrl } from '../../../../utils/assets';

const LeftSidebar = () => {
  const authState = useSelector((state) => state.authReducer.authData);
  const user = authState?.user;
  const profileData = useMemo(() => {
    if (!user) {
      return null;
    }

    const name = [user.firstname, user.lastname].filter(Boolean).join(' ').trim() || user.email?.split('@')[0] || 'User';
    const about = user.about?.trim() || 'Write about yourself';
    const cover = assetUrl(user.coverPicture, 'BackgroundProfiledefault.jpg');
    const avatar = assetUrl(user.profilePicture, 'defaultProfile.png');
    const followers = Array.isArray(user.followers) ? user.followers.length : 0;
    const following = Array.isArray(user.following) ? user.following.length : 0;
    const profileUrl = user._id ? `/profile/${user._id}` : '/';

    return { name, about, cover, avatar, followers, following, profileUrl };
  }, [user]);

  if (!profileData) {
    return null;
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

