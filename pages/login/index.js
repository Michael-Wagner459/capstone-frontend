import LoginForm from '../../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Login</h2>
        <LoginForm />
        <p className="text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
