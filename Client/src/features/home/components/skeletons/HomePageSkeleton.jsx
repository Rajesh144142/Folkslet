import ProfileCardSkeleton from './ProfileCardSkeleton';
import PostComposerSkeleton from './PostComposerSkeleton';
import PostSkeleton from '../middle/PostSkeleton';
import CircleSkeleton from './CircleSkeleton';
import TextSkeleton from './TextSkeleton';
import ButtonSkeleton from './ButtonSkeleton';
import TrendingTopicsSkeleton from './TrendingTopicsSkeleton';

const HomePageSkeleton = () => {
  return (
    <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-8 px-4 pb-12 lg:flex-row lg:px-8">
      <aside className="hidden flex-col gap-3 lg:flex">
        <ProfileCardSkeleton />
      </aside>
      <div className="flex w-full flex-col gap-6 lg:flex-[2]">
        <PostComposerSkeleton />
        <div className="flex flex-col gap-6 lg:hidden">
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
            <div className="mx-auto">
              <TextSkeleton width={180} height={20} />
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CircleSkeleton size={48} />
                  <div className="flex flex-1 flex-col gap-1">
                    <TextSkeleton width="60%" height={16} />
                    <TextSkeleton width="40%" height={14} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto">
              <ButtonSkeleton width={120} height={36} />
            </div>
          </div>
          <TrendingTopicsSkeleton />
        </div>
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-sm transition-colors">
          <div className="flex flex-col gap-6 p-6">
            {Array.from({ length: 3 }).map((value) => (
              <PostSkeleton key={value} />
            ))}
          </div>
        </div>
      </div>
      <aside className="hidden w-full flex-col gap-6 lg:flex lg:max-w-sm">
        <div className="sticky top-28 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-[var(--color-text-base)] shadow-sm">
            <div className="mx-auto">
              <TextSkeleton width={180} height={20} />
            </div>
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CircleSkeleton size={48} />
                  <div className="flex flex-1 flex-col gap-1">
                    <TextSkeleton width="60%" height={16} />
                    <TextSkeleton width="40%" height={14} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto">
              <ButtonSkeleton width={120} height={36} />
            </div>
          </div>
          <TrendingTopicsSkeleton />
        </div>
      </aside>
    </div>
  );
};

export default HomePageSkeleton;

