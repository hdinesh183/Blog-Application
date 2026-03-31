import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const isAuthor = user && user.id === post.author_id;
  const isAdmin = user && user.username === 'asd';

  return (
    <article className="post-card">
      <div className="post-card-content">
        <div className="post-card-header">
          <h2 className="post-title">{post.title}</h2>
          {(isAuthor || isAdmin) && (
            <button 
              className="btn-delete-small" 
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              title="Delete post"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className="post-meta">
          <span className="post-author"><User size={14} /> {post.author_name}</span>
          <span className="post-date"><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
        <Link to={`/post/${post.id}`} className="read-more">
          Read Full Post <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

export default PostCard;
