const statuses = ['Pending', 'Under Review', 'In Progress', 'Resolved']

function StatusTimeline({ currentStatus }) {
  const currentIndex = statuses.indexOf(currentStatus)

  return (
    <div className="space-y-3">
      {statuses.map((status, index) => {
        const isActive = index <= currentIndex
        const isCurrent = status === currentStatus

        return (
          <div key={status} className="flex items-center gap-3">
            <span className={`inline-flex h-4 w-4 rounded-full border-2 ${isActive ? 'border-sky-700 bg-sky-700' : 'border-slate-300 bg-white'}`} />
            <p className={`text-sm font-medium ${isCurrent ? 'text-sky-700' : isActive ? 'text-slate-700' : 'text-slate-400'}`}>
              {status}
            </p>
            {index < statuses.length - 1 ? <span className="h-px flex-1 bg-slate-200" /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default StatusTimeline
