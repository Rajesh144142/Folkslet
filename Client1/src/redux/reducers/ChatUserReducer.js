import { SAVE_USER } from '../actionTypes';

const initialState = { chatUsers: [], loading: false, error: false };

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER: {
      const user = action.data || action.payload;
      if (!user) {
        return state;
      }
      return { ...state, chatUsers: [...state.chatUsers, user] };
    }
    default:
      return state;
  }
};

export default chatReducer;