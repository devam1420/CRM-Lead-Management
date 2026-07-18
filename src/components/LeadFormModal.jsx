import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { STATUSES, SOURCES } from '../data/constants'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  serviceInterested: '',
  source: SOURCES[0],
  status: STATUSES[0],
  notes: '',
}

export default function LeadFormModal({ open, lead, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm(lead ? { ...emptyForm, ...lead } : emptyForm)
      setErrors({})
    }
  }, [open, lead])

  if (!open) return null

  const isEdit = Boolean(lead)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.email.trim()) next.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!form.company.trim()) next.company = 'Company name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ ...form })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4">
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h2 className="text-base font-semibold text-slate-900">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Jane Cooper"
                className={inputClass(errors.name)}
              />
            </Field>
            <Field label="Company Name" error={errors.company}>
              <input
                value={form.company}
                onChange={handleChange('company')}
                placeholder="Acme Inc."
                className={inputClass(errors.company)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="jane@acme.com"
                className={inputClass(errors.email)}
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+1 555 000 0000"
                className={inputClass()}
              />
            </Field>
          </div>

          <Field label="Service Interested">
            <input
              value={form.serviceInterested}
              onChange={handleChange('serviceInterested')}
              placeholder="e.g. Enterprise Plan, Product Demo, Consulting..."
              className={inputClass()}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Lead Source">
              <select value={form.source} onChange={handleChange('source')} className={inputClass()}>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Lead Status">
              <select value={form.status} onChange={handleChange('status')} className={inputClass()}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={3}
              placeholder="Any relevant context about this lead..."
              className={inputClass() + ' resize-none'}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full rounded-lg border bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors ${
    error ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-brand-400'
  }`
}
