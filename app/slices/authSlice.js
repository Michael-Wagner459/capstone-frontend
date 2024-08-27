import { createSlice } from '@reduxjs/toolkit';
import axios from '../axios';
import { Passero_One } from 'next/font/google';

const initialState = {
  user: null,
  accessToken: null,
  isAuthenticated: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    setAuthSuccess: (state, action) => {
      (state.loading = false),
        (state.isAuthenticated = true),
        (state.user = action.payload.user),
        (state.accessToken = action.payload.accessToken),
        (state.error = null);
    },
    setAuthFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    logout: (state) => {
      (state.user = null),
        (state.accessToken = null),
        (state.isAuthenticated = false),
        localStorage.removeItem('accessToken'),
        (state.error = null);
    },
  },
});

export const { setAuthStart, setAuthSuccess, setAuthFailure, logout } = authSlice.actions;

export default authSlice.reducer;

//Thunks for async actions
export const login = (username, password) => async (dispatch) => {
  try {
    dispatch(setAuthStart());

    const response = await axios.post('/auth/login', { username, password });

    const { accessToken, user } = response.data;

    //store tokens in local storage
    localStorage.setItem('accessToken', accessToken);

    dispatch(setAuthSuccess({ accessToken, user }));
  } catch (error) {
    dispatch(setAuthFailure(error.response ? error.response.data : error.message));
  }
};

export const refreshAccessToken = () => async (dispatch, getState) => {
  try {
    const response = await axios.post('/auth/token', null, { withCredentials: true });

    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);

    dispatch(
      setAuthSuccess({
        accessToken,
        user: getState().auth.user,
      })
    );
  } catch (error) {
    dispatch(logout());
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post('/auth/logout', null, { withCredentials: true });
    dispatch(logout());
  } catch (error) {
    dispatch(setAuthFailure(error.response?.data || 'An error occured'));
  }
};
