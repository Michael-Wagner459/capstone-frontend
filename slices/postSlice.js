import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks

export const fetchPostsByCategory = createAsyncThunk(
  'posts/fetchByCategory',
  async (category, { getState, rejectWithValue }) => {
    try {
      // Assuming 'general' category doesn't require auth but others do.
      const { auth } = getState();
      const headers = {};

      // Only append authorization header if the category is not 'general'
      if (category !== 'general' && auth.accessToken) {
        headers.Authorization = `Bearer ${auth.accessToken}`;
      }

      const response = await axios.get(`/posts/category/${category}`, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Error fetching posts');
    }
  }
);

export const fetchPostById = createAsyncThunk('posts/fetchById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching post');
  }
});

export const createPost = createAsyncThunk('posts/create', async (postData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/posts', postData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating post');
  }
});

export const updatePost = createAsyncThunk('posts/update', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/posts/${id}`, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/posts/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error deleting post');
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    post: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.post = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      });
  },
});

export default postSlice.reducer;
