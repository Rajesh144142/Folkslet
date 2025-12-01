import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { getTimelinePosts, fetchMorePosts } from '../../../../redux/actions/PostAction';
import PostCard from './PostCard';
import useRealtimePosts from '../../hooks/useRealtimePosts';
import PostSkeleton from './PostSkeleton.jsx';

const PostList = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.authData?.user);
  const { posts, loading, paging, nextCursor, hasMore } = useSelector((state) => state.postReducer);
  const postItems = Array.isArray(posts) ? posts : [];
  const observerRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      dispatch(getTimelinePosts(user._id, { limit: 20 }));
    }
  }, [dispatch, user?._id]);

  const filteredPosts = useMemo(
    () => (params.id ? postItems.filter((post) => post.userId === params.id) : postItems),
    [params.id, postItems],
  );

  const subscriptionIds = useMemo(
    () => filteredPosts.map((post) => post._id || post.id).filter(Boolean),
    [filteredPosts],
  );

  useRealtimePosts(subscriptionIds);

  const virtualizer = useWindowVirtualizer({
    count: loading || !user?._id || !filteredPosts ? 0 : filteredPosts.length,
    estimateSize: useCallback(() => 420, []),
    overscan: 8,
    measureElement: useCallback((element) => {
      return element ? element.getBoundingClientRect().height : 0;
    }, []),
  });

  useEffect(() => {
    if (!observerRef.current || !hasMore || paging || loading) {
      return undefined;
    }
    const sentinel = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore && !paging && !loading && nextCursor && user?._id) {
            dispatch(fetchMorePosts(user._id, { cursor: nextCursor, limit: 20 }));
          }
        });
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [dispatch, hasMore, paging, loading, nextCursor, user?._id]);

  if (!user?._id) {
    return null;
  }

  const containerClasses =
    'rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-0 shadow-sm transition-colors';

  if (loading) {
    return (
      <div className={containerClasses}>
        <div className="flex flex-col gap-6 p-6">
          {[0, 1, 2].map((value) => (
            <PostSkeleton key={value} />
          ))}
        </div>
      </div>
    );
  }

  if (!filteredPosts || filteredPosts.length === 0) {
    return (
      <div className={containerClasses}>
        <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">No posts yet</div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className="p-6">
        <div
          style={{
            position: 'relative',
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const post = filteredPosts[virtualRow.index];
            if (!post) {
              return null;
            }
            const key = post._id || post.id || virtualRow.index;
            return (
              <div
                key={key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="pb-6">
                  <PostCard data={post} />
                </div>
              </div>
            );
          })}
        </div>
        <div ref={observerRef} className="h-12 w-full" />
        {paging && (
          <div className="mt-6 flex flex-col gap-6">
            <PostSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;


