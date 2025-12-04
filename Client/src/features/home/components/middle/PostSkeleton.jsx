import { Skeleton } from '@mui/material';

const PostSkeleton = () => (
  <div className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm shadow-[var(--color-border)]/20">
    <div className="flex items-center gap-3">
      <Skeleton
        variant="circular"
        width={48}
        height={48}
        sx={{
          bgcolor: 'var(--color-background)',
        }}
      />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton
          variant="text"
          height={20}
          sx={{
            bgcolor: 'var(--color-background)',
          }}
        />
        <Skeleton
          variant="text"
          height={16}
          width="40%"
          sx={{
            bgcolor: 'var(--color-background)',
          }}
        />
      </div>
    </div>
    <Skeleton
      variant="text"
      height={18}
      width="90%"
      sx={{
        bgcolor: 'var(--color-background)',
      }}
    />
    <Skeleton
      variant="rectangular"
      height={220}
      sx={{
        bgcolor: 'var(--color-background)',
        borderRadius: '24px',
      }}
    />
    <div className="flex flex-wrap items-center gap-3">
      <Skeleton
        variant="rounded"
        width={96}
        height={32}
        sx={{
          bgcolor: 'var(--color-background)',
        }}
      />
      <Skeleton
        variant="rounded"
        width={96}
        height={32}
        sx={{
          bgcolor: 'var(--color-background)',
        }}
      />
      <Skeleton
        variant="rounded"
        width={96}
        height={32}
        sx={{
          bgcolor: 'var(--color-background)',
        }}
      />
    </div>
  </div>
);

export default PostSkeleton;


