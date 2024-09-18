import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunk for fetching comments
export const fetchComments = createAsyncThunk('comments/fetchComments', async (postId, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`/comments/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.log(error.response?.data);
    return rejectWithValue(error.response?.data || 'Error fetching comments');
  }
});

// Async thunk for creating a comment
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.post(
        '/comments',
        { postId, content },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error adding comment');
    }
  }
);

// Async thunk for updating a comment
export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, editingCommentContent }, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await axios.put(
        `/comments/${commentId}`,
        { content: editingCommentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error.response?.data);
      return rejectWithValue(error.response?.data || 'Error updating comment');
    }
  }
);

// Async thunk for deleting a comment
export const deleteComment = createAsyncThunk('comments/deleteComment', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axios.delete(`/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return id; // Return id to identify which comment was deleted
  } catch (error) {
    console.log(error.response?.data);
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
        state.error = null;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex((comment) => comment._id === action.payload._id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((comment) => comment._id !== action.payload);
        state.error = null;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
