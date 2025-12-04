import { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { uploadImage } from '../../redux/actions/UploadAction';
import { updateUser } from '../../redux/actions/UserAction';
const ProfileModal = ({ modalOpened, setModalOpened, data, userId }) => {
  const theme = useMantineTheme();
  const { password, ...other } = data;
  const [formData, setFormData] = useState(other);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const dispatch = useDispatch();
  const targetId = userId || data?._id;
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const onImageChange = (event) => {
    if (!event.target.files || !event.target.files[0]) {
      return;
    }
    const selectedImage = event.target.files[0];
    if (event.target.name === 'profileImage') {
      setProfileImage(selectedImage);
    } else {
      setCoverImage(selectedImage);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedProfile = { 
      ...formData, 
      _id: targetId,
      relationship: formData.relationship || null,
      country: formData.country || null,
    };
    if (profileImage) {
      const form = new FormData();
      const fileName = Date.now() + profileImage.name;
      form.append('name', fileName);
      form.append('file', profileImage);
      try {
      const response = await dispatch(uploadImage(form));
      updatedProfile.profilePicture = response?.url || response?.fileName || fileName;
      } catch (error) {
        alert('Unable to upload profile image');
        return;
      }
    }
    if (coverImage) {
      const form = new FormData();
      const fileName = Date.now() + coverImage.name;
      form.append('name', fileName);
      form.append('file', coverImage);
      try {
      const response = await dispatch(uploadImage(form));
      updatedProfile.coverPicture = response?.url || response?.fileName || fileName;
      } catch (error) {
        alert('Unable to upload cover image');
        return;
      }
    }
    if (targetId) {
      await dispatch(updateUser(targetId, updatedProfile));
    }
    setModalOpened(false);
  };
  return (
    <Modal
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
      overlayProps={{
        color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
        opacity: 0.55,
        blur: 3,
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h3 className="text-center text-2xl font-semibold text-[var(--color-text-base)]">Your info</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
            First Name
            <input
              type="text"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
          </label>
          <label className="flex w-full flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
            Last Name
            <input
              type="text"
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          Works at
          <input
            type="text"
            name="worksAt"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.worksAt}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          Lives in
          <input
            type="text"
            name="livesin"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.livesin}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          Country
          <select
            name="country"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.country || ''}
            onChange={handleChange}
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
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          Relationship status
          <select
            name="relationship"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.relationship || ''}
            onChange={handleChange}
          >
            <option value="">Select relationship status</option>
            <option value="Single">Single</option>
            <option value="In a relationship">In a relationship</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          About
          <input
            type="text"
            name="about"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.about}
            onChange={handleChange}
          />
        </label>
        <div className="flex flex-col gap-3 text-sm font-medium text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-col gap-2">
            Profile image
            <input type="file" name="profileImage" onChange={onImageChange} className="text-[var(--color-text-base)]" />
          </label>
          <label className="flex flex-col gap-2">
            Cover image
            <input type="file" name="coverImage" onChange={onImageChange} className="text-[var(--color-text-base)]" />
          </label>
        </div>
        <div className="flex flex-col gap-1 text-xs text-[var(--color-text-muted)]">
          <span>{profileImage ? 'Profile image selected' : 'Profile image not selected'}</span>
          <span>{coverImage ? 'Cover image selected' : 'Cover image not selected'}</span>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default ProfileModal;