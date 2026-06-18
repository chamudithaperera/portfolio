import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { apiRequest } from '../utils/api';
import './Admin.css';

const iconPaths = {
  arrowLeft: ['M19 12H5', 'm11 18-6-6 6-6'],
  arrowRight: ['M5 12h14', 'm13 6 6 6-6 6'],
  calendar: ['M3 5h18v16H3z', 'M16 3v4', 'M8 3v4', 'M3 10h18'],
  check: ['m5 12 4 4L19 6'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  inbox: ['M4 5h16v14H4z', 'M4 13h4l2 3h4l2-3h4'],
  lock: ['M8 11V8a4 4 0 0 1 8 0v3', 'M6 11h12v9H6z', 'M12 15v2'],
  logout: ['M10 5H5v14h5', 'M14 12H3', 'm16 8 4-4-4-4'],
  mail: ['M4 4h16v16H4z', 'm4 6 8 6 8-6'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  phone: ['M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L9 10.9a16 16 0 0 0 4.1 4.1l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .6 2.9.7a2 2 0 0 1 1.7 2z'],
  pin: ['M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z', 'M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5'],
  search: ['M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z', 'm16 16 5 5'],
  send: ['m22 2-7 20-4-9-9-4z', 'M22 2 11 13'],
  spark: ['m12 3-1.2 3.2L8 7.5l2.8 1.3L12 12l1.2-3.2L16 7.5l-2.8-1.3L12 3z'],
};

function Icon({ name, size = 16, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(iconPaths[name] || iconPaths.spark).map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}

function formatDate(value) {
  if (!value) return 'Unknown time';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function Admin() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginPending, setLoginPending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [search, setSearch] = useState('');
  const [logoutPending, setLogoutPending] = useState(false);

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) || messages[0] || null,
    [messages, selectedMessageId],
  );

  const stats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((message) => message.status === 'new').length;
    const withPhone = messages.filter((message) => Boolean(message.phone)).length;
    return {
      total,
      unread,
      withPhone,
    };
  }, [messages]);

  const latestMessageDate = selectedMessage?.created_at || messages[0]?.created_at || null;
  const sidebarItems = [
    { label: 'Overview', target: 'admin-overview', icon: 'spark' },
    { label: 'Inbox', target: 'admin-inbox', icon: 'inbox' },
    { label: 'Details', target: 'admin-detail', icon: 'mail' },
  ];

  const scrollToSection = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  async function loadMessages(query = search) {
    setMessagesLoading(true);
    setMessagesError('');
    try {
      const response = await apiRequest(`/api/admin/messages?search=${encodeURIComponent(query)}`);
      const loadedMessages = response.messages || [];
      setMessages(loadedMessages);
      setSelectedMessageId((current) => {
        if (current && loadedMessages.some((message) => message.id === current)) {
          return current;
        }
        return loadedMessages[0]?.id || '';
      });
    } catch (error) {
      setMessagesError(error.message || 'Unable to load messages right now.');
    } finally {
      setMessagesLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const response = await apiRequest('/api/admin/session');
        if (!active) return;
        if (response.authenticated) {
          setAuthenticated(true);
          await loadMessages('');
        } else {
          setAuthenticated(false);
        }
      } catch {
        if (active) {
          setAuthenticated(false);
        }
      } finally {
        if (active) {
          setBootstrapping(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!authenticated) return undefined;

    const timer = window.setTimeout(() => {
      loadMessages(search);
    }, 250);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, authenticated]);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');
    setLoginPending(true);

    try {
      await apiRequest('/api/admin/login', {
        method: 'POST',
        body: loginForm,
      });
      setAuthenticated(true);
      setSearch('');
      await loadMessages('');
    } catch (error) {
      setLoginError(error.message || 'Login failed.');
    } finally {
      setLoginPending(false);
    }
  };

  const handleLogout = async () => {
    setLogoutPending(true);
    try {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      setAuthenticated(false);
      setMessages([]);
      setSelectedMessageId('');
      setSearch('');
      setLoginForm((current) => ({ ...current, password: '' }));
    } catch (error) {
      setMessagesError(error.message || 'Logout failed.');
    } finally {
      setLogoutPending(false);
    }
  };

  if (bootstrapping) {
    return (
      <div className="admin-shell">
        <Helmet>
          <title>Admin Inbox | ChamXdev</title>
        </Helmet>
        <div className="admin-loading">
          <span className="admin-loading-orb" />
          <p>Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="admin-shell admin-auth-shell">
        <Helmet>
          <title>Admin Login | ChamXdev</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="admin-auth-ambient" aria-hidden="true" />
        <div className="admin-auth-card">
          <div className="admin-auth-badge">
            <Icon name="lock" size={14} />
            Secure Admin Access
          </div>
          <h1>ChamXdev Admin</h1>
          <p>Sign in to review the latest messages from your portfolio contact form.</p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <label>
              <span>Username</span>
              <input
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
                autoComplete="username"
                placeholder="admin.chamuditha"
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
              />
            </label>
            {loginError ? <div className="admin-form-error">{loginError}</div> : null}
            <button className="admin-primary-button" type="submit" disabled={loginPending}>
              {loginPending ? <span className="admin-spinner" aria-hidden="true" /> : <Icon name="lock" size={15} />}
              {loginPending ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="admin-auth-footer">
            <a href="/" className="admin-link">
              <Icon name="arrowLeft" size={14} />
              Back to portfolio
            </a>
            <span>https://chamudithaperera.online/admin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <Helmet>
        <title>Admin Inbox | ChamXdev</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="admin-background" aria-hidden="true" />
      <div className="admin-page admin-dashboard-page">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-auth-badge">
              <Icon name="lock" size={14} />
              Secure Admin Access
            </div>
            <h1>Portfolio Dashboard</h1>
            <p>Monitor incoming contact submissions with a focused inbox view and quick navigation.</p>
            <div className="admin-sidebar-status">
              <span />
              Live inbox
            </div>
          </div>

          <div className="admin-sidebar-section admin-sidebar-nav">
            <p className="admin-sidebar-label">Dashboard</p>
            {sidebarItems.map((item) => (
              <button key={item.target} type="button" onClick={() => scrollToSection(item.target)}>
                <Icon name={item.icon} size={14} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="admin-sidebar-section admin-sidebar-metrics">
            <p className="admin-sidebar-label">Snapshot</p>
            <div className="admin-sidebar-metric">
              <span>Total messages</span>
              <strong>{stats.total.toString().padStart(2, '0')}</strong>
            </div>
            <div className="admin-sidebar-metric">
              <span>Unread</span>
              <strong>{stats.unread.toString().padStart(2, '0')}</strong>
            </div>
            <div className="admin-sidebar-metric">
              <span>With phone</span>
              <strong>{stats.withPhone.toString().padStart(2, '0')}</strong>
            </div>
            <div className="admin-sidebar-note">
              <Icon name="calendar" size={13} />
              <span>{latestMessageDate ? formatDate(latestMessageDate) : 'Waiting for new messages'}</span>
            </div>
          </div>

          <div className="admin-sidebar-section admin-sidebar-footer">
            <a href="/" className="admin-sidebar-link">
              <Icon name="arrowLeft" size={14} />
              Back to portfolio
            </a>
            <button type="button" className="admin-secondary-button admin-sidebar-logout" onClick={handleLogout} disabled={logoutPending}>
              <Icon name="logout" size={14} />
              {logoutPending ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <div>
              <p className="admin-kicker">
                <Icon name="inbox" size={13} />
                Message Center
              </p>
              <h1>Portfolio Inbox</h1>
              <p>Review submissions from the public contact form in one place.</p>
            </div>
            <div className="admin-topbar-actions">
              <a href="/" className="admin-secondary-button">
                <Icon name="arrowLeft" size={14} />
                Portfolio
              </a>
              <button type="button" className="admin-secondary-button" onClick={() => loadMessages(search)} disabled={messagesLoading}>
                <Icon name="search" size={14} />
                {messagesLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </header>

          <section className="admin-stats-grid" id="admin-overview">
            <article className="admin-stat-card">
              <span>Total messages</span>
              <strong>{stats.total.toString().padStart(2, '0')}</strong>
            </article>
            <article className="admin-stat-card">
              <span>New</span>
              <strong>{stats.unread.toString().padStart(2, '0')}</strong>
            </article>
            <article className="admin-stat-card">
              <span>With phone</span>
              <strong>{stats.withPhone.toString().padStart(2, '0')}</strong>
            </article>
          </section>

          <section className="admin-inbox-grid" id="admin-inbox">
          <aside className="admin-list-panel">
            <div className="admin-panel-header">
              <div>
                <h2>Messages</h2>
                <p>Latest submissions are listed first.</p>
              </div>
              <span className="admin-count-pill">{messages.length}</span>
            </div>
            <label className="admin-search">
              <Icon name="search" size={14} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, subject..."
              />
            </label>
            {messagesError ? <div className="admin-form-error">{messagesError}</div> : null}
            <div className="admin-message-list">
              {messagesLoading ? (
                <div className="admin-list-state">
                  <span className="admin-spinner" aria-hidden="true" />
                  Loading messages...
                </div>
              ) : messages.length ? (
                messages.map((message) => {
                  const isActive = selectedMessage?.id === message.id;
                  return (
                    <button
                      key={message.id}
                      type="button"
                      className={`admin-message-card ${isActive ? 'is-active' : ''}`}
                      onClick={() => setSelectedMessageId(message.id)}
                    >
                      <div className="admin-message-card-top">
                        <strong>{message.name}</strong>
                        <span className={`admin-status-badge admin-status-${message.status || 'new'}`}>
                          {message.status || 'new'}
                        </span>
                      </div>
                      <p>{message.subject}</p>
                      <div className="admin-message-meta">
                        <span>
                          <Icon name="mail" size={12} />
                          {message.email}
                        </span>
                        <span>
                          <Icon name="calendar" size={12} />
                          {formatDate(message.created_at)}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="admin-empty-state">
                  <Icon name="inbox" size={18} />
                  <h3>No messages found</h3>
                  <p>{search ? 'Try another search term.' : 'New submissions will appear here.'}</p>
                </div>
              )}
            </div>
          </aside>

          <section className="admin-detail-panel" id="admin-detail">
            {selectedMessage ? (
              <article className="admin-detail-card">
                <div className="admin-detail-header">
                  <div>
                    <p className="admin-detail-label">Selected message</p>
                    <h2>{selectedMessage.subject}</h2>
                    <p className="admin-detail-subtitle">
                      From {selectedMessage.name} on {formatDate(selectedMessage.created_at)}
                    </p>
                  </div>
                  <span className={`admin-status-badge admin-status-${selectedMessage.status || 'new'}`}>
                    {selectedMessage.status || 'new'}
                  </span>
                </div>

                <div className="admin-contact-grid">
                  <div>
                    <span className="admin-contact-label">
                      <Icon name="mail" size={12} />
                      Email
                    </span>
                    <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                  </div>
                  <div>
                    <span className="admin-contact-label">
                      <Icon name="phone" size={12} />
                      Phone
                    </span>
                    {selectedMessage.phone ? (
                      <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                    ) : (
                      <span className="admin-muted">Not provided</span>
                    )}
                  </div>
                  <div>
                    <span className="admin-contact-label">
                      <Icon name="pin" size={12} />
                      Status
                    </span>
                    <span className="admin-muted">{selectedMessage.status || 'new'}</span>
                  </div>
                </div>

                <div className="admin-message-body">
                  <div className="admin-message-body-label">
                    <Icon name="send" size={12} />
                    Message
                  </div>
                  <p>{selectedMessage.message}</p>
                </div>

                <div className="admin-detail-footer">
                  <a href={`mailto:${selectedMessage.email}`} className="admin-secondary-button">
                    <Icon name="mail" size={14} />
                    Reply by email
                  </a>
                  {selectedMessage.phone ? (
                    <a href={`tel:${selectedMessage.phone}`} className="admin-secondary-button">
                      <Icon name="phone" size={14} />
                      Call sender
                    </a>
                  ) : null}
                </div>
              </article>
            ) : (
              <div className="admin-detail-empty">
                <Icon name="inbox" size={22} />
                <h2>No message selected</h2>
                <p>Choose a message from the list to read the full conversation details.</p>
              </div>
            )}
          </section>
        </section>
        </main>
      </div>
    </div>
  );
}

export default Admin;
