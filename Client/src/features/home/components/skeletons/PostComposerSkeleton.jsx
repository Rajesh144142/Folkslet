import CircleSkeleton from './CircleSkeleton';
import TextSkeleton from './TextSkeleton';
import ButtonSkeleton from './ButtonSkeleton';
import { Skeleton } from '@mui/material';

const PostComposerSkeleton = () => {
  return (
    <div className="w-full rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface-alt)] to-[var(--color-surface)] p-6 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <CircleSkeleton size={56} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={96}
          sx={{
            bgcolor: 'var(--color-background)',
            borderRadius: '16px',
          }}
        />
      </div>
      <div className="mt-6 flex flex-col gap-4 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton
            variant="rounded"
            width={100}
            height={36}
            sx={{
              bgcolor: 'var(--color-background)',
              borderRadius: '9999px',
            }}
          />
          <Skeleton
            variant="rounded"
            width={120}
            height={36}
            sx={{
              bgcolor: 'var(--color-background)',
              borderRadius: '9999px',
            }}
          />
        </div>
        <ButtonSkeleton width={80} height={40} />
      </div>
    </div>
  );
};

export default PostComposerSkeleton;

