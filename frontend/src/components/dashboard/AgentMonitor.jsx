const AgentMonitor = ({ status }) => {
  const getStatusColor = (isActive) => {
    return isActive ? 'status-active' : 'status-inactive';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? '✅' : '⚪';
  };

  return (
    <div className="agent-monitor">
      <h2>🤖 Agent Status</h2>
      
      <div className="agents-grid">
        {/* Director Agent */}
        <div className="agent-card">
          <div className="agent-header">
            <span className={`agent-status ${getStatusColor(status.agents?.director)}`}>
              {getStatusIcon(status.agents?.director)}
            </span>
            <h3>🎬 Director Agent</h3>
          </div>
          <p className="agent-description">Creative vision & scene breakdown</p>
          <div className="agent-stats">
            <span className="stat-label">Model:</span>
            <span className="stat-value">{status.config?.text_model || 'GPT-4'}</span>
          </div>
        </div>

        {/* Screenwriter Agent */}
        <div className="agent-card">
          <div className="agent-header">
            <span className={`agent-status ${getStatusColor(status.agents?.screenwriter)}`}>
              {getStatusIcon(status.agents?.screenwriter)}
            </span>
            <h3>✍️ Screenwriter Agent</h3>
          </div>
          <p className="agent-description">Script & dialogue generation</p>
          <div className="agent-stats">
            <span className="stat-label">Model:</span>
            <span className="stat-value">{status.config?.text_model || 'GPT-4'}</span>
          </div>
        </div>

        {/* Editor Agent */}
        <div className="agent-card">
          <div className="agent-header">
            <span className={`agent-status ${getStatusColor(status.agents?.editor)}`}>
              {getStatusIcon(status.agents?.editor)}
            </span>
            <h3>✂️ Editor Agent</h3>
          </div>
          <p className="agent-description">Timeline assembly & effects</p>
          <div className="agent-stats">
            <span className="stat-label">Status:</span>
            <span className="stat-value">Ready</span>
          </div>
        </div>

        {/* Orchestrator */}
        <div className="agent-card">
          <div className="agent-header">
            <span className={`agent-status ${getStatusColor(status.agents?.orchestrator)}`}>
              {getStatusIcon(status.agents?.orchestrator)}
            </span>
            <h3>🎼 Orchestrator</h3>
          </div>
          <p className="agent-description">Multi-agent coordination</p>
          <div className="agent-stats">
            <span className="stat-label">Status:</span>
            <span className="stat-value">Active</span>
          </div>
        </div>
      </div>

      {/* AI Services */}
      <div className="services-section">
        <h3>🔌 AI Services</h3>
        <div className="services-grid">
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.openai)}`}>
              {getStatusIcon(status.services?.openai)}
            </span>
            <span>OpenAI</span>
          </div>
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.anthropic)}`}>
              {getStatusIcon(status.services?.anthropic)}
            </span>
            <span>Anthropic</span>
          </div>
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.stable_diffusion)}`}>
              {getStatusIcon(status.services?.stable_diffusion)}
            </span>
            <span>Stable Diffusion</span>
          </div>
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.runway)}`}>
              {getStatusIcon(status.services?.runway)}
            </span>
            <span>RunwayML</span>
          </div>
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.elevenlabs)}`}>
              {getStatusIcon(status.services?.elevenlabs)}
            </span>
            <span>ElevenLabs</span>
          </div>
          <div className="service-item">
            <span className={`service-status ${getStatusColor(status.services?.musicgen)}`}>
              {getStatusIcon(status.services?.musicgen)}
            </span>
            <span>MusicGen</span>
          </div>
        </div>
      </div>

      {status.message && (
        <div className="status-message">
          <p>{status.message}</p>
        </div>
      )}
    </div>
  );
};

export default AgentMonitor;
