import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
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

const mockReports = [
  {
    _id: '1',
    reportId: 'CIV-20260811-001',
    title: 'Large pothole on the road',
    description: 'A large pothole is causing traffic issues near the central market.',
    category: 'Road',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80',
    status: 'Pending',
    createdAt: '2026-08-11T10:00:00.000Z',
    location: { lat: 6.5244, lng: 3.3792 },
  },
  {
    _id: '2',
    reportId: 'CIV-20260810-002',
    title: 'Blocked drainage near the school',
    description: 'Water is pooling and the drainage channel is blocked with waste.',
    category: 'Drainage',
    photoUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80',
    status: 'In Progress',
    createdAt: '2026-08-10T14:30:00.000Z',
    location: { lat: 6.5301, lng: 3.3907 },
  },
  {
    _id: '3',
    reportId: 'CIV-20260809-003',
    title: 'Broken streetlight on the highway',
    description: 'The streetlight has been out for several days and the area is dark.',
    category: 'Streetlight',
    photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=80',
    status: 'Resolved',
    createdAt: '2026-08-09T08:15:00.000Z',
    location: { lat: 6.5158, lng: 3.3659 },
  },
]

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

const nextMockReportId = () => {
  const date = new Date()
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const count = String(mockReports.length + 1).padStart(3, '0')
  return `CIV-${stamp}-${count}`
}

export const apiService = {
  getReports: async () => {
    try {
      const response = await api.get('/admin/reports')
      const reports = Array.isArray(response.data?.data) ? response.data.data : []
      return reports.map(normalizeReport)
    } catch (error) {
      return mockReports.map(normalizeReport)
    }
  },

  getReportById: async (reportId) => {
    try {
      const hasAdminToken = Boolean(localStorage.getItem('adminToken'))
      const response = await api.get(hasAdminToken ? `/admin/reports/${reportId}` : `/reports/${reportId}`)
      return normalizeReport(response.data?.data || response.data)
    } catch (error) {
      const report = mockReports.find((item) => item.reportId === reportId)
      if (!report) {
        return null
      }
      return normalizeReport(report)
    }
  },

  createReport: async (formData) => {
    try {
      const response = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data?.data || response.data
    } catch (error) {
      const photoUrl =
        formData.get('photo') instanceof File
          ? URL.createObjectURL(formData.get('photo'))
          : 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80'

      const created = {
        _id: `${Date.now()}`,
        reportId: nextMockReportId(),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        photoUrl,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        location: {
          lat: Number(formData.get('latitude')),
          lng: Number(formData.get('longitude')),
        },
      }

      mockReports.unshift(created)
      return created
    }
  },

  updateReportStatus: async (reportId, status) => {
    try {
      const response = await api.patch(`/admin/reports/${reportId}/status`, { status })
      return normalizeReport(response.data?.data || response.data)
    } catch (error) {
      const report = mockReports.find((item) => item.reportId === reportId)
      if (!report) {
        return null
      }
      report.status = normalizeStatus(status)
      return normalizeReport(report)
    }
  },
}

export default api
