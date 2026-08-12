import StatusBadge from './StatusBadge'
import { Link } from 'react-router-dom'

function ReportTable({ reports }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Report ID</th>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-800">{report.reportId}</td>
              <td className="px-4 py-3">{report.title}</td>
              <td className="px-4 py-3">{report.category}</td>
              <td className="px-4 py-3"><StatusBadge status={report.status} /></td>
              <td className="px-4 py-3">{new Date(report.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <Link to={`/admin/${report.reportId}`} className="font-semibold text-sky-700 hover:text-sky-800">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable
