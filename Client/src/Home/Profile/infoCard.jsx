import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { BiSolidMapPin } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { CgWorkAlt } from 'react-icons/cg';
import { SiHomebridge } from 'react-icons/si';
import * as UserApi from '../api/UserRequests';

const InfoCard = () => {
  const { user } = useSelector((state) => state.authReducer.authData);
  const params = useParams();
  const [profileUser, setProfileUser] = useState({});
  const profileUserId = params.id;

  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!profileUserId || profileUserId === user?._id) {
        setProfileUser(user || {});
      } else {
        try {
          const profileDetails = await UserApi.getUser(profileUserId);
          setProfileUser(profileDetails.data || profileDetails);
        } catch (error) {
          setProfileUser({});
        }
      }
    };
    if (user) {
      fetchProfileUser();
    }
  }, [profileUserId, user]);

  const profileFields = [
    { icon: BiSolidMapPin, label: 'Lives in', value: profileUser.livesin || profileUser.livesIn },
    { icon: CgWorkAlt, label: 'Works at', value: profileUser.worksAt },
    { icon: SiHomebridge, label: 'Country', value: profileUser.country },
    { icon: AiOutlineHeart, label: 'Relationship', value: profileUser.relationship },
  ].filter((field) => field.value);

  const isOwnProfile = user?._id === profileUserId || !profileUserId;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-[var(--color-text-base)]">Profile Info</h4>
        {isOwnProfile && (
          <Link
            to="/settings"
            className="rounded-full border border-[var(--color-border)] px-4 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Edit in settings
          </Link>
        )}
      </div>

      {profileFields.length > 0 && (
        <div className="flex flex-col gap-3">
          {profileFields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-lg text-[var(--color-text-muted)]">
                  <Icon />
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--color-text-muted)]">{field.label}</span>
                  <span className="text-sm font-medium text-[var(--color-text-base)]">{field.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
