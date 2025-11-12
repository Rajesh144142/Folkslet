import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  initRealtime,
  disconnectRealtime,
  subscribeToUser,
  unsubscribeFromUser,
  addRealtimeListener,
} from '../../../realtime/client';
import { FOLLOWERS_UPDATED, FOLLOWING_UPDATED } from '../../../redux/actionTypes';
import { fetchNotifications, receiveNotification } from '../../../redux/actions/NotificationActions';

const useRealtimeAccount = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.authReducer.authData);
  const token = authData?.token;
  const userId = authData?.user?._id;

  useEffect(() => {
    if (token) {
      initRealtime(token);
    } else {
      disconnectRealtime();
    }
  }, [token]);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    subscribeToUser(userId);
    return () => {
      unsubscribeFromUser(userId);
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }
    const handleFollowers = (message) => {
      if (message?.userId !== userId) {
        return;
      }
      const followers = message?.data?.followers;
      if (!Array.isArray(followers)) {
        return;
      }
      dispatch({ type: FOLLOWERS_UPDATED, data: followers });
    };
    const handleFollowing = (message) => {
      if (message?.userId !== userId) {
        return;
      }
      const following = message?.data?.following;
      if (!Array.isArray(following)) {
        return;
      }
      dispatch({ type: FOLLOWING_UPDATED, data: following });
    };
    const offFollowers = addRealtimeListener('followersUpdated', handleFollowers);
    const offFollowing = addRealtimeListener('followingUpdated', handleFollowing);
    const handleNotification = (message) => {
      if (message?.userId !== userId) {
        return;
      }
      const notification = message?.data?.notification;
      if (notification) {
        dispatch(receiveNotification(notification));
      }
    };
    const offNotification = addRealtimeListener('notificationCreated', handleNotification);
    return () => {
      offFollowers();
      offFollowing();
      offNotification();
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    dispatch(fetchNotifications(userId, { limit: 50 }));
  }, [dispatch, userId]);
};

export default useRealtimeAccount;


