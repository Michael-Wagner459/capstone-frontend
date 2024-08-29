import { createSlice } from '@reduxjs/toolkit';
import axios from '../axios';

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    setPostsSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.posts = action.payload;
    },
    setSinglePostSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.post = action.payload;
    },
    setPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
  },
});

export const { setPostStart, setPostsSuccess, setSinglePostSuccess, setPostFailure, addPost, updatePost, deletePost } =
  postSlice.actions;

export default postSlice.reducer;

export const fetchPostsByCategory = (category) => async (dispatch) => {
  try {
    dispatch(setPostsStart());
    const response = await axios.get(`/posts/category/${category}`);
    dispatch(setPostSuccess(response.data));
  } catch (error) {
    dispatch(setPostFailure(error.response ? error.response.data : error.message));
  }
};

export const fetchPostById = (id) => async (dispatch) => {
  try {
    dispatch(setPostStart());
    const response = await axios.get(`/posts/${id}`);
    dispatch(setSinglePostSuccess(response.data));
  } catch (error) {
    dispatch(setPostFailure(error.response ? error.response.data : error.message));
  }
};

export const createPost = (postData) => async (dispatch) => {
  try {
    dispatch(setPostStart());
    const response = await axios.post('/posts', postData);
    dispatch(addPost(response.data));
  } catch (error) {
    dispatch(setPostFailure(error.response ? error.response.data : error.message));
  }
};

export const updateExistingPost = (id, updatedData) => async (dispatch) => {
  try {
    dispatch(setPostStart());
    const response = await axios.put(`/posts/${id}`, updatedData);
    dispatch(updatePost(response.data));
  } catch (error) {
    dispatch(setPostFailure(error.response ? error.response.data : error.message));
  }
};

export const deleteExistingPost = (id) => async (dispatch) => {
  try {
    dispatch(setPostStart());
    await axios.delete(`/posts/${id}`);
    dispatch(deletePost(id));
  } catch (error) {
    dispatch(setPostFailure(error.response ? error.response.data : error.message));
  }
};
