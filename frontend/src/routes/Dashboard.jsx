import { useState, useEffect } from 'react';
import api from '../services/api';
import FilmCard from '../components/film/FilmCard';
import AgentMonitor from '../components/dashboard/AgentMonitor';

const Dashboard = () => {
  const [films, setFilms] = useState([]);
  const [agentStatus, setAgentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_films: 0,
    active_generations: 0,
    total_scenes: 0,
    avg_duration: 0,
  });

  useEffect(() => {
    loadDashboardData();
    // Refresh every 10 seconds
    const interval = setInterval(loadDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statusData] = await Promise.all([
        api.getAgentStatus(),
        // Films endpoint would be added here when backend implements it
      ]);
      
      setAgentStatus(statusData);
      
      // Mock films data for now
      setFilms([
        {
          id: '1',
          prompt: 'A cyberpunk city at night',
          status: 'completed',
          created_at: new Date().toISOString(),
          duration: 30,
          scenes: 5,
        },
        {
          id: '2',
          prompt: 'Mountain landscape at sunrise',
          status: 'in_progress',
          created_at: new Date().toISOString(),
          duration: 45,
          scenes: 7,
        },
      ]);
      
      setStats({
        total_films: 2,
        active_generations: 1,
        total_scenes: 12,
        avg_duration: 37.5,
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard error">
        <h2>❌ Error Loading Dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <button onClick={loadDashboardData} className="btn-secondary">
          🔄 Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎬</div>
          <div className="stat-content">
            <h3>{stats.total_films}</h3>
            <p>Total Films</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>{stats.active_generations}</h3>
            <p>Active Generations</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎞️</div>
          <div className="stat-content">
            <h3>{stats.total_scenes}</h3>
            <p>Total Scenes</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>{stats.avg_duration}s</h3>
            <p>Avg Duration</p>
          </div>
        </div>
      </div>

      {/* Agent Status Monitor */}
      {agentStatus && <AgentMonitor status={agentStatus} />}

      {/* Recent Films */}
      <div className="films-section">
        <div className="section-header">
          <h2>🎥 Recent Films</h2>
          <a href="/create" className="btn-primary">+ Create New Film</a>
        </div>
        
        {films.length > 0 ? (
          <div className="films-grid">
            {films.map(film => (
              <FilmCard key={film.id} film={film} onRefresh={loadDashboardData} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No films yet. Create your first film to get started!</p>
            <a href="/create" className="btn-primary">Create Film</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
