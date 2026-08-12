const styles = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-violet-100 text-violet-800 border-violet-200',
  Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
}

function StatusBadge({ status }) {
  const badgeClass = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200'

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${badgeClass}`}>
      {status}
    </span>
  )
}

export default StatusBadge
