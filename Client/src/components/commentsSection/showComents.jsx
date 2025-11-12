const ShowComments = ({ postcomment }) => {
  const comments = Array.isArray(postcomment) ? postcomment : [];

  if (comments.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-background)]/60 px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">
        No comments yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => {
        const key = comment._id || `${comment.userId}-${comment.createdAt}` || comment.username;
        return (
          <div
            key={key}
            className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text-base)] shadow-sm"
          >
            <p className="font-semibold text-[var(--color-text-base)]">{comment.username || 'Anonymous'}</p>
            <p className="mt-1 text-[var(--color-text-muted)]">{comment.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ShowComments;