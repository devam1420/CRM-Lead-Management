import { useMemo, useState } from 'react'
import { AlertCircle, Loader2, X } from 'lucide-react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './components/Dashboard'
import LeadsTable from './components/LeadsTable'
import LeadFormModal from './components/LeadFormModal'
import { useLeads } from './hooks/useLeads'

export default function App() {
  const { leads, loading, error, addLead, updateLead, deleteLead, updateStatus, refetch } = useLeads()
  const [dismissedError, setDismissedError] = useState(null)
  const [view, setView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  const headerCopy = useMemo(() => {
    if (view === 'dashboard') {
      return { title: 'Dashboard', subtitle: `Welcome back — here's what's happening with your pipeline.` }
    }
    return { title: 'Leads', subtitle: `${leads.length} total lead${leads.length === 1 ? '' : 's'}` }
  }, [view, leads.length])

  const openAddModal = () => {
    setEditingLead(null)
    setModalOpen(true)
  }

  const openEditModal = (lead) => {
    setEditingLead(lead)
    setModalOpen(true)
  }

  const handleSave = async (formData) => {
    if (editingLead) {
      await updateLead(editingLead.id, formData)
    } else {
      await addLead(formData)
    }
    setModalOpen(false)
    setEditingLead(null)
  }

  const showErrorBanner = error && error !== dismissedError

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar
        activeView={view}
        onNavigate={setView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={headerCopy.title}
          subtitle={headerCopy.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          onAddLead={openAddModal}
          search={search}
          onSearchChange={setSearch}
          showSearch={view === 'leads'}
        />

        <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">
          {showErrorBanner && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-600" />
              <div className="flex-1 text-sm">
                <p className="font-semibold text-rose-700">Couldn't reach Supabase</p>
                <p className="text-rose-600">{error}</p>
                <button
                  onClick={refetch}
                  className="mt-1.5 text-xs font-semibold text-rose-700 underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
              <button
                onClick={() => setDismissedError(error)}
                className="text-rose-400 hover:text-rose-600"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader2 size={28} className="animate-spin mb-3" />
              <p className="text-sm">Loading leads…</p>
            </div>
          ) : view === 'dashboard' ? (
            <Dashboard leads={leads} onNavigateToLeads={() => setView('leads')} />
          ) : (
            <LeadsTable
              leads={leads}
              search={search}
              onEdit={openEditModal}
              onDelete={deleteLead}
              onStatusChange={updateStatus}
            />
          )}
        </main>
      </div>

      <LeadFormModal
        open={modalOpen}
        lead={editingLead}
        onClose={() => {
          setModalOpen(false)
          setEditingLead(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
