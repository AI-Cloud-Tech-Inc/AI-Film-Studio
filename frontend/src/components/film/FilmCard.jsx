const FilmCard = ({ film, onRefresh }) => {
  const getStatusBadge = (status) => {
    const badges = {
      completed: { color: 'success', icon: '✅', text: 'Completed' },
      in_progress: { color: 'warning', icon: '⏳', text: 'In Progress' },
      failed: { color: 'error', icon: '❌', text: 'Failed' },
      queued: { color: 'info', icon: '📋', text: 'Queued' },
    };
    return badges[status] || badges.queued;
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this film?')) {
      try {
        // await api.deleteFilm(film.id);
        onRefresh?.();
      } catch (err) {
        console.error('Failed to delete film:', err);
        alert('Failed to delete film');
      }
    }
  };

  const badge = getStatusBadge(film.status);
  const createdDate = new Date(film.created_at).toLocaleDateString();

  return (
    <div className={`film-card status-${film.status}`}>
      <div className="film-card-header">
        <div className={`status-badge badge-${badge.color}`}>
          <span>{badge.icon}</span>
          <span>{badge.text}</span>
        </div>
        <div className="film-actions">
          <button className="btn-icon" title="View Details">
            👁️
          </button>
          <button className="btn-icon" title="Download">
            ⬇️
          </button>
          <button className="btn-icon" onClick={handleDelete} title="Delete">
            🗑️
          </button>
        </div>
      </div>

      <div className="film-card-content">
        <h3 className="film-prompt">{film.prompt}</h3>
        
        <div className="film-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{createdDate}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{film.duration}s</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🎞️</span>
            <span>{film.scenes} scenes</span>
          </div>
        </div>

        {film.status === 'in_progress' && (
          <div className="progress-bar small">
            <div className="progress-fill" style={{ width: '60%' }} />
          </div>
        )}
      </div>

      <div className="film-card-footer">
        <button className="btn-secondary btn-small">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default FilmCard;
