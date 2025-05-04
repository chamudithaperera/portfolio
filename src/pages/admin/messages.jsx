import React, { useState, useEffect } from 'react';
import './messages.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load messages. Please check your authentication token.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMessages();
    }
  }, [token]);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('adminToken', token);
    fetchMessages();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!token) {
    return (
      <div className="admin-login">
        <form onSubmit={handleTokenSubmit}>
          <h2>Admin Login</h2>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter admin token"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-messages">
      <div className="header">
        <h1>Contact Form Messages</h1>
        <button onClick={() => {
          localStorage.removeItem('adminToken');
          setToken('');
        }}>Logout</button>
      </div>

      {loading && <div className="loading">Loading messages...</div>}
      {error && <div className="error">{error}</div>}

      <div className="messages-list">
        {messages.map((msg) => (
          <div key={msg._id} className={`message-card ${msg.status}`}>
            <div className="message-header">
              <h3>{msg.subject || 'No Subject'}</h3>
              <span className={`status ${msg.status}`}>{msg.status}</span>
            </div>
            <div className="message-info">
              <p><strong>From:</strong> {msg.name} ({msg.email})</p>
              <p><strong>Date:</strong> {formatDate(msg.createdAt)}</p>
            </div>
            <div className="message-content">
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages; 