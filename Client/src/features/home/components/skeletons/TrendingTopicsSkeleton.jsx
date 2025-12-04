import TextSkeleton from './TextSkeleton';
import { Skeleton } from '@mui/material';

const TrendingTopicsSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
      <TextSkeleton width={150} height={20} />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <TextSkeleton width="100%" height={18} />
            <TextSkeleton width="60%" height={14} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopicsSkeleton;

