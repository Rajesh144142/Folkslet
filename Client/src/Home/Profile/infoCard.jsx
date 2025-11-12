import { useEffect, useState } from 'react';
import { BiSolidMapPin } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { CgWorkAlt } from 'react-icons/cg';
import { SiHomebridge } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as UserApi from '../../features/home/api/UserRequests';
import { logout } from '../../redux/actions/AuthActions';
const InfoCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const params = useParams();
  const [profileUser, setProfileUser] = useState({});
  const profileUserId = params.id;

  const handleLogOut = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (profileUserId === user._id) {
        setProfileUser(user);
      } else {
        const profileDetails = await UserApi.getUser(profileUserId);
        setProfileUser(profileDetails);
      }
    };
    fetchProfileUser();
  }, [profileUserId, user]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[var(--color-text-base)]">Profile Info</h4>
        {user._id === profileUserId && (
          <Link
            to="/settings"
            className="rounded-full border border-[var(--color-border)] px-4 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Edit in settings
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <BiSolidMapPin className="text-lg text-[var(--color-primary)]" />
        <span className="font-medium text-[var(--color-text-base)]">{profileUser.livesin || 'Not shared'}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <CgWorkAlt className="text-lg text-[var(--color-primary)]" />
        <span className="font-medium text-[var(--color-text-base)]">{profileUser.worksAt || 'Not shared'}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <SiHomebridge className="text-lg text-[var(--color-primary)]" />
        <span className="font-medium text-[var(--color-text-base)]">{profileUser.country || 'Not shared'}</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
        <AiOutlineHeart className="text-lg text-[var(--color-primary)]" />
        <span className="font-medium text-[var(--color-text-base)]">{profileUser.relationship || 'Not shared'}</span>
      </div>
      <button
        className="self-end rounded-full bg-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
        onClick={handleLogOut}
      >
        Logout
      </button>
    </div>
  );
};

export default InfoCard;
