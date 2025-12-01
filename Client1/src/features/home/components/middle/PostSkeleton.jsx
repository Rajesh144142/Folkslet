import { Skeleton } from '@mui/material';

const PostSkeleton = () => (
  <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm shadow-[var(--color-border)]/20">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={16} width="40%" />
      </div>
    </div>
    <Skeleton variant="text" height={18} width="90%" />
    <Skeleton variant="rectangular" height={220} className="rounded-3xl" />
    <div className="flex flex-wrap items-center gap-3">
      <Skeleton variant="rounded" width={96} height={32} />
      <Skeleton variant="rounded" width={96} height={32} />
      <Skeleton variant="rounded" width={96} height={32} />
    </div>
  </div>
);

export default PostSkeleton;


