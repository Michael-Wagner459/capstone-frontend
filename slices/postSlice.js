import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../axios';

// Async thunks

export const fetchPostsByCategory = createAsyncThunk('posts/fetchByCategory', async (category, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('accessToken');

    // Only append authorization header if the category is not 'general'

    const response = await axios.get(`/posts/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Error fetching posts');
  }
});

export const fetchPostById = createAsyncThunk('posts/fetchById', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.get(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error fetching post');
  }
});

export const createPost = createAsyncThunk('posts/create', async (postData, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.post('/posts', postData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error creating post');
  }
});

export const updatePost = createAsyncThunk('posts/update', async ({ id, updatedData }, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    const response = await axios.put(`/posts/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error updating post');
  }
});

export const deletePost = createAsyncThunk('posts/delete', async (id, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  try {
    await axios.delete(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
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
        state.error = null;
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
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload;
        }
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.error = null;
      });
  },
});

export default postSlice.reducer;
