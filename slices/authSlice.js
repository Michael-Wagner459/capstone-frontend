import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { useDispatch } from 'react-redux';

//Asycn thunk for registering new user
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/register', { username, password, role, email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for logging in
export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/login', { username, password });
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Login failed');
  }
});

// Async thunk for refreshing the access token
export const refreshAccessToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.post('/auth/token', null, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to refresh token');
  }
});

// Define the validateToken thunk
export const validateToken = createAsyncThunk('auth/validateToken', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return rejectWithValue('No token found');
  }

  try {
    const response = await axios.get('/auth/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('accessToken'); // Clear token if invalid
    return rejectWithValue(error.response?.data.message || 'Failed to validate token');
  }
});

// Async thunk for logging out
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    console.log('send logout to backend');
    await axios.post('/auth/logout', null, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
      },
    });
    console.log('logout complete');
    localStorage.removeItem('accessToken');
    return;
  } catch (error) {
    return rejectWithValue('Logout failed');
  }
});

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
