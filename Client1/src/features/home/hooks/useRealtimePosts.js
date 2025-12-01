import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToPost, unsubscribeFromPost, addRealtimeListener } from '../../../realtime/client';
import { POST_COMMENTED, POST_LIKES_UPDATED, POST_UPDATED } from '../../../redux/actionTypes';

const normalizeIds = (ids) =>
  ids
    .map((value) => (value ? value.toString() : null))
    .filter((value, index, array) => value && array.indexOf(value) === index);

const useRealtimePosts = (ids) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authReducer.authData?.token);
  const userReady = Boolean(token);
  const postIds = useMemo(() => normalizeIds(Array.isArray(ids) ? ids : []), [ids]);

  useEffect(() => {
    if (!userReady) {
      return;
    }
    postIds.forEach((postId) => subscribeToPost(postId));
    return () => {
      postIds.forEach((postId) => unsubscribeFromPost(postId));
    };
  }, [userReady, postIds]);

  useEffect(() => {
    if (!userReady) {
      return undefined;
    }
    const handleComment = (message) => {
      const record = message?.data;
      const postId = record?.postId || message?.postId;
      const comment = record?.comment || message?.comment;
      if (postId && comment) {
        dispatch({ type: POST_COMMENTED, data: { postId, comment } });
      }
    };
    const handleLikes = (message) => {
      const record = message?.data || message;
      if (record?.postId && Array.isArray(record?.likes)) {
        dispatch({ type: POST_LIKES_UPDATED, data: record });
      }
    };
    const offComment = addRealtimeListener('commentCreated', handleComment);
    const offLikes = addRealtimeListener('likesUpdated', handleLikes);
    const handleShares = (message) => {
      const record = message?.data;
      if (record?.postId && typeof record.shareCount === 'number') {
        dispatch({ type: POST_UPDATED, data: { _id: record.postId, shareCount: record.shareCount } });
      }
    };
    const offShare = addRealtimeListener('shareCountUpdated', handleShares);
    return () => {
      offComment();
      offLikes();
      offShare();
    };
  }, [dispatch, userReady]);
};

export default useRealtimePosts;

