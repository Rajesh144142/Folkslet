import CircleSkeleton from './CircleSkeleton';
import TextSkeleton from './TextSkeleton';
import ButtonSkeleton from './ButtonSkeleton';

const UserCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <div className="flex flex-col items-center gap-3">
        <CircleSkeleton size={80} />
        <div className="flex flex-col items-center gap-1">
          <TextSkeleton width={120} height={24} />
          <TextSkeleton width={100} height={16} />
        </div>
      </div>
      <ButtonSkeleton width="100%" height={40} />
    </div>
  );
};

export default UserCardSkeleton;

