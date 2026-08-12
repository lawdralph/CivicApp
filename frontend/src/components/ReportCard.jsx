import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ReportCard({ report }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">{report.category}</p>
          <h3 className="mt-2 text-lg font-bold text-slate-900">{report.title}</h3>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{report.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">{report.reportId}</p>
        <Link to={`/admin/${report.reportId}`} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
          View
        </Link>
      </div>
    </div>
  )
}

export default ReportCard
