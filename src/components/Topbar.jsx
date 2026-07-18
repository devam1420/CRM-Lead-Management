import { Menu, Plus, Search } from 'lucide-react'

export default function Topbar({ title, subtitle, onMenuClick, onAddLead, search, onSearchChange, showSearch }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="flex items-center gap-4 px-4 sm:px-6 h-16">
        <button
          className="lg:hidden text-slate-500 hover:text-slate-800"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
        </div>

        <div className="flex-1" />

        {showSearch && (
          <div className="relative hidden sm:block w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search leads..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
            />
          </div>
        )}

        <button
          onClick={onAddLead}
          className="flex items-center gap-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-3.5 py-2.5 shadow-soft transition-colors"
        >
          <Plus size={16} strokeWidth={2.6} />
          <span className="hidden sm:inline">Add Lead</span>
        </button>
      </div>
    </header>
  )
}
