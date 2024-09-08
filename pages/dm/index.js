// pages/general.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsByCategory } from '@/slices/postSlice';

import Link from 'next/link';

export default function General() {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsByCategory('dm'));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold my-4">DM Posts</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="p-4 shadow rounded-lg">
            <Link href={`/posts/${post._id}`}>
              <p className="text-lg font-semibold text-blue-500 hover:text-blue-700">{post.title}</p>
            </Link>
            <p className="text-sm text-gray-500">Posted by: {post.author.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
