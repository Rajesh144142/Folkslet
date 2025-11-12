import { combineReducers } from 'redux';

import authReducer from './AuthReducer';
import postReducer from './PostReducer';
import chatReducer from './ChatUserReducer';
import notificationReducer from './NotificationReducer';
import theme from './ThemeReducer';

const reducers = combineReducers({
  authReducer,
  postReducer,
  chatReducer,
  notification: notificationReducer,
  theme,
});

export default reducers;