const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Something went wrong');
  }

  return responseData;
}

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', 'POST', userData),
  login: (credentials) => apiRequest('/auth/login', 'POST', credentials),
};

// Services API
export const servicesAPI = {
  getAll: () => apiRequest('/services'),
  getById: (id) => apiRequest(`/services/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData, token) => apiRequest('/bookings', 'POST', bookingData, token),
  getMyBookings: (token) => apiRequest('/bookings/my-bookings', 'GET', null, token),
};

// Admin API
export const adminAPI = {
  getAllBookings: (token) => apiRequest('/admin/bookings', 'GET', null, token),
  updateBookingStatus: (id, status, token) => apiRequest(`/admin/bookings/${id}`, 'PUT', { status }, token),
  getAllUsers: (token) => apiRequest('/admin/users', 'GET', null, token),
};