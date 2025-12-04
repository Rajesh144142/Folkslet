import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineArrowLeft } from 'react-icons/ai';

import * as UserApi from '../../features/home/api/UserRequests';
import UserSuggestion from '../../features/home/components/shared/UserSuggestion';

const FollowingList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer.authData);
  const profileUserId = params.id;
  const [profileUser, setProfileUser] = useState(null);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userResponse = await UserApi.getUser(profileUserId);
        const userData = userResponse.data;
        setProfileUser(userData);
        
        if (userData.following && userData.following.length > 0) {
          const allUsersResponse = await UserApi.getAllUsers();
          const responseData = allUsersResponse.data || {};
          const allUsers = responseData.users || responseData || [];
          const usersArray = Array.isArray(allUsers) ? allUsers : [];
          const followingList = usersArray.filter((u) => userData.following.includes(u._id));
          setFollowing(followingList);
        } else {
          setFollowing([]);
        }
      } catch (error) {
        setFollowing([]);
      } finally {
        setLoading(false);
      }
    };

    if (profileUserId) {
      fetchData();
    }
  }, [profileUserId]);

  if (!user) {
    return null;
  }

  const fullName = profileUser
    ? [profileUser.firstname, profileUser.lastname].filter(Boolean).join(' ').trim() || profileUser.email?.split('@')[0] || 'User'
    : 'User';

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pb-12 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-full border border-[var(--color-border)] p-2 text-[var(--color-text-base)] transition hover:bg-[var(--color-border)]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <AiOutlineArrowLeft className="text-xl" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-[var(--color-text-base)]">{fullName}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">Following</p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
          {loading ? (
            <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">Loading...</div>
          ) : following.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">Not following anyone yet</div>
          ) : (
            <div className="flex flex-col gap-4">
              {following.map((person) => (
                <UserSuggestion key={person._id} person={person} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowingList;

