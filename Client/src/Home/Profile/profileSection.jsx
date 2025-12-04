import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import ProfileLeft from './ProfileLeft';
import PostComposer from '../../features/home/components/middle/PostComposer';
import PostList from '../../features/home/components/middle/PostList';
import { assetUrl } from '../../utils/assets';
import * as UserApi from '../../features/home/api/UserRequests';
import { subscribeToUser, unsubscribeFromUser, addRealtimeListener } from '../../realtime/client';

const ProfileSection = () => {
  const authData = useSelector((state) => state.authReducer.authData);
  const postsState = useSelector((state) => state.postReducer.posts);
  const user = authData?.user;
  const posts = Array.isArray(postsState) ? postsState : [];
  const params = useParams();
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!profileUserId) {
        setProfileUser(user);
        return;
      }
      // Always fetch fresh data from the server to ensure accurate follower counts
      try {
        const profileDetails = await UserApi.getUser(profileUserId);
        const fetchedUser = profileDetails.data || profileDetails;
        // Use API counts (followersCount/followingCount) if available, fallback to arrays
        if (fetchedUser.followersCount === undefined && Array.isArray(fetchedUser.followers)) {
          fetchedUser.followersCount = fetchedUser.followers.length;
        }
        if (fetchedUser.followingCount === undefined && Array.isArray(fetchedUser.following)) {
          fetchedUser.followingCount = fetchedUser.following.length;
        }
        setProfileUser(fetchedUser);
      } catch (error) {
        console.error('Error fetching profile user:', error);
        // Fallback to Redux state if fetch fails
        if (profileUserId === user?._id) {
          setProfileUser(user);
        } else {
          setProfileUser(null);
        }
      }
    };
    if (user) {
      fetchProfileUser();
    }
  }, [profileUserId, user]);

  // Update profileUser when viewing own profile and Redux state changes (for real-time updates)
  useEffect(() => {
    if ((profileUserId === user?._id || !profileUserId) && user) {
      // Only update if we have fresh data from Redux (e.g., from real-time updates)
      // This ensures follower counts stay in sync
      setProfileUser((prev) => {
        if (!prev || !user) return prev || user;
        // Merge Redux state with current profileUser to preserve any additional data
        return {
          ...prev,
          followers: user.followers || prev.followers,
          following: user.following || prev.following,
        };
      });
    }
  }, [user?.followers, user?.following, profileUserId]);

  // Subscribe to real-time updates for the profile user
  useEffect(() => {
    if (!profileUserId || !user) {
      return;
    }
    
    // Subscribe to the profile user's updates
    subscribeToUser(profileUserId);
    
    // Listen for follower updates
    const handleFollowersUpdated = async (message) => {
      if (message?.userId === profileUserId) {
        // Refresh follow counts from API when followers are updated
        try {
          const profileDetails = await UserApi.getUser(profileUserId);
          const fetchedUser = profileDetails.data || profileDetails;
          setProfileUser((prev) => {
            if (!prev) return fetchedUser;
            return {
              ...prev,
              followersCount: fetchedUser.followersCount || prev.followersCount,
              followingCount: fetchedUser.followingCount || prev.followingCount,
            };
          });
        } catch (error) {
          console.error('Error refreshing follow counts:', error);
        }
      }
    };
    
    // Listen for following updates
    const handleFollowingUpdated = async (message) => {
      if (message?.userId === profileUserId) {
        // Refresh follow counts from API when following is updated
        try {
          const profileDetails = await UserApi.getUser(profileUserId);
          const fetchedUser = profileDetails.data || profileDetails;
          setProfileUser((prev) => {
            if (!prev) return fetchedUser;
            return {
              ...prev,
              followersCount: fetchedUser.followersCount || prev.followersCount,
              followingCount: fetchedUser.followingCount || prev.followingCount,
            };
          });
        } catch (error) {
          console.error('Error refreshing follow counts:', error);
        }
      }
    };
    
    const offFollowers = addRealtimeListener('followersUpdated', handleFollowersUpdated);
    const offFollowing = addRealtimeListener('followingUpdated', handleFollowingUpdated);
    
    return () => {
      unsubscribeFromUser(profileUserId);
      offFollowers();
      offFollowing();
    };
  }, [profileUserId, user]);

  if (!user || !profileUser) {
    return null;
  }

  const isOwnProfile = user._id === profileUserId || !profileUserId;
  const totalPosts = posts.reduce((count, post) => (post?.userId === profileUser._id ? count + 1 : count), 0);
  const firstName = profileUser.firstname || profileUser.firstName;
  const lastName = profileUser.lastname || profileUser.lastName;
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || profileUser.email?.split('@')[0] || 'User';
  const about = profileUser.about?.trim() || 'Write about yourself';
  const followingCount = profileUser.followingCount || (Array.isArray(profileUser.following) ? profileUser.following.length : 0);
  const followerCount = profileUser.followersCount || (Array.isArray(profileUser.followers) ? profileUser.followers.length : 0);
  const coverSrc = assetUrl(profileUser.coverPicture, 'BackgroundProfiledefault.jpg');
  const avatarSrc = assetUrl(profileUser.profilePicture, 'defaultProfile.png');

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
                <Link
                  to={`/profile/${profileUser._id}/following`}
                  className="flex flex-col items-center gap-1 py-5 transition hover:bg-[var(--color-background)]/80"
                >
                  <span className="text-xl font-semibold text-[var(--color-primary)]">{followingCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Following
                  </span>
                </Link>
                <Link
                  to={`/profile/${profileUser._id}/followers`}
                  className="flex flex-col items-center gap-1 py-5 transition hover:bg-[var(--color-background)]/80"
                >
                  <span className="text-xl font-semibold text-[var(--color-accent)]">{followerCount}</span>
                  <span className="text-xs font-medium uppercase tracking-widest text-[var(--color-text-muted)]">
                    Followers
                  </span>
                </Link>
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
            {isOwnProfile && <PostComposer />}
            <PostList />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfileSection;
