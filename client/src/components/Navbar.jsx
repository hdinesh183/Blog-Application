import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PlusCircle, User, BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <BookOpen size={24} />
        <span>DevBlog</span>
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/create" className="nav-link btn-icon">
              <PlusCircle size={20} />
              <span>Create Post</span>
            </Link>
            <div className="nav-user">
              <User size={20} />
              <span>{user.username}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
