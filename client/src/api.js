// All communication with the Express backend goes through this file.

const BASE = process.env.REACT_APP_API_URL || '/api';
const TOKEN_KEY = 'dc_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    /* empty body */
  }

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong.');
    err.status = res.status;
    throw err;
  }
  return data;
}

function qs(params = {}) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v);
  });
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const api = {
  // auth
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  login: (data) => request('/auth/login', { method: 'POST', body: data }),
  me: () => request('/auth/me'),

  // user
  updateProfile: (data) => request('/users/profile', { method: 'PUT', body: data }),
  stats: () => request('/users/stats'),

  // questions
  getQuestions: (params) => request(`/questions${qs(params)}`),
  getQuestion: (id) => request(`/questions/${id}`),
  askQuestion: (data) => request('/questions', { method: 'POST', body: data }),
  deleteQuestion: (id) => request(`/questions/${id}`, { method: 'DELETE' }),
  addAnswer: (id, content) =>
    request(`/questions/${id}/answers`, { method: 'POST', body: { content } }),
  deleteAnswer: (id, answerId) =>
    request(`/questions/${id}/answers/${answerId}`, { method: 'DELETE' }),
};
