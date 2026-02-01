import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import FilmCreator from './pages/FilmCreator';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button 
              className="btn-icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="app-title">
              <span className="title-icon">🎬</span>
              AI Film Studio
            </h1>
          </div>
          <div className="header-right">
            <button className="btn-secondary">
              📊 Analytics
            </button>
            <button className="btn-secondary">
              ⚙️ Settings
            </button>
            <div className="user-menu">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=studio" 
                alt="User" 
                className="user-avatar"
              />
            </div>
          </div>
        </header>

        <div className="app-body">
          {/* Sidebar */}
          <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
            <nav className="sidebar-nav">
              <Link to="/" className="nav-item">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
              <Link to="/create" className="nav-item">
                <span className="nav-icon">🎬</span>
                <span className="nav-text">Create Film</span>
              </Link>
              <Link to="/films" className="nav-item">
                <span className="nav-icon">🎥</span>
                <span className="nav-text">My Films</span>
              </Link>
              <Link to="/agents" className="nav-item">
                <span className="nav-icon">🤖</span>
                <span className="nav-text">Agents</span>
              </Link>
              <Link to="/analytics" className="nav-item">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </Link>
              <Link to="/settings" className="nav-item">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Settings</span>
              </Link>
            </nav>

            <div className="sidebar-footer">
              <div className="system-status">
                <div className="status-indicator online"></div>
                <span>All Systems Online</span>
              </div>
              <p className="version">Enterprise v1.0.0</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create" element={<FilmCreator />} />
              <Route path="/films" element={
                <div className="page-placeholder">
                  <h2>🎥 My Films</h2>
                  <p>Films library coming soon...</p>
                </div>
              } />
              <Route path="/agents" element={
                <div className="page-placeholder">
                  <h2>🤖 Agents</h2>
                  <p>Agent management coming soon...</p>
                </div>
              } />
              <Route path="/analytics" element={
                <div className="page-placeholder">
                  <h2>📈 Analytics</h2>
                  <p>Advanced analytics coming soon...</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="page-placeholder">
                  <h2>⚙️ Settings</h2>
                  <p>Settings panel coming soon...</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
