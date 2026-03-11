import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get('/posts');
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-2">Loading...</p>;
  if (error) return <p className="text-center mt-2 error-msg">{error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">Latest Posts</h1>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet. Be the first to write one!</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">
              By{' '}
              <Link to={`/profile/${post.author.username}`}>
                {post.author.username}
              </Link>{' '}
              · {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p className="post-excerpt">{post.content.slice(0, 150)}...</p>
            {post.tags.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Home;