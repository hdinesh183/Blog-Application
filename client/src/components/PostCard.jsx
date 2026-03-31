import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ArrowRight } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <article className="post-card">
      <div className="post-card-content">
        <h2 className="post-title">{post.title}</h2>
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
