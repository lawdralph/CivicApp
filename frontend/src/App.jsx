import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ReportIssue from './pages/ReportIssue'
import ReportSuccess from './pages/ReportSuccess'
import CheckStatus from './pages/CheckStatus'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ReportDetails from './pages/ReportDetails'
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/report/success" element={<ReportSuccess />} />
          <Route path="/status" element={<CheckStatus />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/:reportId" element={<ReportDetails />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
