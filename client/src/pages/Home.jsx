import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const resp = await axios.get('/api/posts');
        setPosts(resp.data);
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`/api/posts/${postId}`);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (err) {
        alert("Failed to delete post. " + (err.response?.data?.error || ""));
      }
    }
  };

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spinner" size={48} />
      <span>Loading latest stories...</span>
    </div>
  );

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Recent Posts</h1>
        <p>Explore the latest insights from our community.</p>
      </header>
      
      {error && <div className="error-alert">{error}</div>}
      
      <div className="posts-grid">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              onDelete={() => handleDelete(post.id)} 
            />
          ))
        ) : (
          <div className="empty-state">
            <p>No posts found. Why not create the first one?</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
