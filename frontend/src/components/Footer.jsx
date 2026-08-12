function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 NaijaFix. Keeping communities connected.</p>
        <div className="flex gap-6">
          <a href="/" className="hover:text-slate-900">Home</a>
          <a href="/report" className="hover:text-slate-900">Report</a>
          <a href="/status" className="hover:text-slate-900">Status</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
