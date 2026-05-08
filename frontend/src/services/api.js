const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://alz-dis-backend.onrender.com';


// =========================
// TOKEN HELPERS
// =========================

const getToken = () => {
  return (
    localStorage.getItem('access_token') ||
    localStorage.getItem('access') ||
    localStorage.getItem('token')
  );
};

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('access');
  localStorage.removeItem('token');
};


// =========================
// HEADERS
// =========================

const getHeaders = () => {
  const token = getToken();

  return {
    'Content-Type': 'application/json',
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};


// =========================
// RESPONSE HANDLER
// =========================

const handleResponse = async (response) => {
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    console.error('JSON Parse Error:', error);
  }

  if (!response.ok) {
    console.error('API ERROR:', data);

    // Auto logout if unauthorized
    if (response.status === 401) {
      clearTokens();
    }

    throw new Error(
      data.detail ||
      data.message ||
      'Something went wrong'
    );
  }

  return data;
};


// =========================
// GENERIC REQUEST FUNCTION
// =========================

const apiRequest = async (
  endpoint,
  method = 'GET',
  body = null,
  requiresAuth = true
) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: requiresAuth
      ? getHeaders()
      : {
          'Content-Type': 'application/json',
        },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  return handleResponse(response);
};


// =========================
// AUTH APIs
// =========================

export const loginUser = async (credentials) => {
  const data = await apiRequest(
    '/auth/login/',
    'POST',
    credentials,
    false
  );

  if (data.access) {
    localStorage.setItem('access_token', data.access);
  }

  if (data.refresh) {
    localStorage.setItem('refresh_token', data.refresh);
  }

  return data;
};


export const registerUser = async (userData) => {
  return apiRequest(
    '/auth/register/',
    'POST',
    userData,
    false
  );
};


export const logoutUser = () => {
  clearTokens();
};


// =========================
// ASSESSMENTS
// =========================

export const submitAssessment = async (data) => {
  return apiRequest(
    '/assessments/',
    'POST',
    data
  );
};


export const fetchAssessments = async () => {
  return apiRequest('/assessments/');
};


// =========================
// ANALYTICS
// =========================

export const fetchTrends = async () => {
  return apiRequest('/trends/');
};


export const fetchDashboardAnalytics = async () => {
  return apiRequest('/dashboard-analytics/');
};