// API Service for Autonomous Agentic AI Film Studio
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new APIError(
      error.detail || `HTTP ${response.status}`,
      response.status,
      error
    );
  }
  return response.json();
};

export const api = {
  // Film Creation
  async createFilm(filmData) {
    const response = await fetch(`${API_BASE_URL}/autonomous/create-film`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filmData),
    });
    return handleResponse(response);
  },

  async generateScene(sceneData) {
    const response = await fetch(`${API_BASE_URL}/autonomous/generate-scene`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sceneData),
    });
    return handleResponse(response);
  },

  // Agent Status
  async getAgentStatus() {
    const response = await fetch(`${API_BASE_URL}/autonomous/agent-status`);
    return handleResponse(response);
  },

  // Voices
  async getVoices() {
    const response = await fetch(`${API_BASE_URL}/autonomous/voices`);
    return handleResponse(response);
  },

  // Films Management
  async getFilms(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/films${queryString ? `?${queryString}` : ''}`);
    return handleResponse(response);
  },

  async getFilm(filmId) {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}`);
    return handleResponse(response);
  },

  async deleteFilm(filmId) {
    const response = await fetch(`${API_BASE_URL}/films/${filmId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Generation endpoints
  async textToVideo(data) {
    const response = await fetch(`${API_BASE_URL}/generation/text-to-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async textToSpeech(data) {
    const response = await fetch(`${API_BASE_URL}/audio/text-to-speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async generateMusic(data) {
    const response = await fetch(`${API_BASE_URL}/audio/generate-music`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // WebSocket connection for real-time updates
  createWebSocket(filmId) {
    const wsUrl = (API_BASE_URL.replace('http', 'ws')).replace('/api/v1', '');
    return new WebSocket(`${wsUrl}/ws/film/${filmId}`);
  },
};

export default api;
