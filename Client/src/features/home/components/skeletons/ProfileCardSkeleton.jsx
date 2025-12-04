import CircleSkeleton from './CircleSkeleton';
import TextSkeleton from './TextSkeleton';
import ButtonSkeleton from './ButtonSkeleton';
import { Skeleton } from '@mui/material';

const ProfileCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <Skeleton
        variant="rectangular"
        width="100%"
        height={160}
        sx={{
          bgcolor: 'var(--color-background)',
        }}
      />
      <div className="relative -mt-12 flex flex-col items-center gap-2 px-6 pb-6 text-center">
        <CircleSkeleton size={96} />
        <div className="mt-4 flex flex-col items-center gap-2">
          <TextSkeleton width={120} height={24} />
          <TextSkeleton width={200} height={16} />
        </div>
        <div className="my-4 grid w-full grid-cols-2 gap-4 border-y border-[var(--color-border)] py-3">
          <div className="flex flex-col items-center gap-1">
            <TextSkeleton width={40} height={20} />
            <TextSkeleton width={60} height={14} />
          </div>
          <div className="flex flex-col items-center gap-1">
            <TextSkeleton width={40} height={20} />
            <TextSkeleton width={60} height={14} />
          </div>
        </div>
        <ButtonSkeleton width="100%" height={40} />
      </div>
    </div>
  );
};

export default ProfileCardSkeleton;

