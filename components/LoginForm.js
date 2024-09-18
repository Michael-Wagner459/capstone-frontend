// /app/login/LoginForm.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/slices/authSlice';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(login({ username, password })) // Dispatching the login thunk action
      .unwrap()
      .then(() => {
        router.push('/general');
      })
      .catch((error) => {
        console.log('Login failed: ', error);
      });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button onClick={handleLogin} className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
        Login
      </button>
    </form>
  );
}
