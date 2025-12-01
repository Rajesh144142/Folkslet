import * as PostsApi from '../../features/home/api/PostsRequests';
import {
  RETRIEVING_START,
  RETRIEVING_SUCCESS,
  RETRIEVING_FAIL,
  POSTS_PAGE_REQUEST,
  POSTS_PAGE_SUCCESS,
  POSTS_PAGE_FAILURE,
} from '../actionTypes';

export const getTimelinePosts = (id, params) => async (dispatch) => {
  dispatch({ type: RETRIEVING_START });
  try {
    const { data } = await PostsApi.getTimelinePosts(id, params);
    dispatch({ type: RETRIEVING_SUCCESS, data });
  } catch (error) {
    dispatch({ type: RETRIEVING_FAIL, error: error.message });
  }
};

export const fetchMorePosts = (id, params) => async (dispatch, getState) => {
  const { postReducer } = getState();
  if (postReducer.paging || !postReducer.hasMore) {
    return;
  }
  dispatch({ type: POSTS_PAGE_REQUEST });
  try {
    const { data } = await PostsApi.getTimelinePosts(id, params);
    dispatch({ type: POSTS_PAGE_SUCCESS, data });
  } catch (error) {
    dispatch({ type: POSTS_PAGE_FAILURE, error: error.message });
  }
};

export const commentOnPost = (id, payload) => async () => {
  await PostsApi.commentOnPost(id, payload);
};
