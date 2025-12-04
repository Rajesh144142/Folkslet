import {
  UPLOAD_START,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
  RETRIEVING_START,
  RETRIEVING_SUCCESS,
  RETRIEVING_FAIL,
  POST_COMMENTED,
  POST_LIKES_UPDATED,
  POST_UPDATED,
  POST_DELETED,
  POST_CREATED,
  POSTS_PAGE_REQUEST,
  POSTS_PAGE_SUCCESS,
  POSTS_PAGE_FAILURE,
} from '../actionTypes';

const initialState = {
  posts: [],
  loading: false,
  error: false,
  uploading: false,
  nextCursor: null,
  hasMore: true,
  paging: false,
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_START:
      return { ...state, error: false, uploading: true };
    case UPLOAD_SUCCESS: {
      const posts = Array.isArray(state.posts) ? state.posts : [];
      return {
        ...state,
        posts: [action.data, ...posts],
        uploading: false,
        error: false,
      };
    }
    case UPLOAD_FAIL:
      return { ...state, uploading: false, error: true };
    case RETRIEVING_START:
      return { ...state, loading: true, error: false };
    case RETRIEVING_SUCCESS:
      return {
        ...state,
        posts: Array.isArray(action.data?.items) ? action.data.items : [],
        nextCursor: action.data?.nextCursor || null,
        hasMore: Boolean(action.data?.hasMore),
        loading: false,
        error: false,
      };
    case RETRIEVING_FAIL:
      return { ...state, loading: false, error: true };
    case POSTS_PAGE_REQUEST:
      return { ...state, paging: true };
    case POSTS_PAGE_SUCCESS: {
      const incoming = Array.isArray(action.data?.items) ? action.data.items : [];
      return {
        ...state,
        posts: [...state.posts, ...incoming],
        nextCursor: action.data?.nextCursor || null,
        hasMore: Boolean(action.data?.hasMore),
        paging: false,
      };
    }
    case POSTS_PAGE_FAILURE:
      return { ...state, paging: false };
    case POST_COMMENTED:
      return {
        ...state,
        posts: Array.isArray(state.posts)
          ? state.posts.map((post) => {
              const matches = post._id === action.data.postId || post.id === action.data.postId;
              if (!matches) {
                return post;
              }
              const existing = Array.isArray(post.comments) ? post.comments : [];
              const isDuplicate = existing.some(
                (item) => item?._id && item._id.toString() === action.data.comment?._id?.toString(),
              );
              if (isDuplicate) {
                return post;
              }
              return { ...post, comments: [...existing, action.data.comment] };
            })
          : state.posts,
      };
    case POST_LIKES_UPDATED:
      return {
        ...state,
        posts: Array.isArray(state.posts)
          ? state.posts.map((post) => {
              const matches = post._id === action.data.postId || post.id === action.data.postId;
              if (!matches) {
                return post;
              }
              return { ...post, likes: action.data.likes || [] };
            })
          : state.posts,
      };
    case POST_UPDATED:
      return {
        ...state,
        posts: Array.isArray(state.posts)
          ? state.posts.map((post) => {
              const matches =
                post._id === action.data._id ||
                post.id === action.data._id ||
                post._id === action.data.id ||
                post.id === action.data.id;
              return matches ? { ...post, ...action.data } : post;
            })
          : state.posts,
      };
    case POST_DELETED:
      return {
        ...state,
        posts: Array.isArray(state.posts)
          ? state.posts.filter((post) => post._id !== action.data.postId && post.id !== action.data.postId)
          : state.posts,
      };
    case POST_CREATED: {
      const posts = Array.isArray(state.posts) ? state.posts : [];
      const isDuplicate = posts.some(
        (post) => post._id === action.data._id || post.id === action.data._id,
      );
      if (isDuplicate) {
        return state;
      }
      return {
        ...state,
        posts: [action.data, ...posts],
      };
    }
    default:
      return state;
  }
};

export default postReducer;
