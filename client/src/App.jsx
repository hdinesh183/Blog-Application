import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/create" element={<PostForm />} />
              <Route path="/edit/:id" element={<PostForm />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>&copy; 2026 DevBlog. Built with love and passion.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
