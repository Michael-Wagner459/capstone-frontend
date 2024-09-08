import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunk for fetching comments
export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/comments/post/${postId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching comments');
  }
});

// Async thunk for creating a comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/comments', { postId, content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding comment');
    }
  }
);

// Async thunk for updating a comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/comments/${id}`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating comment');
    }
  }
);

// Async thunk for deleting a comment
export const deleteComment = createAsyncThunk('comments/deleteComment', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/comments/${id}`);
    return id; // Return id to identify which comment was deleted
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting comment');
  }
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
