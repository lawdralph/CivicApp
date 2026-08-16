import axios from 'axios'

const viteEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}

const api = axios.create({
  baseURL: viteEnv.VITE_API_URL || '/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  const map = {
    pending: 'Pending',
    under_review: 'Under Review',
    'under review': 'Under Review',
    in_progress: 'In Progress',
    'in progress': 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected',
  }
  return map[String(value).toLowerCase()] || String(value)
}

const normalizeReport = (report) => ({
  ...report,
  status: normalizeStatus(report.status),
  location: report.location || { lat: 0, lng: 0 },
})

export const apiService = {
  getReports: async () => {
    const response = await api.get('/admin/reports')
    const reports = Array.isArray(response.data?.data) ? response.data.data : []
    return reports.map(normalizeReport)
  },

  getReportById: async (reportId) => {
    const hasAdminToken = Boolean(localStorage.getItem('adminToken'))
    const response = await api.get(hasAdminToken ? `/admin/reports/${reportId}` : `/reports/${reportId}`)
    return normalizeReport(response.data?.data || response.data)
  },

  createReport: async (formData) => {
    const response = await api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data?.data || response.data
  },

  updateReportStatus: async (reportId, status) => {
    const response = await api.patch(`/admin/reports/${reportId}/status`, { status })
    return normalizeReport(response.data?.data || response.data)
  },
}

export default api
