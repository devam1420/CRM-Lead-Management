import { useMemo, useState } from 'react'
import { Pencil, Trash2, Mail, Phone, Inbox } from 'lucide-react'
import StatusBadge from './StatusBadge'
import ConfirmDialog from './ConfirmDialog'
import { STATUSES, STATUS_STYLES } from '../data/constants'
import { maskAadhaar, maskPan } from '../lib/mask'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function LeadsTable({ leads, search, onEdit, onDelete, onStatusChange }) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [pendingDelete, setPendingDelete] = useState(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q)
      return matchesStatus && matchesSearch
    })
  }, [leads, search, statusFilter])

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-5 py-4 border-b border-slate-100">
        <button
          onClick={() => setStatusFilter('All')}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            statusFilter === 'All' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({leads.length})
        </button>
        {STATUSES.map((status) => {
          const count = leads.filter((l) => l.status === status).length
          const active = statusFilter === status
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active ? `${STATUS_STYLES[status].badge} ring-2 ring-inset ring-current` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
            <Inbox size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No leads found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-semibold">Lead</th>
                <th className="px-5 py-3 font-semibold hidden md:table-cell">Company</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Source</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold hidden sm:table-cell">Deal Value</th>
                <th className="px-5 py-3 font-semibold hidden lg:table-cell">Owner</th>
                <th className="px-5 py-3 font-semibold hidden xl:table-cell">Aadhaar</th>
                <th className="px-5 py-3 font-semibold hidden xl:table-cell">PAN</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{lead.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                          <Mail size={12} /> {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                            <Phone size={12} /> {lead.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell text-slate-600">{lead.company || '—'}</td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-slate-500">{lead.source || '—'}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => onStatusChange(lead.id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white py-1 pl-2 pr-6 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell text-slate-600 font-medium">
                    {lead.dealValue ? currency.format(lead.dealValue) : '—'}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell text-slate-600">{lead.owner || '—'}</td>
                  <td className="px-5 py-3.5 hidden xl:table-cell text-slate-400 font-mono text-xs whitespace-nowrap">
                    {lead.aadhaarNumber ? maskAadhaar(lead.aadhaarNumber) : '—'}
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell text-slate-400 font-mono text-xs whitespace-nowrap">
                    {lead.panNumber ? maskPan(lead.panNumber) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(lead)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setPendingDelete(lead)}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this lead?"
        message={pendingDelete ? `${pendingDelete.name} will be permanently removed. This can't be undone.` : ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          onDelete(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
