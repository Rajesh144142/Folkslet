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
    const updatedProfile = { ...formData, _id: targetId };
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
          <input
            type="text"
            name="country"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-text-muted)]">
          Relationship status
          <input
            type="text"
            name="relationship"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center text-[var(--color-text-base)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            value={formData.relationship}
            onChange={handleChange}
          />
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
