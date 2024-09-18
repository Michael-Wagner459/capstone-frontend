'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/slices/authSlice'; // Import your async thunk for user registration
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading } = useSelector((state) => state.auth);

  // State for form fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('player'); // Default role

  // State for form validation errors
  const [formError, setFormError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous errors

    // Validate form inputs
    if (!username || !email || !password || !confirmPassword || !role) {
      setFormError('Please fill out all fields.');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    // Dispatch registerUser async thunk
    try {
      await dispatch(register({ username, email, password, role })).unwrap();
      router.push('/verify-email'); // Redirect to login on successful registration
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form error */}
        {formError && <p className="text-red-500">{formError}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="player">Player</option>
            <option value="dm">DM</option>
          </select>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
