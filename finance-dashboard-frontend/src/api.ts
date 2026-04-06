import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add JWT token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  console.log('[API] Request to', config.url, 'Token present:', !!token)
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (!token) {
    console.warn('[API] No token found in localStorage')
  }
  
  return config
})

// Response interceptor: Handle 401 errors by clearing token and redirecting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('[API] 401 Unauthorized - Token invalid or expired')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
