import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

import reducers from './reducers';

const PERSIST_KEY = 'folkslet-store';

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const serializedState = window.localStorage.getItem(PERSIST_KEY);
    if (!serializedState) {
      return undefined;
    }
    const parsed = JSON.parse(serializedState);
    return {
      authReducer: parsed?.authReducer,
      theme: parsed?.theme,
    };
  } catch {
    return undefined;
  }
};

const saveToLocalStorage = (state) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const snapshot = {
      authReducer: state.authReducer,
      theme: state.theme,
    };
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(snapshot));
  } catch {
    return;
  }
};

const store = configureStore({
  reducer: reducers,
  preloadedState: loadFromLocalStorage(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: true,
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
