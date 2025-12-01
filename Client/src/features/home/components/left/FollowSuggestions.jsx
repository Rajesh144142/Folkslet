import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import FollowersModal from './FollowersModal';
import UserSuggestion from '../shared/UserSuggestion';
import { getAllUsers } from '../../api/UserRequests';

const FollowSuggestions = () => {
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.authReducer.authData);
  const [people, setPeople] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await getAllUsers();
        setPeople(response.data || []);
      } catch {
        setPeople([]);
      }
    };

    fetchPeople();
  }, []);

  const filteredPeople = useMemo(() => {
    if (!user) {
      return [];
    }
    return people.filter((person) => person._id !== user._id);
  }, [people, user]);

  if (!user) {
    return null;
  }

  const shouldShowCard = pathname.startsWith('/home') && filteredPeople.length > 0;
  if (!shouldShowCard) {
    return null;
  }

  const previewPeople = filteredPeople.slice(0, 4);
  const showMoreAvailable = filteredPeople.length > previewPeople.length;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
        <h3 className="text-center text-base font-semibold">People you may know</h3>
        <div className="flex flex-col gap-3">
          {previewPeople.map((person) => (
            <UserSuggestion key={person._id} person={person} />
          ))}
        </div>
        {showMoreAvailable && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mx-auto inline-flex items-center justify-center rounded-2xl border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Show more
          </button>
        )}
      </div>
      <FollowersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} people={filteredPeople} />
    </>
  );
};

export default FollowSuggestions;

