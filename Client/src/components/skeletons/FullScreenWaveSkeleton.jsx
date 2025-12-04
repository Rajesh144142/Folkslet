import { Skeleton } from '@mui/material';

const FullScreenWaveSkeleton = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--color-background)] px-4 py-10">
      <div className="flex w-full max-w-screen-xl flex-col gap-6">
        <Skeleton
          variant="text"
          height={32}
          width="40%"
          animation="wave"
          sx={{
            bgcolor: 'var(--color-background)',
          }}
        />
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Skeleton
                  variant="circular"
                  width={48}
                  height={48}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--color-background)',
                  }}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <Skeleton
                    variant="text"
                    height={20}
                    animation="wave"
                    sx={{
                      bgcolor: 'var(--color-background)',
                    }}
                  />
                  <Skeleton
                    variant="text"
                    height={16}
                    width="40%"
                    animation="wave"
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
                animation="wave"
                sx={{
                  bgcolor: 'var(--color-background)',
                }}
              />
              <Skeleton
                variant="rectangular"
                height={220}
                animation="wave"
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
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--color-background)',
                  }}
                />
                <Skeleton
                  variant="rounded"
                  width={96}
                  height={32}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--color-background)',
                  }}
                />
                <Skeleton
                  variant="rounded"
                  width={96}
                  height={32}
                  animation="wave"
                  sx={{
                    bgcolor: 'var(--color-background)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullScreenWaveSkeleton;

