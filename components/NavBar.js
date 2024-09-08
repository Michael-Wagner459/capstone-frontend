'use client';
import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/slices/authSlice';

export default function NavBar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const hasAccessToDM = user && ['dm', 'admin', 'mod'].includes(user.role);
  const hasAccessToPlayer = user && ['player', 'admin', 'mod'].includes(user.role);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/general');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex justify-between items-center">
        {/* Left Side: Tabs */}
        <div className="flex space-x-4">
          <li>
            <Link href="/general" className="text-white">
              General
            </Link>
          </li>
          <li>
            <Link
              href={hasAccessToDM ? '/dm' : '#'}
              className={`${
                hasAccessToDM
                  ? 'text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer'
                  : 'text-gray-500 cursor-not-allowed px-3 py-2 rounded'
              }`}
              title={!hasAccessToDM ? 'You do not have access to the DM section' : ''}
            >
              DM
            </Link>
          </li>
          <li>
            <Link
              href={hasAccessToPlayer ? '/player' : '#'}
              className={`${
                hasAccessToPlayer
                  ? 'text-white hover:bg-gray-700 px-3 py-2 rounded cursor-pointer'
                  : 'text-gray-500 cursor-not-allowed px-3 py-2 rounded'
              }`}
              title={!hasAccessToPlayer ? 'You do not have access to the Player section' : ''}
            >
              Player
            </Link>
          </li>
        </div>

        {/* Right Side: Login/Welcome */}
        <li>
          {user ? (
            <>
              <span className="text-white">Welcome, {user.username} </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-white">
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
