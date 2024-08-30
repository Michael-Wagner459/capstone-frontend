'use client';
import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function NavBar() {
  const user = useSelector((state) => state.user);

  const hasAccessToDM = user && ['dm', 'admin', 'mod'].includes(user.role);
  const hasAccessToPlayer = user && ['player', 'admin', 'mod'].includes(user.role);
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
            <span className="text-white">Welcome, {user.username}</span>
          ) : (
            <Link href="/login">
              <a className="text-white">Login</a>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
