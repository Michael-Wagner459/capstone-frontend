// /pages/verify-email.js
import Link from 'next/link';

const VerifyEmail = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-4">
          A verification link has been sent to your email. Please verify your email before logging in.
        </p>
        <Link href="/login">
          <p className="text-blue-500 underline">Go to Login</p>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
