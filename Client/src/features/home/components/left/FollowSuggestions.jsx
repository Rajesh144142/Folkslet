import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import UserSuggestion from '../shared/UserSuggestion';
import { getAllUsers } from '../../api/UserRequests';
import CircleSkeleton from '../skeletons/CircleSkeleton';
import TextSkeleton from '../skeletons/TextSkeleton';
import ButtonSkeleton from '../skeletons/ButtonSkeleton';

const FollowSuggestions = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [people, setPeople] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers(5, 0);
        const responseData = response.data || {};
        const allPeople = responseData.users || [];
        const total = responseData.total || 0;
        
        setPeople(allPeople);
        setTotalUsers(total);
      } catch {
        setPeople([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPeople();
    }
  }, [user?._id]);

  if (!user) {
    return null;
  }

  const shouldShowCard = pathname.startsWith('/home');
  if (!shouldShowCard) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
        <div className="mx-auto">
          <TextSkeleton width={180} height={20} />
        </div>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <CircleSkeleton size={48} />
              <div className="flex flex-1 flex-col gap-1">
                <TextSkeleton width="60%" height={16} />
                <TextSkeleton width="40%" height={14} />
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto">
          <ButtonSkeleton width={120} height={36} />
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return null;
  }

  const shouldShowMoreButton = totalUsers > 5;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
      <h3 className="text-center text-base font-semibold">People you may know</h3>
      <div className="flex flex-col gap-3">
        {people.map((person) => (
          <UserSuggestion key={person._id} person={person} />
        ))}
      </div>
      {shouldShowMoreButton && (
        <button
          type="button"
          onClick={() => navigate('/suggestions')}
          className="mx-auto inline-flex items-center justify-center rounded-2xl border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        >
          Show more
        </button>
      )}
    </div>
  );
};

export default FollowSuggestions;

