import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { createPost } from '@/slices/postSlice';

const CreatePost = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get the current user from the Redux state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const category = router.query.category || 'general'; // Get the category from the query

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in before creating a post
    if (!user) {
      console.error('You must be logged in to create a post.');
      return;
    }

    try {
      // Include the user's ID as the author in the post data
      await dispatch(createPost({ title, content, category, author: user.id }));
      router.push(`/${category}`); // Redirect to the category page after creating the post
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-16">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
