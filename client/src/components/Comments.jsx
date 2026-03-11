import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/${postId}`);
        setComments(data);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await API.post(`/comments/${postId}`, {
        content: newComment,
      });
      const obj = { ...data, author: { ...data.author, _id: data.author._id.toString() } };
      setComments([obj, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  if (loading) return <p style={{ color: '#888' }}>Loading comments...</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Comments ({comments.length})</h3>

      {error && <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>}

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', marginBottom: '0.5rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.5rem 1.25rem', background: '#333', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p style={{ color: '#888', marginBottom: '2rem' }}>
          Please <Link to="/login" style={{ color: '#333', fontWeight: '600' }}>login</Link> to comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p style={{ color: '#888' }}>No comments yet. Be the first!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} style={{ background: 'white', padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{comment.author.username}</span>
              <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={{ color: '#444', lineHeight: '1.6' }}>{comment.content}</p>
            {user && user._id === comment.author._id && (
              <button
                onClick={() => handleDelete(comment._id)}
                style={{ marginTop: '0.5rem', padding: '0.25rem 0.75rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Comments;