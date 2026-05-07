const API_URL = 'http://localhost:8000/api';

const getToken = () => {
  // Try multiple possible keys
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('access') ||
    localStorage.getItem('token')
  );
};

const getHeaders = () => {
  const token = getToken();

  console.log("JWT TOKEN:", token);

  return {
    'Content-Type': 'application/json',
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("API ERROR:", data);
    throw new Error(data.detail || data.message || 'API Error');
  }

  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await handleResponse(response);

  // Save token properly
  if (data.access) {
    localStorage.setItem('access_token', data.access);
  }

  if (data.refresh) {
    localStorage.setItem('refresh_token', data.refresh);
  }

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const submitAssessment = async (data) => {
  const response = await fetch(`${API_URL}/assessments/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(response);
};

export const fetchTrends = async () => {
  const response = await fetch(`${API_URL}/trends/`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
};

export const fetchAssessments = async () => {
  const response = await fetch(`${API_URL}/assessments/`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
};

export const fetchDashboardAnalytics = async () => {
  const response = await fetch(`${API_URL}/dashboard-analytics/`, {
    headers: getHeaders(),
  });

  return handleResponse(response);
};