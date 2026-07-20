import { useMemo } from 'react'
import { Users2, TrendingUp, Trophy, DollarSign } from 'lucide-react'
import StatCard from './StatCard'
import StatusBadge from './StatusBadge'
import { STATUSES, STATUS_STYLES } from '../data/constants'

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export default function Dashboard({ leads, onNavigateToLeads }) {
  const stats = useMemo(() => {
    const total = leads.length
    const won = leads.filter((l) => l.status === 'Won')
    const lost = leads.filter((l) => l.status === 'Lost')
    const openLeads = leads.filter((l) => !['Won', 'Lost'].includes(l.status))
    const pipelineValue = openLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0)
    const wonValue = won.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0)
    const closed = won.length + lost.length
    const winRate = closed > 0 ? Math.round((won.length / closed) * 100) : 0

    const byStatus = STATUSES.map((status) => ({
      status,
      count: leads.filter((l) => l.status === status).length,
    }))

    const recent = [...leads]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    return { total, won: won.length, pipelineValue, wonValue, winRate, byStatus, recent }
  }, [leads])

  const maxCount = Math.max(...stats.byStatus.map((s) => s.count), 1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats.total} icon={Users2} accent="bg-brand-600" />
        <StatCard
          label="Open Pipeline Value"
          value={currency.format(stats.pipelineValue)}
          icon={DollarSign}
          accent="bg-violet-500"
        />
        <StatCard label="Deals Won" value={stats.won} icon={Trophy} accent="bg-emerald-500" trend={currency.format(stats.wonValue) + ' won'} />
        <StatCard label="Win Rate" value={`${stats.winRate}%`} icon={TrendingUp} accent="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Leads by Status</h2>
            <button
              onClick={onNavigateToLeads}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              View all leads →
            </button>
          </div>
          <div className="space-y-3">
            {stats.byStatus.map(({ status, count }) => (
              <div key={status} className="flex items-center gap-3">
                <div className="w-24 shrink-0">
                  <StatusBadge status={status} />
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${STATUS_STYLES[status].dot}`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-semibold text-slate-700">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-card p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Recently Added</h2>
          {stats.recent.length === 0 ? (
            <p className="text-sm text-slate-400">No leads yet.</p>
          ) : (
            <ul className="space-y-4">
              {stats.recent.map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{lead.name}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {lead.company}
                        {lead.owner ? ` · ${lead.owner}` : ''}
                        {lead.createdAt ? ` · ${dateFmt.format(new Date(lead.createdAt))}` : ''}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={lead.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
