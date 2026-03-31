import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CommentItem from '../components/CommentItem';
import { User, Calendar, Edit, Trash2, ArrowLeft, Send, Loader2 } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resp = await axios.get(`/api/posts/${id}`);
        setPost(resp.data);
        setComments(resp.data.comments || []);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handlePostDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${id}`);
        navigate('/');
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await axios.post('/api/comments', { post_id: id, comment: newComment });
      setNewComment('');
      // Refresh comments
      const resp = await axios.get(`/api/posts/${id}`);
      setComments(resp.data.comments || []);
    } catch (err) {
      alert("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const onCommentUpdate = (commentId, content) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, comment: content } : c));
  };

  const onCommentDelete = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await axios.delete(`/api/comments/${commentId}`);
        setComments(comments.filter(c => c.id !== commentId));
      } catch (err) {
        alert("Failed to delete comment");
      }
    }
  };

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spinner" size={48} />
      <span>Loading post...</span>
    </div>
  );

  if (error || !post) return <div className="error-alert">{error || "Post not found"}</div>;

  const isAuthor = user && user.id === post.author_id;

  return (
    <div className="post-detail-page">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to stories</Link>
      
      <article className="post-full">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author"><User size={16} /> {post.author_name}</span>
            <span className="post-date"><Calendar size={16} /> {new Date(post.created_at).toLocaleDateString()}</span>
            {isAuthor && (
              <div className="author-actions">
                <Link to={`/edit/${post.id}`} className="btn-edit"><Edit size={16} /> Edit</Link>
                <button onClick={handlePostDelete} className="btn-delete"><Trash2 size={16} /> Delete</button>
              </div>
            )}
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea 
              placeholder="What are your thoughts?" 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
              Post Comment
            </button>
          </form>
        ) : (
          <p className="login-prompt">
            Please <Link to="/login">login</Link> to join the conversation.
          </p>
        )}

        <div className="comments-list">
          {comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onUpdate={onCommentUpdate}
              onDelete={onCommentDelete}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
