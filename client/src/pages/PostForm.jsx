import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2, BookOpen } from 'lucide-react';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!id;

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      navigate('/login');
    }

    if (isEdit) {
      const fetchPost = async () => {
        setFetching(true);
        try {
          const resp = await axios.get(`/api/posts/${id}`);
          if (user && resp.data.author_id !== user.id) {
            navigate('/');
            return;
          }
          setTitle(resp.data.title);
          setContent(resp.data.content);
        } catch (err) {
          setError("Failed to fetch post details");
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, isEdit, user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await axios.put(`/api/posts/${id}`, { title, content });
        navigate(`/post/${id}`);
      } else {
        const resp = await axios.post('/api/posts', { title, content });
        navigate(`/post/${resp.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || authLoading) return (
    <div className="loader-container">
      <Loader2 className="spinner" size={48} />
      <span>Preparing your story...</span>
    </div>
  );

  return (
    <div className="post-form-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Cancel</Link>
      
      <div className="form-card">
        <header className="form-header">
          <BookOpen size={40} className="form-icon" />
          <h1>{isEdit ? "Edit Story" : "Compose New Story"}</h1>
          <p>{isEdit ? "Refine your thoughts and share them again." : "Share your knowledge with the world."}</p>
        </header>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Give your story a catchy title"
              required 
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your story here... markdown is not supported but line breaks are."
              required 
              rows={12}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary form-submit">
            {loading ? <Loader2 className="spinner" size={20} /> : <Save size={20} />}
            <span>{isEdit ? "Update Story" : "Publish Story"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
