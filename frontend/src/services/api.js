import axios from 'axios';
import { showToast } from '../utils/toast';

const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
});

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem('profile');
  if (profile) {
    const parsedProfile = JSON.parse(profile);
    if (parsedProfile.token) {
      req.headers.Authorization = `Bearer ${parsedProfile.token}`;
    }
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('profile');
      window.location.href = '/login';
      showToast('Session expired. Please login again.', 'error');
    } else if (error.response?.data?.error) {
      showToast(error.response.data.error, 'error');
    } else {
      showToast('An unexpected error occurred', 'error');
    }
    return Promise.reject(error);
  }
);

export const signIn = (formData) => API.post('/auth/login', formData);
export const signUp = (formData) => API.post('/auth/register', formData);
export const getCurrentUser = () => API.get('/auth/me');

export const fetchEmployees = (filters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return API.get('/employees', { params });
};
export const fetchEmployee = (id) => API.get(`/employees/${id}`);
export const createEmployee = (employeeData) => API.post('/employees', employeeData);
export const updateEmployee = (id, employeeData) => API.put(`/employees/${id}`, employeeData);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);