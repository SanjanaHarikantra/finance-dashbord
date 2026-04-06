import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { toast } from 'react-toastify'

interface RecordItem {
  _id: string
  amount: number
  type: string
  category: string
  date: string
  notes: string
}

export default function Records() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date-desc') // default: newest first

  useEffect(() => {
    fetchRecords()
  }, [sortBy])

  const fetchRecords = async () => {
    try {
      // Parse sort option
      const [sortField, sortOrder] = sortBy.split('-')
      const params = new URLSearchParams({
        sortBy: sortField,
        sortOrder: sortOrder
      })

      const response = await api.get(`/records?${params.toString()}`)
      console.log('Records response:', response.data)
      
      // Backend returns { data: records, pagination: {...} }
      const recordsArray = response.data.data || response.data || []
      setRecords(Array.isArray(recordsArray) ? recordsArray : [])
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unable to fetch records'
      console.error('Fetch records error:', error.response?.data || error)
      toast.error(message)
      setRecords([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this record?')) return

    try {
      await api.delete(`/records/${id}`)
      toast.success('Record deleted')
      fetchRecords()
    } catch (error: any) {
      const message = error.response?.data?.message || 'Unable to delete record'
      toast.error(message)
    }
  }

  if (loading) {
    return <div className="text-center">Loading records…</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Financial Records</h1>
          <p className="mt-1 text-sm text-slate-600">Create, edit, and remove your records.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
            <option value="category-asc">Category (A-Z)</option>
          </select>
          <Link
            to="/dashboard/records/new"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Add New Record
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div key={record._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-900">{record.category}</p>
                <p className="mt-1 text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <p className={`text-sm font-semibold ${record.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {record.type === 'income' ? '+' : '-'}${record.amount.toFixed(2)}
              </p>
            </div>
            {record.notes && <p className="mt-4 text-sm text-slate-600">{record.notes}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={`/dashboard/records/${record._id}/edit`}
                className="text-sm font-semibold text-slate-900 hover:text-slate-700"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(record._id)}
                className="text-sm font-semibold text-rose-600 hover:text-rose-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {records.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            No records available yet.
          </div>
        )}
      </div>
    </div>
  )
}
