import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostById, deletePost, updatePost } from '@/slices/postSlice';
import { fetchComments, deleteComment, updateComment, createComment } from '@/slices/commentSlice';

const PostPage = () => {
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null); // Track the comment being edited
  const [editingCommentContent, setEditingCommentContent] = useState(''); // Track the edited comment content

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { post, loading: postLoading, error: postError } = useSelector((state) => state.posts);
  const { comments, loading: commentLoading, error: commentError } = useSelector((state) => state.comments);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post && post.content) {
      setPostContent(post.content);
    }
  }, [post]);

  // Function to handle post update submission
  const handleUpdatePost = async () => {
    if (window.confirm('Are you sure you want to update this post?')) {
      const updatedData = {
        title: post.title,
        content: postContent,
      };
      await dispatch(updatePost({ id, updatedData }));
      setIsEditingPost(false);
    }
  };

  // Function to handle deleting post
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletePost(id));
      router.push('/general');
    }
  };

  // Function to handle comment deletion
  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(commentId));
    }
  };

  // Function to handle comment update
  const handleUpdateComment = (commentId) => {
    setEditingCommentId(commentId);
    const comment = comments.find((c) => c._id === commentId);
    setEditingCommentContent(comment.content);
  };

  // Function to save updated comment
  const handleSaveUpdatedComment = async (commentId) => {
    if (editingCommentContent.trim()) {
      await dispatch(updateComment({ commentId, editingCommentContent }));
      setEditingCommentId(null);
      setEditingCommentContent('');
    } else {
      alert('Comment cannot be empty.');
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    await dispatch(createComment({ postId: id, content: newComment }));
    setNewComment('');
    setIsAddingComment(false);
  };

  // Check role permissions
  const canEditPost = user && post?.author._id === user.id;
  const canDeletePost = user && (post?.author._id === user.id || ['admin', 'mod'].includes(user.role));

  return (
    <div className="container mx-auto p-6">
      {postLoading || commentLoading ? (
        <p>Loading...</p>
      ) : postError || commentError ? (
        <p className="text-red-500">Something went wrong.</p>
      ) : (
        <div>
          {/* Post Content */}
          <div className="bg-white shadow-md rounded p-6 mb-4">
            <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
            <p className="text-gray-700 mb-4">Posted by: {post?.author.username}</p>

            {/* Display post content, either editable or static */}
            {isEditingPost ? (
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full p-4 border rounded"
                rows="4"
              />
            ) : (
              <p>{post?.content}</p>
            )}

            {/* Update & Delete Buttons for Post */}
            <div className="mt-4">
              {canEditPost && !isEditingPost && (
                <button
                  onClick={() => setIsEditingPost(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                >
                  Edit Post
                </button>
              )}
              {isEditingPost && (
                <button onClick={handleUpdatePost} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                  Save Post
                </button>
              )}
              {canDeletePost && (
                <button onClick={handleDeletePost} className="bg-red-500 text-white px-4 py-2 rounded">
                  Delete Post
                </button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white shadow-md rounded p-6 mb-4">
            <h2 className="text-2xl font-bold mb-4">Comments</h2>
            {comments?.map((comment) => {
              const canEditComment = user && comment.author._id === user.id;
              const canDeleteComment = user && (comment.author._id === user.id || ['admin', 'mod'].includes(user.role));

              return (
                <div key={comment._id} className="mb-4">
                  <p className="text-gray-700">
                    <strong>{comment.author.username}:</strong>
                    {editingCommentId === comment._id ? (
                      <input
                        type="text"
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="ml-2 border p-1 rounded"
                      />
                    ) : (
                      ` ${comment.content}`
                    )}
                  </p>

                  {/* Update & Delete Buttons for Comment */}
                  <div className="flex space-x-2">
                    {canEditComment && editingCommentId !== comment._id && (
                      <button onClick={() => handleUpdateComment(comment._id)} className="text-blue-500 text-sm">
                        Edit
                      </button>
                    )}
                    {canEditComment && editingCommentId === comment._id && (
                      <button onClick={() => handleSaveUpdatedComment(comment._id)} className="text-green-500 text-sm">
                        Save
                      </button>
                    )}
                    {canDeleteComment && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 text-sm">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add Comment Section */}
            {user && (
              <div className="mt-6">
                {isAddingComment ? (
                  <div>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-4 border rounded mb-2"
                      rows="3"
                      placeholder="Add a comment..."
                    />
                    <button onClick={handleAddComment} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                      Submit
                    </button>
                    <button
                      onClick={() => setIsAddingComment(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingComment(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Add Comment
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostPage;
