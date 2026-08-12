import { useState } from 'react'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import StatusTimeline from '../components/StatusTimeline'
import StatusBadge from '../components/StatusBadge'
import { apiService } from '../services/api'

function CheckStatus() {
  const [reportId, setReportId] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async (event) => {
    event.preventDefault()
    const trimmedId = reportId.trim()
    if (!trimmedId) {
      setError('Please enter a report ID.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await apiService.getReportById(trimmedId)
      if (!result) {
        setError('Report not found. Please check your Report ID.')
        setReport(null)
        return
      }
      setReport(result)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Track Your Report</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Track Your Report</h1>
        <p className="mt-3 text-slate-600">Enter your Report ID to see the latest status of your report.</p>

        <form className="mt-6 flex flex-col gap-4 sm:flex-row" onSubmit={fetchReport}>
          <input
            type="text"
            value={reportId}
            onChange={(event) => setReportId(event.target.value)}
            className="input sm:flex-1"
            placeholder="CIV-20260811-001"
            aria-label="Report ID"
          />
          <Button type="submit" className="sm:w-auto" disabled={loading}>
            {loading ? 'Checking...' : 'Check Status'}
          </Button>
        </form>
      </div>

      {error ? <ErrorMessage message={error} /> : null}
      {loading ? <LoadingSpinner label="Loading report details..." /> : null}

      {report ? (
        <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr] sm:p-8">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Report ID</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{report.reportId}</h2>
              </div>
              <StatusBadge status={report.status} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Issue title</p>
                <p className="mt-1 font-semibold text-slate-800">{report.title}</p>
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
                <p className="text-sm text-slate-500">Location</p>
                <p className="mt-1 font-semibold text-slate-800">{report.location?.lat}, {report.location?.lng}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-slate-500">Photo</p>
              {report.photoUrl ? (
                <img src={report.photoUrl} alt={report.title} className="mt-3 h-56 w-full rounded-2xl object-cover" />
              ) : (
                <p className="mt-2 text-slate-600">No photo attached.</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">Status tracker</p>
            <div className="mt-4">
              <StatusTimeline currentStatus={report.status} />
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              {report.status === 'Resolved' ? (
                <p>This issue has been resolved and the report is now complete.</p>
              ) : report.status === 'Pending' ? (
                <p>Your report has been received and is awaiting review.</p>
              ) : (
                <p>Your report is being processed by local authorities.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CheckStatus
