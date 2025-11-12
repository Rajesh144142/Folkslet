import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import ProfileLeft from './ProfileLeft';
import PostComposer from '../../features/home/components/middle/PostComposer';
import PostList from '../../features/home/components/middle/PostList';
import { assetUrl } from '../../utils/assets';

const ProfileSection = () => {
  const authData = useSelector((state) => state.authReducer.authData);
  const postsState = useSelector((state) => state.postReducer.posts);
  const user = authData?.user;
  const posts = Array.isArray(postsState) ? postsState : [];

  if (!user) {
    return null;
  }

  const totalPosts = posts.reduce((count, post) => (post?.userId === user._id ? count + 1 : count), 0);
  const fullName = [user.firstname, user.lastname].filter(Boolean).join(' ').trim() || user.username || 'User';
  const about = user.about?.trim() || 'Write about yourself';
  const followingCount = Array.isArray(user.following) ? user.following.length : 0;
  const followerCount = Array.isArray(user.followers) ? user.followers.length : 0;
  const coverSrc = assetUrl(user.coverPicture, 'BackgroundProfiledefault.jpg');
  const avatarSrc = assetUrl(user.profilePicture, 'defaultProfile.png');

  return (
    <div className="w-full ">
      <Grid container spacing={3} className="w-full">
        <Grid item xs={12}>
          <section className="w-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] shadow-xl">
            <div className="relative h-48 w-full sm:h-64 lg:h-80">
              <img src={coverSrc} alt={`${fullName} cover`} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-6 sm:px-10">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-[var(--color-surface)] bg-[var(--color-background)] shadow-lg sm:mx-0">
                  <img
                    src={avatarSrc}
                    alt={fullName}
                    className="h-28 w-28 rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="mt-20 flex flex-col gap-3 px-6 pb-8 text-center sm:mt-16 sm:px-10 sm:text-left">
              <h1 className="text-3xl font-semibold text-[var(--color-text-base)]">{fullName}</h1>
              <p className="text-sm text-[var(--color-text-muted)]">{about}</p>
              <div className="mt-6 grid w-full grid-cols-3 divide-x divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)]/60 backdrop-blur">
                <div className="flex flex-col items-center gap-1 py-5">
                  <span className="text-xl font-semibold text-[var(--color-primary)]">{followingCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Following
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 py-5">
                  <span className="text-xl font-semibold text-[var(--color-accent)]">{followerCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 py-5">
                  <span className="text-xl font-semibold text-[var(--color-secondary)]">{totalPosts}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Posts
                  </span>
                </div>
              </div>
            </div>
          </section>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ProfileLeft />
        </Grid>
        <Grid item xs={12} lg={8}>
          <div className="flex flex-col gap-4">
            <PostComposer />
            <PostList />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileSection;
