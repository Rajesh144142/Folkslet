import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAllUsers, followUser, unfollowUser } from '../api/UserRequests';
import { createChat } from '../api/ChatRequests';
import { FOLLOW_USER, UNFOLLOW_USER, SAVE_USER } from '../../../redux/actionTypes';
import { assetUrl } from '../../../utils/assets';
import UserCardSkeleton from '../components/skeletons/UserCardSkeleton';

const ITEMS_PER_PAGE = 6;

const SuggestionsPage = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const dispatch = useDispatch();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [followingStates, setFollowingStates] = useState({});

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await getAllUsers(ITEMS_PER_PAGE, offset);
        const responseData = response.data || {};
        const allPeople = responseData.users || responseData || [];
        const usersArray = Array.isArray(allPeople) ? allPeople : [];
        setPeople(usersArray);
        
        const followingMap = {};
        usersArray.forEach((person) => {
          followingMap[person._id] = person.isFollowing || false;
        });
        setFollowingStates(followingMap);
        
        const total = responseData.total || 0;
        setTotalUsers(total);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      } catch {
        setPeople([]);
        setTotalUsers(0);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPeople();
    }
  }, [user?._id, currentPage]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 pb-12 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-6">
          <h1 className="text-4xl font-semibold text-[var(--color-text-base)]">People You May Know</h1>
          <p className="text-sm text-[var(--color-text-muted)]">
            Discover and connect with people who share your interests.
          </p>
        </header>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <UserCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFollowToggle = (personId) => {
    const person = people.find((p) => p._id === personId);
    if (!person) return;

    const isFollowing = followingStates[personId] || false;
    const newFollowingState = !isFollowing;
    
    setFollowingStates((prev) => ({
      ...prev,
      [personId]: newFollowingState,
    }));

    if (newFollowingState) {
      followUser(personId, user);
      dispatch({ type: FOLLOW_USER, data: personId });
      const payload = { senderId: user._id, receiverId: personId };
      dispatch({ type: SAVE_USER, data: payload });
      createChat(payload);
    } else {
      unfollowUser(personId, user);
      dispatch({ type: UNFOLLOW_USER, data: personId });
    }
  };

  const getInitials = (person) => {
    const firstName = person.firstName || person.firstname || '';
    const lastName = person.lastName || person.lastname || '';
    if (firstName || lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    const email = person.email || '';
    return email.charAt(0).toUpperCase();
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="text-sm text-[var(--color-text-muted)]">
          Showing {people.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, totalUsers)} of {totalUsers} users
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-background)]"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-2 text-[var(--color-text-muted)]">...</span>
              )}
            </>
          )}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={loading}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-base)] hover:bg-[var(--color-background)]'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {page}
            </button>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 text-[var(--color-text-muted)]">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-background)]"
              >
                {totalPages}
              </button>
            </>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text-base)] transition-colors hover:bg-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pb-12 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-6">
        <h1 className="text-4xl font-semibold text-[var(--color-text-base)]">People You May Know</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Discover and connect with people who share your interests.
        </p>
      </header>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">No suggestions available at the moment.</p>
          </div>
        ) : (
          people.map((person) => {
            const isFollowing = followingStates[person._id] || false;
            const fullName = [person.firstName || person.firstname, person.lastName || person.lastname].filter(Boolean).join(' ') || person.email?.split('@')[0] || 'User';
            const username = person.email?.split('@')[0] || 'user';
            const profilePicture = person.profilePicture;

            return (
              <div
                key={person._id}
                className="flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
              >
                <Link
                  to={`/profile/${person._id}`}
                  className="flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
                >
                  {profilePicture ? (
                    <img
                      src={assetUrl(profilePicture, 'defaultProfile.png')}
                      alt={fullName}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div 
                      className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-[var(--color-on-primary)]"
                      style={{
                        background: `var(--color-primary)`,
                      }}
                    >
                      {getInitials(person)}
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span className="text-lg font-semibold text-[var(--color-text-base)]">{fullName}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">@{username}</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleFollowToggle(person._id)}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
                    isFollowing
                      ? 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-base)] hover:bg-[var(--color-background)]'
                      : 'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90'
                  }`}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {renderPagination()}
    </div>
  );
};

export default SuggestionsPage;

