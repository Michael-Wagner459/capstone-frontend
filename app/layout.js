import { Inter } from 'next/font/google';
import './globals.css';
import HeroHeader from './components/HeroHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TableTop Tracker',
  description: 'Website to talk about table top games.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeroHeader />
        {children}
      </body>
    </html>
  );
}
