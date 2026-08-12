import { useEffect, useMemo, useState } from 'react'
import ReportTable from '../components/ReportTable'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiService } from '../services/api'

function AdminDashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true)
      try {
        const data = await apiService.getReports()
        setReports(data)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    const observed = [...reports].filter((report) => {
      const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) || report.reportId.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || report.category === category
      const matchesStatus = status === 'all' || report.status === status
      return matchesSearch && matchesCategory && matchesStatus
    })

    observed.sort((a, b) => {
      const diff = new Date(b.createdAt) - new Date(a.createdAt)
      return sort === 'newest' ? diff : -diff
    })

    return observed
  }, [reports, search, category, status, sort])

  const summary = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((item) => item.status === 'Pending').length,
      underReview: reports.filter((item) => item.status === 'Under Review').length,
      inProgress: reports.filter((item) => item.status === 'In Progress').length,
      resolved: reports.filter((item) => item.status === 'Resolved').length,
    }
  }, [reports])

  const cards = [
    ['Total Reports', summary.total],
    ['Pending', summary.pending],
    ['Under Review', summary.underReview],
    ['In Progress', summary.inProgress],
    ['Resolved', summary.resolved],
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Admin dashboard</p>
        <h1 className="text-3xl font-bold text-slate-900">Report management</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([title, value]) => (
          <div key={title} className="card p-5">
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="input"
            placeholder="Search by report ID or title"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="input">
            <option value="all">All categories</option>
            {['Road', 'Drainage', 'Streetlight', 'Waste', 'Water Supply', 'Flooding', 'Public Infrastructure', 'Other'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="input">
            <option value="all">All statuses</option>
            {['Pending', 'Under Review', 'In Progress', 'Resolved'].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="input">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading reports..." /> : <ReportTable reports={filteredReports} />}
    </div>
  )
}

export default AdminDashboard
