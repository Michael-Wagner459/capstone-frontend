import { Inter } from 'next/font/google';
import HeroHeader from './HeroHeader';
import NavBar from './NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TableTop Tracker',
  description: 'Website to talk about table top games.',
};

export default function RootLayout({ children }) {
  return (
    <div>
      <HeroHeader />
      <NavBar />
      {children}
    </div>
  );
}
