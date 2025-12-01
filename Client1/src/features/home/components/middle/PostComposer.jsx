import { useMemo, useRef, useState } from 'react';
import { BsPlusSquare } from 'react-icons/bs';
import { HiOutlinePhoto } from 'react-icons/hi2';
import { MdOutlineLocationOn } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';

import { uploadImage, uploadPost } from '../../../../redux/actions/UploadAction';
import { assetUrl } from '../../../../utils/assets';

const PostComposer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData?.user);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [image, setImage] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const descriptionRef = useRef();
  const imageInputRef = useRef();

  if (!user) {
    return null;
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const resetComposer = () => {
    setImage(null);
    setLocation(null);
    if (descriptionRef.current) {
      descriptionRef.current.value = '';
    }
    setIsLocating(false);
    setIsResolvingLocation(false);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const description = descriptionRef.current?.value.trim();

    if (!description && !image && !location) {
      return;
    }

    const newPost = {
      userId: user._id,
      desc: description,
    };

    if (location) {
      newPost.location = location;
    }

    if (image) {
      const data = new FormData();
      const fileName = `${Date.now()}-${image.name}`;
      data.append('name', fileName);
      data.append('file', image);
      try {
        const response = await dispatch(uploadImage(data));
        if (response?.url) {
          newPost.image = response.url;
        } else {
          newPost.image = response?.fileName || fileName;
        }
      } catch {
        return;
      }
    }

    try {
      await dispatch(uploadPost(newPost));
      resetComposer();
    } catch {
      // leave form values so user can retry
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation || isLocating || isResolvingLocation) {
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const nextLocation = { lat: coords.latitude, lng: coords.longitude };
        setLocation(nextLocation);
        setIsLocating(false);
        setIsResolvingLocation(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`,
            {
              headers: {
                Accept: 'application/json',
                'User-Agent': 'FolksletApp/1.0',
              },
            },
          );
          if (response.ok) {
            const payload = await response.json();
            const address = typeof payload?.display_name === 'string' ? payload.display_name.trim() : '';
            if (address.length > 0) {
              setLocation({ ...nextLocation, address });
            }
          }
        } catch {
          setLocation(nextLocation);
        } finally {
          setIsResolvingLocation(false);
        }
      },
      () => {
        setLocation(null);
        setIsLocating(false);
        setIsResolvingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const actionButtonBase =
    'flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-border)] hover:bg-[var(--color-border)]/20 hover:text-[var(--color-text-base)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

  const locationButtonLabel = useMemo(() => {
    if (isLocating) {
      return 'Locating…';
    }
    if (isResolvingLocation) {
      return 'Fetching address…';
    }
    if (location?.address) {
      return location.address;
    }
    if (location?.lat && location?.lng) {
      return 'Location added';
    }
    return 'Add location';
  }, [isLocating, isResolvingLocation, location]);

  return (
    <div className="w-full rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] p-6 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <img
          className="h-14 w-14 rounded-full border border-[var(--color-border)] object-cover"
          src={assetUrl(user.profilePicture, 'defaultProfile.png')}
          alt={user.username}
          loading="lazy"
        />
        <textarea
          ref={descriptionRef}
          placeholder={`What's on your mind, ${user.firstname || user.username}?`}
          aria-label="Write a post"
          className="min-h-[96px] w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-base text-[var(--color-text-base)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>
      {image && (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setImage(null)}
            className="absolute right-3 top-3 rounded-full bg-[var(--color-surface)] p-2 text-lg text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
            aria-label="Remove selected image"
          >
            <RxCross2 />
          </button>
          <img className="max-h-[25rem] w-full object-cover" src={URL.createObjectURL(image)} alt="Selected preview" />
        </div>
      )}
      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={actionButtonBase} onClick={() => imageInputRef.current?.click()}>
            <HiOutlinePhoto className="text-lg" />
            <span>Photo</span>
          </button>
          <button
            type="button"
            className={`${actionButtonBase} ${
              location ? 'border-[var(--color-border)] bg-[var(--color-border)]/20 text-[var(--color-text-base)]' : ''
            }`}
            onClick={handleLocate}
            disabled={isLocating || isResolvingLocation}
          >
            <MdOutlineLocationOn className="text-lg" />
            <span className="max-w-[12rem] truncate text-left">{locationButtonLabel}</span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-lg text-[var(--color-text-muted)] transition hover:text-[var(--color-text-base)] sm:hidden"
            onClick={() => imageInputRef.current?.click()}
            aria-label="Add media"
          >
            <BsPlusSquare />
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || isResolvingLocation}
            className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-sm font-semibold text-[var(--color-on-primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Uploading' : isResolvingLocation ? 'Finishing…' : 'Share'}
          </button>
        </div>
      </div>
      <input
        className="hidden"
        type="file"
        name="postImage"
        accept="image/*"
        ref={imageInputRef}
        onChange={onImageChange}
      />
    </div>
  );
};

export default PostComposer;

