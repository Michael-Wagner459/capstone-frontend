import Link from 'next/link';

const EmailVerified = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Email Verified</h1>
        <p className="mb-4">Your email has been successfully verified. You can now log in to your account.</p>
        <Link href="/login">
          <p className="text-blue-500 underline">Go to Login</p>
        </Link>
      </div>
    </div>
  );
};

export default EmailVerified;
