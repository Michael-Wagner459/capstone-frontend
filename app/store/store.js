import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import postReducer from '../slices/postSlice';
import commentReducer from '../slices/commentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
    comments: commentReducer,
  },
});

export default store;
