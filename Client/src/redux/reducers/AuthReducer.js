import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  UPDATING_START,
  UPDATING_SUCCESS,
  UPDATING_FAIL,
  LOG_OUT,
  FOLLOW_USER,
  UNFOLLOW_USER,
  FOLLOWERS_UPDATED,
  FOLLOWING_UPDATED,
} from '../actionTypes';

const initialState = {
  authData: null,
  loading: false,
  error: false,
  errorMessage: null,
  updateLoading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_START:
      return { ...state, loading: true, error: false, errorMessage: null };
    case AUTH_SUCCESS:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false, error: false, errorMessage: null };
    case AUTH_FAIL:
      return { ...state, loading: false, error: true, errorMessage: action.error || null };
    case UPDATING_START:
      return { ...state, updateLoading: true, error: false, errorMessage: null };
    case UPDATING_SUCCESS:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, updateLoading: false, error: false, errorMessage: null };
    case UPDATING_FAIL:
      return { ...state, updateLoading: false, error: true, errorMessage: action.error || null };
    case LOG_OUT:
      localStorage.clear();
      return {
        ...state,
        authData: null,
        loading: false,
        error: false,
        errorMessage: null,
        updateLoading: false,
      };
    case FOLLOW_USER:
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            following: [...state.authData.user.following, action.data],
          },
        },
      };
    case UNFOLLOW_USER:
      return {
        ...state,
        authData: {
          ...state.authData,
          user: {
            ...state.authData.user,
            following: state.authData.user.following.filter((personId) => personId !== action.data),
          },
        },
      };
    case FOLLOWERS_UPDATED: {
      if (!state.authData?.user) {
        return state;
      }
      const followers = Array.isArray(action.data)
        ? action.data.map((value) => value.toString())
        : state.authData.user.followers;
      const authData = {
        ...state.authData,
        user: {
          ...state.authData.user,
          followers,
        },
      };
      localStorage.setItem('profile', JSON.stringify(authData));
      return { ...state, authData };
    }
    case FOLLOWING_UPDATED: {
      if (!state.authData?.user) {
        return state;
      }
      const following = Array.isArray(action.data)
        ? action.data.map((value) => value.toString())
        : state.authData.user.following;
      const authData = {
        ...state.authData,
        user: {
          ...state.authData.user,
          following,
        },
      };
      localStorage.setItem('profile', JSON.stringify(authData));
      return { ...state, authData };
    }
    default:
      return state;
  }
};

export default authReducer;

