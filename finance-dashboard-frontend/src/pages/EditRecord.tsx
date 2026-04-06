import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import { toast } from 'react-toastify'

interface RecordFormData {
  amount: number
  type: string
  category: string
  date: string
  notes: string
}

export default function EditRecord() {
  const params = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState<RecordFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await api.get(`/records/${params.id}`)
        console.log('Get record response:', response.data)
        
        // Backend returns { record: {...} }
        const recordData = response.data.record || response.data
        setRecord(recordData)
      } catch (error: any) {
        const message = error.response?.data?.message || 'Unable to load record'
        console.error('Load record error:', error.response?.data || error)
        toast.error(message)
        navigate('/dashboard/records')
      } finally {
        setLoading(false)
      }
    }

    fetchRecord()
  }, [navigate, params.id])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!record) return

    setSaving(true)

    try {
      await api.patch(`/records/${params.id}`, record)
      toast.success('Record updated')
      navigate('/dashboard/records')
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Unable to update record'
      console.error('Update record error:', error.response?.data || error)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof RecordFormData, value: string) => {
    setRecord((current) => current ? { ...current, [field]: field === 'amount' ? Number(value) : value } : null)
  }

  if (loading) {
    return <div className="text-center">Loading record…</div>
  }

  if (!record) {
    return <div className="text-center">Record not found</div>
  }

  return (
    <div className="max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Record</h1>
      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              type="number"
              step="0.01"
              value={record.amount}
              onChange={(e) => updateField('amount', e.target.value)}
              required
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              value={record.type}
              onChange={(e) => updateField('type', e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <input
              type="text"
              value={record.category}
              onChange={(e) => updateField('category', e.target.value)}
              required
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Date</span>
            <input
              type="date"
              value={record.date.split('T')[0]}
              onChange={(e) => updateField('date', e.target.value)}
              required
              className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Notes</span>
          <textarea
            value={record.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard/records')}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Update record'}
          </button>
        </div>
      </form>
    </div>
  )
}
