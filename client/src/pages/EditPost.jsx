import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

function EditPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [postId, setPostId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${slug}`);
        setPostId(data._id);
        setFormData({
          title: data.title,
          content: data.content,
          tags: data.tags.join(', '),
        });
      } catch (err) {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      const { data } = await API.put(`/posts/${postId}`, payload);
      navigate(`/post/${data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-2">Loading...</p>;

  return (
    <div className="editor-container">
      <h1>Edit Post</h1>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="Write your post here..."
          value={formData.content}
          onChange={handleChange}
          rows={15}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated: javascript, react, nodejs)"
          value={formData.tags}
          onChange={handleChange}
        />
        <button type="submit" disabled={saving} className="btn btn-dark">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default EditPost;