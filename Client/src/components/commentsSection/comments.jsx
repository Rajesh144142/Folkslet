import { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { commentOnPost } from '../../redux/actions/PostAction';

const Comments = ({ postId, userId }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = comment.trim();
    if (!message) {
      return;
    }
    try {
      await dispatch(
        commentOnPost(postId, {
          userId,
          message,
        }),
      );
      setComment('');
    } catch {
      setComment(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2 shadow-sm">
      <input
        type="text"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Add a comment"
        aria-label="Add a comment"
        className="flex-1 bg-transparent text-sm text-[var(--color-text-base)] outline-none placeholder:text-[var(--color-text-muted)]"
      />
      <button
        type="submit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-60"
        disabled={!comment.trim()}
        aria-label="Post comment"
      >
        <AiOutlineSend className="text-base" />
      </button>
    </form>
  );
};

export default Comments;