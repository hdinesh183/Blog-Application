import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Save, X } from 'lucide-react';
import axios from 'axios';

const CommentItem = ({ comment, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const [loading, setLoading] = useState(false);

  const isAuthor = user && user.username === comment.username;

  const handleUpdate = async () => {
    if (!editValue.trim() || editValue === comment.comment) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await axios.put(`/api/comments/${comment.id}`, { comment: editValue });
      onUpdate(comment.id, editValue);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-item">
      <div className="comment-info">
        <span className="comment-user">{comment.username}</span>
        <span className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>
      
      {isEditing ? (
        <div className="comment-edit">
          <textarea 
            value={editValue} 
            onChange={(e) => setEditValue(e.target.value)}
          />
          <div className="comment-actions">
            <button onClick={handleUpdate} disabled={loading} className="btn-save"><Save size={16} /></button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel"><X size={16} /></button>
          </div>
        </div>
      ) : (
        <p className="comment-text">{comment.comment}</p>
      )}

      {isAuthor && !isEditing && (
        <div className="comment-actions">
          <button onClick={() => setIsEditing(true)}><Edit size={14} /></button>
          <button onClick={() => onDelete(comment.id)} className="btn-delete"><Trash2 size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
