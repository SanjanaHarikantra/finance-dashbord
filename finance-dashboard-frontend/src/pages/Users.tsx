import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { toast } from 'react-toastify'

interface UserItem {
  _id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        console.log('Users response:', response.data)
        
        // Backend returns { data: users, pagination: {...} }
        const usersArray = response.data.data || response.data || []
        setUsers(Array.isArray(usersArray) ? usersArray : [])
      } catch (error: any) {
        const message = error.response?.data?.message || 'Unable to fetch users'
        console.error('Fetch users error:', error.response?.data || error)
        toast.error(message)
        setUsers([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/users/${id}`, { status })
      toast.success('User updated')
      setUsers((current) =>
        current.map((user) => (user._id === id ? { ...user, status } : user))
      )
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unable to update user'
      console.error('Update user error:', error.response?.data || error)
      toast.error(message)
    }
  }

  if (loading) {
    return <div className="text-center">Loading users…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="mt-1 text-sm text-slate-600">Manage users and update account status.</p>
        </div>
        <Link
          to="/dashboard/users/new"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Add New User
        </Link>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{user.role}</span>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {user.status}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
              <select
                value={user.status}
                onChange={(e) => updateStatus(user._id, e.target.value)}
                className="rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
