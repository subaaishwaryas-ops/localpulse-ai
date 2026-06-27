import axios from 'axios'

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' 
})

export const onboardShop = (data) => api.post('/shops/onboard', data)
export const updateStatus = (data) => api.post('/shops/status', data)
export const searchShops = (data) => api.post('/search/', data)
export const getNearby = (lat, lng) => api.get(`/search/nearby?lat=${lat}&lng=${lng}`)
export const getGaps = (area) => api.get(`/gaps/${area}`)
export const getDashboard = (phone) => api.get(`/dashboard/${phone}`)