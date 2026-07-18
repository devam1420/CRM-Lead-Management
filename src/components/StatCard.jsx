export default function StatCard({ label, value, icon: Icon, accent, trend }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-card p-5 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
        {trend && <p className="mt-1 text-xs font-medium text-emerald-600">{trend}</p>}
      </div>
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${accent}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  )
}
