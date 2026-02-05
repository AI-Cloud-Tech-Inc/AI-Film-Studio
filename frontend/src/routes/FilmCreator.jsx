import { useState, useEffect } from 'react';
import api from '../services/api';

const FilmCreator = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    style: 'cinematic',
    duration: 30,
    voice_id: '',
    music_style: 'ambient',
    model: 'gpt-4',
  });

  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVoices();
  }, []);

  const loadVoices = async () => {
    try {
      const data = await api.getVoices();
      setVoices(data.voices || []);
      if (data.voices?.length > 0) {
        setFormData(prev => ({ ...prev, voice_id: data.voices[0].voice_id }));
      }
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProgress({ stage: 'Initializing...', progress: 0 });

    try {
      // Simulate progress updates
      const progressStages = [
        { stage: 'Director creating vision...', progress: 10 },
        { stage: 'Screenwriter writing script...', progress: 25 },
        { stage: 'Generating video scenes...', progress: 50 },
        { stage: 'Generating audio...', progress: 75 },
        { stage: 'Editor assembling final film...', progress: 90 },
        { stage: 'Complete!', progress: 100 },
      ];

      let currentStage = 0;
      const progressInterval = setInterval(() => {
        if (currentStage < progressStages.length) {
          setProgress(progressStages[currentStage]);
          currentStage++;
        }
      }, 3000);

      const response = await api.createFilm(formData);
      
      clearInterval(progressInterval);
      setProgress({ stage: 'Complete!', progress: 100 });
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to create film');
      console.error('Film creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  return (
    <div className="film-creator">
      <div className="creator-header">
        <h1>🎬 Create Your Film</h1>
        <p>Transform your vision into reality with autonomous AI agents</p>
      </div>

      <div className="creator-content">
        <form onSubmit={handleSubmit} className="creator-form">
          <div className="form-group">
            <label htmlFor="prompt">
              Film Concept <span className="required">*</span>
            </label>
            <textarea
              id="prompt"
              name="prompt"
              value={formData.prompt}
              onChange={handleInputChange}
              placeholder="Describe your film idea... (e.g., 'A cyberpunk city at night with neon lights and flying vehicles')"
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="style">Visual Style</label>
              <select
                id="style"
                name="style"
                value={formData.style}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="cinematic">Cinematic</option>
                <option value="documentary">Documentary</option>
                <option value="anime">Anime</option>
                <option value="cartoon">Cartoon</option>
                <option value="realistic">Realistic</option>
                <option value="abstract">Abstract</option>
                <option value="noir">Film Noir</option>
                <option value="sci-fi">Sci-Fi</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (seconds)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="10"
                max="300"
                step="10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="voice_id">Voice</label>
              <select
                id="voice_id"
                name="voice_id"
                value={formData.voice_id}
                onChange={handleInputChange}
                disabled={loading}
              >
                {voices.map(voice => (
                  <option key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="music_style">Music Style</label>
              <select
                id="music_style"
                name="music_style"
                value={formData.music_style}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="ambient">Ambient</option>
                <option value="electronic">Electronic</option>
                <option value="orchestral">Orchestral</option>
                <option value="jazz">Jazz</option>
                <option value="rock">Rock</option>
                <option value="cinematic">Cinematic</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="model">AI Model</label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="gpt-4">GPT-4 (OpenAI)</option>
              <option value="claude-3-opus">Claude 3 Opus (Anthropic)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Anthropic)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary btn-large"
            disabled={loading || !formData.prompt}
          >
            {loading ? '🎬 Creating Film...' : '🚀 Create Film'}
          </button>
        </form>

        {progress && (
          <div className="progress-section">
            <h3>Production Progress</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className="progress-text">{progress.stage}</p>
            <p className="progress-percent">{progress.progress}%</p>
          </div>
        )}

        {error && (
          <div className="error-section">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <h3>✅ Film Created Successfully!</h3>
            <div className="result-details">
              <p><strong>Film ID:</strong> {result.film_id}</p>
              <p><strong>Scenes:</strong> {result.scenes?.length || 0}</p>
              <p><strong>Status:</strong> {result.status}</p>
              
              {result.director_vision && (
                <div className="vision-section">
                  <h4>🎬 Director's Vision</h4>
                  <p>{result.director_vision.vision}</p>
                  <p><strong>Style:</strong> {result.director_vision.style}</p>
                </div>
              )}

              {result.scenes && result.scenes.length > 0 && (
                <div className="scenes-section">
                  <h4>🎞️ Scenes ({result.scenes.length})</h4>
                  {result.scenes.map((scene, idx) => (
                    <div key={idx} className="scene-card">
                      <h5>Scene {scene.scene_number}</h5>
                      <p><strong>Description:</strong> {scene.description}</p>
                      {scene.script && <p><strong>Script:</strong> {scene.script.narration}</p>}
                      {scene.video_path && (
                        <p><strong>Video:</strong> <a href={scene.video_path} target="_blank" rel="noopener noreferrer">View</a></p>
                      )}
                      {scene.audio_path && (
                        <p><strong>Audio:</strong> <a href={scene.audio_path} target="_blank" rel="noopener noreferrer">Listen</a></p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {result.timeline && (
                <div className="timeline-section">
                  <h4>✂️ Editor's Timeline</h4>
                  <p><strong>Total Duration:</strong> {result.timeline.total_duration}s</p>
                  <p><strong>Transitions:</strong> {result.timeline.transitions?.join(', ')}</p>
                  <p><strong>Effects:</strong> {result.timeline.effects?.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmCreator;
