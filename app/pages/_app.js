import { Provider } from 'react-redux';
import store from '../store/store';
import '../styles/globals.css';
import RootLayout from '../components/Layout'; // Import your RootLayout component

function MyApp({ Component, pageProps }) {
  console.log('my app is running ');
  return (
    <RootLayout>
      <p style={{ color: 'red' }}>If you see this, _app is working</p>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
