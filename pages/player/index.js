import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByCategory } from '@/slices/postSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function General() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchPostsByCategory('player'));
  }, [dispatch]);

  const handleCreatePost = () => {
    router.push('/create-post?category=player');
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Something went wrong</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Player Posts</h1>
        {user && (
          <button onClick={handleCreatePost} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Create Post
          </button>
        )}
      </div>
      <div className="space-y-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="p-4 border rounded-md shadow-md">
              <Link href={`/posts/${post._id}`}>
                <h2 className="text-lg font-semibold text-blue-500 hover:text-blue-700">{post.title}</h2>
              </Link>
              <p className="text-gray-600">Posted by {post.author.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
