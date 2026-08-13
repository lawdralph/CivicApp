import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@civicapp.com', password: 'Admin' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/admin/login', form)
      const token = response.data?.data?.token

      if (!token) {
        throw new Error('No token returned')
      }

      localStorage.setItem('adminToken', token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your admin credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Admin access</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Sign in</h1>
      <p className="mt-2 text-sm text-slate-600">Use your CivicApp administrator account to manage reports.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="input mt-2"
            placeholder="admin@civicapp.gov"
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="input mt-2"
            placeholder="Enter admin password"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default AdminLogin
