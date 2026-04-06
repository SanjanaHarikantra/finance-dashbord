import { useEffect, useState } from 'react'
import api from '../api'
import { toast } from 'react-toastify'

interface RecordSummary {
  _id: string
  amount: number
  type: string
  category: string
  date: string
  notes: string
}

interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  recordCount: number
  recentRecords: RecordSummary[]
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard/summary')
        console.log('Dashboard summary response:', response.data)
        
        // Ensure all required fields exist with default values
        const data = response.data || {}
        const validSummary: DashboardSummary = {
          totalIncome: data.totalIncome ?? 0,
          totalExpenses: data.totalExpenses ?? 0,
          netIncome: data.netIncome ?? 0,
          recordCount: data.recordCount ?? 0,
          recentRecords: data.recentRecords ?? [],
        }
        
        setSummary(validSummary)
      } catch (error: any) {
        const message = error.response?.data?.message || 'Failed to load dashboard'
        console.error('Dashboard error:', error.response?.data || error)
        toast.error(message)
        // Set default empty summary on error
        setSummary({
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          recordCount: 0,
          recentRecords: [],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (!summary) {
    return <div className="text-center">Unable to load summary</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">View your financial overview and recent activity.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Income</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">${summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Total Expenses</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Net Income</p>
          <p className={`mt-4 text-3xl font-semibold ${summary.netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ${summary.netIncome.toFixed(2)}
          </p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-500">Records</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.recordCount}</p>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Records</h2>
        </div>

        <div className="mt-6 space-y-4">
          {summary.recentRecords.map((record) => (
            <div key={record._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{record.category}</p>
                  <p className="mt-1 text-sm text-slate-500">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${record.type === 'income' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                  {record.type}
                </div>
              </div>
              <p className="mt-3 text-slate-900">${record.amount.toFixed(2)}</p>
              {record.notes && <p className="mt-2 text-sm text-slate-600">{record.notes}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
