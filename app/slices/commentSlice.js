import { createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { comment } from 'postcss';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    fetchCommentsStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    fetchCommentsSuccess: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    fetchCommentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addComment: (state, action) => {
      state.comments.push(action.payload);
    },
    updateComment: (state, action) => {
      const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter((comment) => comment._id !== action.payload);
    },
    clearComments: (state) => {
      state.comments = [];
    },
  },
});

export const {
  fetchCommentsStart,
  fetchCommentsSuccess,
  fetchCommentsFailure,
  addComment,
  updateComment,
  deleteComment,
  clearComments,
} = commentSlice.actions;

export default commentSlice.reducer;

//async thunks

export const fetchComments = (postId) => async (dispatch) => {
  try {
    dispatch(fetchCommentsStart());
    const response = await axios.get(`/comments/post/${postId}`);
    dispatch(fetchCommentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchCommentsFailure(error.response?.data || 'Error fetching comments'));
  }
};

export const createComment = (postId, content) => async (dispatch) => {
  try {
    const response = await axios.post('/comments', { postId, content });
    dispatch(addComment(response.data));
  } catch (error) {
    dispatch(fetchCommentsFailure(error.response?.data || 'Error adding comment'));
  }
};

export const modifyComment = (id, content) => async (dispatch) => {
  try {
    const response = await axios.put(`/comments/${id}`, { content });
    dispatch(updateComment(response.data));
  } catch (error) {
    dispatch(fetchCommentsFailure(error.response?.data || 'Error updating comment'));
  }
};

export const removeComment = (id) => async (dispatch) => {
  try {
    await axios.delete(`/comments/${id}`);
    dispatch(deleteComment(id));
  } catch (error) {
    dispatch(fetchCommentsFailure(error.response?.data || 'Error deleting comment'));
  }
};
