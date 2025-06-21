import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
  reducer: {
    notifications: notificationReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  console.log('Current state:', state);
}
);

export default store;