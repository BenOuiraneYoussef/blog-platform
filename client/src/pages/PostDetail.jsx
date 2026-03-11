import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Comments from '../components/Comments';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${slug}`);
        setPost(data);
      } catch (err) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      navigate('/');
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;

  const isAuthor = user && user._id === post.author._id;
console.log('user id:', user?._id, 'author id:', post?.author?._id);
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '2.2rem', lineHeight: '1.3' }}>{post.title}</h1>

      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
        By{' '}
        <Link to={`/profile/${post.author.username}`} style={{ fontWeight: '600', color: '#333' }}>
          {post.author.username}
        </Link>{' '}
        · {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {post.tags.map((tag) => (
            <span key={tag} style={{ background: '#f0f0f0', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', color: '#555' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ background: 'white', padding: '2rem', borderRadius: '10px', lineHeight: '1.9', fontSize: '1.05rem', marginBottom: '2rem', color: '#444' }}>
        {post.content}
      </div>

      {isAuthor && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link
            to={`/edit/${post.slug}`}
            style={{ padding: '0.5rem 1.25rem', background: '#333', color: 'white', borderRadius: '6px', fontWeight: '500' }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            style={{ padding: '0.5rem 1.25rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            Delete
          </button>
        </div>
      )}

      <Comments postId={post._id} />
    </div>
  );
}

export default PostDetail;