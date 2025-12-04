import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuMoon, LuSun } from 'react-icons/lu';

import { logout } from '../../redux/actions/AuthActions';
import { uploadImage } from '../../redux/actions/UploadAction';
import { updateUser } from '../../redux/actions/UserAction';
import { toggleTheme } from '../../redux/actions/ThemeActions';
import { assetUrl } from '../../utils/assets';
import { getFollowCounts } from '../../features/home/api/UserRequests';

const buildFormState = (data) => ({
  firstname: data?.firstname || data?.firstName || '',
  lastname: data?.lastname || data?.lastName || '',
  worksAt: data?.worksAt || '',
  livesin: data?.livesin || data?.livesIn || '',
  country: data?.country || '',
  relationship: data?.relationship || '',
  about: data?.about || '',
});

const Settings = () => {
  const authState = useSelector((state) => state.authReducer.authData);
  const user = authState?.user;
  const currentTheme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [formData, setFormData] = useState(buildFormState(user));
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });

  useEffect(() => {
    if (user) {
      setFormData(buildFormState(user));
    }
  }, [user]);

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

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    if (event.target.name === 'profileImage') {
      setProfileImage(event.target.files[0]);
    } else {
      setCoverImage(event.target.files[0]);
    }
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const resetEditingState = () => {
    setFormData(buildFormState(user));
    setProfileImage(null);
    setCoverImage(null);
  };

  const handleCancelProfile = () => {
    resetEditingState();
    setIsEditingProfile(false);
  };

  const handleSubmitProfile = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      return;
    }
    setIsSavingProfile(true);
    const updatedProfile = { 
      ...formData, 
      _id: user._id,
      relationship: formData.relationship || null,
      country: formData.country || null,
    };
    try {
      if (profileImage) {
        const form = new FormData();
        const fileName = `${Date.now()}-${profileImage.name}`;
        form.append('name', fileName);
        form.append('file', profileImage);
        const response = await dispatch(uploadImage(form));
        if (response?.url) {
          updatedProfile.profilePicture = response.url;
        } else {
          updatedProfile.profilePicture = response?.fileName || fileName;
        }
      }
      if (coverImage) {
        const form = new FormData();
        const fileName = `${Date.now()}-${coverImage.name}`;
        form.append('name', fileName);
        form.append('file', coverImage);
        const response = await dispatch(uploadImage(form));
        if (response?.url) {
          updatedProfile.coverPicture = response.url;
        } else {
          updatedProfile.coverPicture = response?.fileName || fileName;
        }
      }
      const response = await dispatch(updateUser(user._id, updatedProfile));
      if (response?.user) {
        setFormData(buildFormState(response.user));
      }
      setIsEditingProfile(false);
      setProfileImage(null);
      setCoverImage(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setIsEditingProfile(true);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (!user) {
    return null;
  }

  const avatarSrc = assetUrl(user.profilePicture, 'defaultProfile.png');
  const coverSrc = assetUrl(user.coverPicture, 'BackgroundProfiledefault.jpg');
  const followerCount = followCounts.followers;
  const followingCount = followCounts.following;
  const lastUpdated = new Date(user.updatedAt || user.createdAt).toLocaleDateString();
  const profileSummary = [
    { label: 'First name', value: user.firstname || user.firstName },
    { label: 'Last name', value: user.lastname || user.lastName },
    { label: 'Works at', value: user.worksAt },
    { label: 'Lives in', value: user.livesin || user.livesIn },
    { label: 'Country', value: user.country },
    { label: 'Relationship', value: user.relationship },
    { label: 'About', value: user.about },
  ].map(({ label, value }) => ({
    label,
    value: value && value.toString().trim().length > 0 ? value : 'Not shared',
  }));

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 pb-14 lg:px-8">
      <header className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-6">
        <h1 className="text-4xl font-semibold text-[var(--color-text-base)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Tailor your Folkslet experience. Update your profile, switch themes, or manage your account preferences.
        </p>
      </header>

      <section className="mt-8 grid gap-8 lg:grid-cols-[320px,1fr] xl:grid-cols-[360px,1fr]">
        <aside className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] shadow-xl">
            <div className="relative h-40 w-full">
              <img src={coverSrc} alt="Cover" className="h-full w-full object-cover" loading="lazy" />
              <img
                src={avatarSrc}
                alt={[user.firstname || user.firstName, user.lastname || user.lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'User'}
                className="absolute bottom-0 left-6 h-24 w-24 translate-y-1/2 rounded-full border-4 border-[var(--color-surface)] object-cover shadow-xl"
                loading="lazy"
              />
            </div>
            <div className="mt-16 space-y-4 px-6 pb-6">
              <div>
                <p className="text-xl font-semibold text-[var(--color-text-base)]">
                  {[user.firstname || user.firstName, user.lastname || user.lastName].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3">
                  <p className="text-2xl font-semibold text-[var(--color-text-base)]">{followingCount}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Following</p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3">
                  <p className="text-2xl font-semibold text-[var(--color-text-base)]">{followerCount}</p>
                  <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">Followers</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">Profile last updated on {lastUpdated}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-base)]">Appearance</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                  Switch between light and dark to match your workspace.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={currentTheme === 'dark'}
                onClick={handleToggleTheme}
                className={`inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition ${
                  currentTheme === 'dark'
                    ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                    : 'bg-[var(--color-background)] text-[var(--color-text-base)]'
                } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]`}
              >
                {currentTheme === 'dark' ? <LuMoon /> : <LuSun />}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-[var(--color-text-base)]">Account</h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Need a fresh start? Sign out of Folkslet; you can log back in anytime.
            </p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 w-full rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] p-6 shadow-xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text-base)]">Profile information</h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Keep your personal details accurate so friends and followers recognize you instantly.
              </p>
            </div>
            {!isEditingProfile && (
              <button
                type="button"
                className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit profile
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSubmitProfile} className="mt-6 grid gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  First name
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  Last name
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)] sm:col-span-2">
                  Works at
                  <input
                    type="text"
                    name="worksAt"
                    value={formData.worksAt}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  Lives in
                  <input
                    type="text"
                    name="livesin"
                    value={formData.livesin}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  Country
                  <select
                    name="country"
                    value={formData.country || ''}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">Select country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Austria">Austria</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Norway">Norway</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Finland">Finland</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Greece">Greece</option>
                    <option value="Ireland">Ireland</option>
                    <option value="India">India</option>
                    <option value="China">China</option>
                    <option value="Japan">Japan</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Colombia">Colombia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Israel">Israel</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Russia">Russia</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)]">
                  Relationship status
                  <select
                    name="relationship"
                    value={formData.relationship || ''}
                    onChange={handleFormChange}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  >
                    <option value="">Select relationship status</option>
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </label>
                <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--color-text-muted)] sm:col-span-2">
                  About
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleFormChange}
                    className="min-h-[120px] resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-4 text-sm font-semibold text-[var(--color-text-muted)] sm:flex-row sm:items-start sm:justify-between">
                <label className="flex flex-col gap-2">
                  Profile image
                  <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} />
                </label>
                <label className="flex flex-col gap-2">
                  Cover image
                  <input type="file" name="coverImage" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                {profileImage ? 'New profile image selected.' : 'Current profile image will stay the same.'}{' '}
                {coverImage ? 'New cover image selected.' : 'Current cover image will stay the same.'}
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  disabled={isSavingProfile}
                  className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-base)] transition hover:bg-[var(--color-border)]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {profileSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-base)]">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Settings;