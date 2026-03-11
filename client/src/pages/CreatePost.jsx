import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function CreatePost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      const { data } = await API.post('/posts', payload);
      navigate(`/post/${data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <h1>Write a Post</h1>

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
        <button type="submit" disabled={loading} className="btn btn-dark">
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;