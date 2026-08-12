import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldCheck, LogOut } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const links = [
  { to: '/', label: 'Home' },
  { to: '/report', label: 'Report an Issue' },
  { to: '/status', label: 'Check Status' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const hasAdminSession = Boolean(localStorage.getItem('adminToken'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    cx(
      'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">NaijaFix</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {hasAdminSession ? (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/admin/login"
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <button
          className="rounded-full border border-emerald-200 bg-white p-2.5 text-emerald-800 shadow-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-emerald-100 bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cx(
                  'block rounded-xl px-3 py-2.5 text-sm font-medium',
                  isActive ? 'bg-emerald-50 text-emerald-800' : 'text-slate-700 hover:bg-slate-100'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          {hasAdminSession ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                handleLogout();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <NavLink
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Admin
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
}