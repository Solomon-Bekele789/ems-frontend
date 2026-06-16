import axios from 'axios'

// This is your FastAPI backend URL
const BASE_URL = 'http://127.0.0.1:9000'

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
})

// Automatically add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto logout if token expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api