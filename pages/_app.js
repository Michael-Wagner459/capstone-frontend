import { Provider } from 'react-redux';
import { useEffect } from 'react';
import store from '../store/store';
import '../globals.css';
import RootLayout from '../components/Layout'; // Import your RootLayout component
import axiosInstance from '../axios';
import { validateToken } from '@/slices/authSlice';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    store.dispatch(validateToken());
  }, []);

  return (
    <Provider store={store}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Provider>
  );
}

export default MyApp;
