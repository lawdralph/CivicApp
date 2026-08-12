import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/Button'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import LocationMap from '../components/LocationMap'
import { apiService } from '../services/api'

const statuses = ['Pending', 'Under Review', 'In Progress', 'Resolved']

function ReportDetails() {
  const { reportId } = useParams()
  const [report, setReport] = useState(null)
  const [status, setStatus] = useState('Pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const result = await apiService.getReportById(reportId)
        if (!result) {
          setError('Report not found.')
          setReport(null)
          return
        }
        setReport(result)
        setStatus(result.status)
      } catch (err) {
        setError('Unable to load report details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reportId])

  const handleUpdate = async () => {
    setSaving(true)
    try {
      const updated = await apiService.updateReportStatus(reportId, status)
      if (updated) setReport(updated)
    } catch (err) {
      setError('Failed to update report status.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading report details..." />
  if (error) return <ErrorMessage message={error} />
  if (!report) return <ErrorMessage message="Report not found." />

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Report details</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{report.title}</h1>
          </div>
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Report ID</p>
              <p className="mt-1 font-semibold text-slate-800">{report.reportId}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Category</p>
              <p className="mt-1 font-semibold text-slate-800">{report.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date submitted</p>
              <p className="mt-1 font-semibold text-slate-800">{new Date(report.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Coordinates</p>
              <p className="mt-1 font-semibold text-slate-800">{report.location?.lat}, {report.location?.lng}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-2 text-slate-700">{report.description}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Photo</p>
            {report.photoUrl ? (
              <img src={report.photoUrl} alt={report.title} className="mt-3 h-72 w-full rounded-2xl object-cover" />
            ) : (
              <p className="mt-2 text-slate-600">No photo provided.</p>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Status</p>
            <select value={status} onChange={(event) => setStatus(event.target.value)} className="input mt-3">
              {statuses.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Button className="mt-4 w-full" onClick={handleUpdate} disabled={saving}>
              {saving ? 'Updating Status...' : 'Update Status'}
            </Button>
          </div>

          <div>
            <p className="text-sm text-slate-500">Location</p>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
              <LocationMap
                position={{ lat: report.location?.lat ?? 6.5244, lng: report.location?.lng ?? 3.3792 }}
                title={report.title}
                address={report.location?.address || 'Reported location'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetails
