import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { username } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, postsRes] = await Promise.all([
          API.get(`/users/${username}`),
          API.get(`/users/${username}/posts`),
        ]);
        setProfileUser(userRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError('User not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return <p className="text-center mt-2">Loading...</p>;
  if (error) return <p className="text-center mt-2 error-msg">{error}</p>;

  return (
    <div className="page-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {profileUser.username[0].toUpperCase()}
        </div>
        <h2 className="profile-username">{profileUser.username}</h2>
        {profileUser.bio && (
          <p className="profile-bio">{profileUser.bio}</p>
        )}
        <p className="profile-stats">{posts.length} posts</p>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Posts by {profileUser.username}</h3>

      {posts.length === 0 ? (
        <p className="text-muted">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h2>
              <Link to={`/post/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="post-meta">
              {new Date(post.createdAt).toLocaleDateString()}
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

export default Profile;