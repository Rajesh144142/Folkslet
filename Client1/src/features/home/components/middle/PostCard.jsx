import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { PiShareFatBold } from 'react-icons/pi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineLocationOn } from 'react-icons/md';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { format } from 'timeago.js';

import { likePost, updatePost as updatePostRequest, deletePost as deletePostRequest } from '../../api/PostsRequests';
import { getAllUsers } from '../../api/UserRequests';
import Comments from '../../../../components/commentsSection/comments';
import ShowComents from '../../../../components/commentsSection/showComents';
import { assetUrl } from '../../../../utils/assets';
import { uploadImage, uploadPost } from '../../../../redux/actions/UploadAction';
import { POST_DELETED, POST_UPDATED } from '../../../../redux/actionTypes';
import { useSnackbar } from '../../../../providers/SnackbarProvider.jsx';

const PostCard = ({ data }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData?.user);
  const { showMessage } = useSnackbar();
  const likesArray = Array.isArray(data.likes) ? data.likes : [];
  const [liked, setLiked] = useState(likesArray.includes(user?._id));
  const [likes, setLikes] = useState(likesArray.length);
  const [people, setPeople] = useState([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const hasImage = Boolean(data.image);
  const isOwner = data.userId === user?._id;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorDesc, setEditorDesc] = useState(data.desc || '');
  const [pendingImage, setPendingImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(data.image ? assetUrl(data.image) : null);
  const [removeImage, setRemoveImage] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareNote, setShareNote] = useState('');
  const [shareProcessing, setShareProcessing] = useState(false);
  const posts = useSelector((state) => state.postReducer.posts);

  const locationText = useMemo(() => {
    const coords = data?.location;
    if (!coords || typeof coords !== 'object') {
      return null;
    }
    if (typeof coords.address === 'string' && coords.address.trim().length > 0) {
      return coords.address.trim();
    }
    const lat = Number(coords.lat);
    const lng = Number(coords.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }
    const formatCoord = (value) => value.toFixed(4);
    return `${formatCoord(lat)}, ${formatCoord(lng)}`;
  }, [data?.location]);

  const sharedContent = data?.sharedPost;
  const isSharedPost = Boolean(sharedContent?.postId);
  const shareTargetId = isSharedPost ? sharedContent.postId : data._id;
  const sharedAuthor = useMemo(
    () => (isSharedPost ? people.find((person) => person._id === sharedContent.userId) : null),
    [people, isSharedPost, sharedContent?.userId],
  );
  const shareCount = Number(data?.shareCount) || 0;

  useEffect(() => {
    let isMounted = true;

    const fetchPeople = async () => {
      try {
        const response = await getAllUsers();
        if (isMounted) {
          setPeople(response.data || []);
        }
      } catch {
        if (isMounted) {
          setPeople([]);
        }
      }
    };

    fetchPeople();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const nextLikes = Array.isArray(data.likes) ? data.likes : [];
    setLiked(nextLikes.includes(user?._id));
    setLikes(nextLikes.length);
  }, [data.likes, user?._id]);

  const author = useMemo(() => people.find((person) => person._id === data.userId), [people, data.userId]);

  if (!user) {
    return null;
  }

  const handleLike = () => {
    likePost(data._id, user._id);
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
  };

  const toggleComments = () => {
    setShowAllComments((prev) => !prev);
  };

  const closeMenu = () => setMenuAnchor(null);

  const openEditor = useCallback(() => {
    setEditorDesc(data.desc || '');
    setPreviewImage(data.image ? assetUrl(data.image) : null);
    setPendingImage(null);
    setRemoveImage(false);
    setFilePreviewUrl(null);
    setEditorOpen(true);
  }, [data.desc, data.image]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPendingImage(file);
      const nextUrl = URL.createObjectURL(file);
      setFilePreviewUrl(nextUrl);
      setPreviewImage(nextUrl);
      setRemoveImage(false);
    }
  };

  const resetEditorMedia = () => {
    setPendingImage(null);
    setPreviewImage(null);
    setRemoveImage(true);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (filePreviewUrl) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  const handleUpdate = async () => {
    if (!user) {
      return;
    }
    const trimmed = editorDesc.trim();
    if (!trimmed && !previewImage && !pendingImage && !removeImage) {
      showMessage('Add content before saving', { severity: 'warning' });
      return;
    }
    setProcessing(true);
    const payload = { userId: user._id, desc: trimmed };
    try {
      if (pendingImage) {
        const dataForm = new FormData();
        const fileName = `${Date.now()}-${pendingImage.name}`;
        dataForm.append('name', fileName);
        dataForm.append('file', pendingImage);
      const response = await dispatch(uploadImage(dataForm));
      if (response?.url) {
        payload.image = response.url;
      } else {
        payload.image = response?.fileName || fileName;
      }
      } else if (removeImage) {
        payload.image = '';
      }
      const updated = await updatePostRequest(data._id, payload);
      dispatch({ type: POST_UPDATED, data: updated });
      showMessage('Post updated', { severity: 'success' });
      setEditorOpen(false);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to update post';
      showMessage(message, { severity: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!user) {
      return;
    }
    setProcessing(true);
    try {
      await deletePostRequest(data._id, { userId: user._id });
      dispatch({ type: POST_DELETED, data: { postId: data._id } });
      showMessage('Post deleted', { severity: 'success' });
      setDeleteOpen(false);
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to delete post';
      showMessage(message, { severity: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  const handleShare = async () => {
    if (!user || !shareTargetId) {
      return;
    }
    const trimmed = shareNote.trim();
    setShareProcessing(true);
    try {
      await dispatch(
        uploadPost({
          userId: user._id,
          desc: trimmed.length > 0 ? trimmed : undefined,
          sharedPostId: shareTargetId,
        }),
      );
      const original =
        Array.isArray(posts) &&
        posts.find((postItem) => postItem._id === shareTargetId || postItem.id === shareTargetId);
      const nextShareCount = ((original?.shareCount || (shareTargetId === data._id ? shareCount : 0)) || 0) + 1;
      dispatch({ type: POST_UPDATED, data: { _id: shareTargetId, shareCount: nextShareCount } });
      showMessage('Post shared to your feed', { severity: 'success' });
      setShareOpen(false);
      setShareNote('');
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to share post';
      showMessage(message, { severity: 'error' });
    } finally {
      setShareProcessing(false);
    }
  };

  const cardClasses =
    'flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm transition-colors';
  const iconButtonClasses =
    'rounded-full p-2 text-2xl text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]';

  return (
    <div className="flex flex-col">
      <article className={`${cardClasses} w-full`}>
        {author && (
          <header className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full border border-[var(--color-border)] object-cover"
              src={assetUrl(author.profilePicture, 'defaultProfile.png')}
              alt={`${author.firstname} ${author.lastname}`}
            />
            <div>
              <p className="text-lg font-semibold text-[var(--color-text-base)]">
                {author.firstname} {author.lastname}
              </p>
              <span className="text-sm text-[var(--color-text-muted)]">{format(author.createdAt)}</span>
            </div>
            {isOwner && (
              <IconButton
                onClick={(event) => setMenuAnchor(event.currentTarget)}
                className="ml-auto text-[var(--color-text-muted)] hover:text-[var(--color-text-base)]"
                size="small"
                aria-label="Post actions"
              >
                <HiOutlineDotsHorizontal />
              </IconButton>
            )}
          </header>
        )}
        {isSharedPost && (
          <p className="text-sm text-[var(--color-text-muted)]">
            Shared from{' '}
            {sharedAuthor ? `${sharedAuthor.firstname} ${sharedAuthor.lastname}` : 'another user'}
          </p>
        )}
        {data.desc && <p className="text-base text-[var(--color-text-base)]">{data.desc}</p>}
        {locationText && (
          <div className="mt-1 flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
            <MdOutlineLocationOn className="text-base" />
            <span>{locationText}</span>
          </div>
        )}
        {isSharedPost && (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4">
            <div className="flex items-center gap-3">
              <img
                className="h-10 w-10 rounded-full border border-[var(--color-border)] object-cover"
                src={assetUrl(sharedAuthor?.profilePicture, 'defaultProfile.png')}
                alt={sharedAuthor ? `${sharedAuthor.firstname} ${sharedAuthor.lastname}` : 'Shared user'}
              />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-base)]">
                  {sharedAuthor
                    ? `${sharedAuthor.firstname} ${sharedAuthor.lastname}`
                    : 'Shared user'}
                </p>
                {sharedContent?.createdAt && (
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {format(sharedContent.createdAt)}
                  </span>
                )}
              </div>
            </div>
            {sharedContent?.desc && (
              <p className="mt-3 text-sm text-[var(--color-text-base)]">{sharedContent.desc}</p>
            )}
            {sharedContent?.location?.address && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <MdOutlineLocationOn className="text-sm" />
                <span>{sharedContent.location.address}</span>
              </div>
            )}
            {sharedContent?.image && (
              <img
                className="mt-3 max-h-[22rem] w-full rounded-2xl object-cover"
                src={assetUrl(sharedContent.image)}
                alt="Shared post media"
                loading="lazy"
              />
            )}
          </div>
        )}
        {hasImage && (
          <img
            className="max-h-[30rem] w-full rounded-2xl object-cover"
            src={assetUrl(data.image)}
            alt="Post media"
            loading="lazy"
          />
        )}
        <div className="flex items-center gap-4 text-2xl text-[var(--color-text-muted)]">
          <button
            type="button"
            onClick={handleLike}
            className={`${iconButtonClasses} ${liked ? 'text-red-600' : ''}`}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            {liked ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
          <button type="button" onClick={toggleComments} className={iconButtonClasses} aria-label="Toggle comments">
            <AiOutlineMessage />
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className={iconButtonClasses}
            aria-label="Share post"
          >
            <PiShareFatBold />
          </button>
        </div>
        <p className="text-sm text-[var(--color-text-muted)]">
          {likes} {likes === 1 ? 'like' : 'likes'}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">{shareCount} shares</p>
        <Comments postId={data._id} userId={user._id} userName={user.username} />
        <button
          type="button"
          onClick={toggleComments}
          className="self-start text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[#1d4ed8]"
        >
          {showAllComments ? 'Hide comments' : 'Show comments'}
        </button>
        {showAllComments && <ShowComents postcomment={data.comments} />}
      </article>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu();
            setProcessing(false);
            openEditor();
          }}
        >
          Edit post
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            setProcessing(false);
            setDeleteOpen(true);
          }}
        >
          Delete post
        </MenuItem>
      </Menu>
      <Dialog open={shareOpen} onClose={() => (shareProcessing ? null : setShareOpen(false))} fullWidth maxWidth="sm">
        <DialogTitle>Share post</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={3}
            value={shareNote}
            onChange={(event) => setShareNote(event.target.value)}
            placeholder="Add a thought (optional)"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareOpen(false)} disabled={shareProcessing}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={shareProcessing} variant="contained">
            {shareProcessing ? <CircularProgress size={20} /> : 'Share now'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editorOpen} onClose={() => (processing ? null : setEditorOpen(false))} fullWidth maxWidth="sm">
        <DialogTitle>Edit post</DialogTitle>
        <DialogContent className="flex flex-col gap-4 pt-4">
          <TextField
            multiline
            minRows={4}
            value={editorDesc}
            onChange={(event) => setEditorDesc(event.target.value)}
            placeholder="Update your post"
            fullWidth
          />
          {(previewImage || pendingImage) && (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)]">
              <img src={previewImage} alt="Selected" className="max-h-[24rem] w-full object-cover" />
              <Button
                onClick={resetEditorMedia}
                variant="contained"
                size="small"
                className="absolute right-3 top-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:brightness-110"
              >
                Remove
              </Button>
            </div>
          )}
          <Button variant="outlined" component="label">
            Replace image
            <input hidden type="file" accept="image/*" onChange={onImageChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={processing} variant="contained">
            {processing ? <CircularProgress size={20} /> : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => (processing ? null : setDeleteOpen(false))}>
        <DialogTitle>Delete this post?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={processing}>
            Keep
          </Button>
          <Button onClick={handleDelete} color="error" disabled={processing}>
            {processing ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PostCard;

