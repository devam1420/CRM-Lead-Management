import { useCallback, useEffect, useState } from 'react'
import { supabase, LEADS_TABLE } from '../lib/supabaseClient'

// Maps a Supabase row (snake_case) to the shape components use (camelCase).
function rowToLead(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone_number ?? '',
    email: row.email,
    company: row.company_name,
    serviceInterested: row.service_interested ?? '',
    source: row.lead_source ?? 'Website',
    status: row.lead_status,
    notes: row.notes ?? '',
    createdAt: row.created_date,
  }
}

// Maps the app's lead shape back to Supabase columns for insert/update.
function leadToRow(lead) {
  return {
    name: lead.name,
    phone_number: lead.phone || null,
    email: lead.email,
    company_name: lead.company,
    service_interested: lead.serviceInterested || null,
    lead_source: lead.source,
    lead_status: lead.status,
    notes: lead.notes || null,
  }
}

export function useLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from(LEADS_TABLE)
      .select('*')
      .order('created_date', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setLeads((data ?? []).map(rowToLead))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const addLead = useCallback(async (lead) => {
    const { data, error: insertError } = await supabase
      .from(LEADS_TABLE)
      .insert(leadToRow(lead))
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }
    setLeads((prev) => [rowToLead(data), ...prev])
  }, [])

  const updateLead = useCallback(async (id, patch) => {
    const { data, error: updateError } = await supabase
      .from(LEADS_TABLE)
      .update(leadToRow(patch))
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      setError(updateError.message)
      return
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? rowToLead(data) : l)))
  }, [])

  const deleteLead = useCallback(async (id) => {
    const { error: deleteError } = await supabase.from(LEADS_TABLE).delete().eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const updateStatus = useCallback(async (id, status) => {
    const { data, error: statusError } = await supabase
      .from(LEADS_TABLE)
      .update({ lead_status: status })
      .eq('id', id)
      .select()
      .single()

    if (statusError) {
      setError(statusError.message)
      return
    }
    setLeads((prev) => prev.map((l) => (l.id === id ? rowToLead(data) : l)))
  }, [])

  return { leads, loading, error, addLead, updateLead, deleteLead, updateStatus, refetch: fetchLeads }
}
