import { Link, useLocation } from 'react-router-dom'

function ReportSuccess() {
  const location = useLocation()
  const savedReport = (() => {
    try {
      return JSON.parse(localStorage.getItem('lastReport') || 'null')
    } catch {
      return null
    }
  })()
  const report = location.state?.report || savedReport

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Report Submitted Successfully</h1>
      <p className="mt-3 text-slate-600">Thank you for helping improve your community.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Your Report ID</p>
        <p className="mt-3 text-2xl font-bold tracking-wide text-slate-900">{report?.reportId || localStorage.getItem('lastReportId') || 'CIV-20260811-001'}</p>
      </div>

      <p className="mt-4 text-sm text-slate-500">Save this ID to check the status of your report.</p>

      <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
        <Link to="/status" className="btn-primary">Check Status</Link>
        <Link to="/report" className="btn-secondary">Report Another Issue</Link>
      </div>
    </div>
  )
}

export default ReportSuccess
