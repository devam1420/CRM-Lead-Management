import { LayoutDashboard, Users2, Settings, Zap, X } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users2 },
]

export default function Sidebar({ activeView, onNavigate, open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 transform bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-soft">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">LeadFlow</span>
          </div>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeView === id
            return (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id)
                  onClose()
                }}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 2} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="px-3 pb-5">
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings size={18} />
            Settings
          </button>
        </div>

        <div className="mx-3 mb-5 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-card">
          <p className="text-sm font-semibold">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-brand-100">Automate follow-ups and unlock reporting.</p>
          <button className="mt-3 w-full rounded-md bg-white/15 hover:bg-white/25 py-1.5 text-xs font-semibold transition-colors">
            Learn more
          </button>
        </div>
      </aside>
    </>
  )
}
