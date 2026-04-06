import { useMemo } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const user = useMemo(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div>
              <Link to="/dashboard" className="text-xl font-semibold text-slate-900">
                Finance Dashboard
              </Link>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-600">
              <Link to="/dashboard" className="hover:text-slate-900">
                Dashboard
              </Link>
              <Link to="/dashboard/records" className="hover:text-slate-900">
                Records
              </Link>
              {user?.role === 'admin' && (
                <Link to="/dashboard/users" className="hover:text-slate-900">
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-700">
              {user ? `${user.name} (${user.role})` : 'Guest'}
            </div>
            <button
              onClick={handleLogout}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
