import axios from 'axios'

const API_BASE_URL = '/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Types
export interface DashboardMetrics {
  total_couples: number
  total_leads: number
  qualified_leads: number
  converted_leads: number
  total_revenue: number
  average_lead_score: number
  conversion_rate: number
  leads_ready_for_contact: number
}

export interface LeadsByStage {
  stage: string
  count: number
}

export interface Lead {
  id: number
  couple_id: number
  lead_score: number
  qualification_score: number
  status: string
  target_purchase_price?: number
  target_location?: string
  estimated_income?: number
  created_at: string
  updated_at: string
}

export interface Couple {
  id: number
  partner_1_name: string
  partner_2_name: string
  partner_1_email?: string
  partner_2_email?: string
  wedding_date?: string
  wedding_stage: string
  wedding_city?: string
  wedding_state?: string
  wedding_budget?: number
  source_platform?: string
  created_at: string
}

export interface Campaign {
  id: number
  name: string
  description?: string
  campaign_type: string
  status: string
  total_sends: number
  total_opens: number
  total_clicks: number
  total_conversions: number
  created_at: string
}

// API functions

// Dashboard
export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get('/analytics/dashboard')
  return response.data
}

export const fetchLeadsByStage = async (): Promise<LeadsByStage[]> => {
  const response = await api.get('/analytics/leads-by-stage')
  return response.data
}

// Leads
export const fetchLeads = async (params: {
  page?: number
  page_size?: number
  status?: string
  min_score?: number
} = {}): Promise<{ leads: Lead[]; total_count: number }> => {
  const response = await api.get('/leads', { params })
  return response.data
}

export const fetchLead = async (id: number): Promise<Lead> => {
  const response = await api.get(`/leads/${id}`)
  return response.data
}

export const createLead = async (data: Partial<Lead>): Promise<Lead> => {
  const response = await api.post('/leads', data)
  return response.data
}

export const updateLead = async (id: number, data: Partial<Lead>): Promise<Lead> => {
  const response = await api.put(`/leads/${id}`, data)
  return response.data
}

export const assignLead = async (leadId: number, officerId: number): Promise<void> => {
  await api.post(`/leads/${leadId}/assign`, { loan_officer_id: officerId })
}

// Couples
export const fetchCouples = async (params: {
  page?: number
  page_size?: number
  wedding_stage?: string
  city?: string
  state?: string
} = {}): Promise<Couple[]> => {
  const response = await api.get('/couples', { params })
  return response.data
}

export const fetchCouple = async (id: number): Promise<Couple> => {
  const response = await api.get(`/couples/${id}`)
  return response.data
}

export const createCouple = async (data: Partial<Couple>): Promise<Couple> => {
  const response = await api.post('/couples', data)
  return response.data
}

export const updateCouple = async (id: number, data: Partial<Couple>): Promise<Couple> => {
  const response = await api.put(`/couples/${id}`, data)
  return response.data
}

export const optOutCouple = async (id: number): Promise<void> => {
  await api.post(`/couples/${id}/opt-out`)
}

// Campaigns
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get('/campaigns')
  return response.data
}

export const fetchCampaign = async (id: number): Promise<Campaign> => {
  const response = await api.get(`/campaigns/${id}`)
  return response.data
}

export const createCampaign = async (data: Partial<Campaign>): Promise<Campaign> => {
  const response = await api.post('/campaigns', data)
  return response.data
}

export const updateCampaign = async (id: number, data: Partial<Campaign>): Promise<Campaign> => {
  const response = await api.put(`/campaigns/${id}`, data)
  return response.data
}

export const sendCampaign = async (id: number): Promise<void> => {
  await api.post(`/campaigns/${id}/send`)
}

export const getCampaignPerformance = async (id: number) => {
  const response = await api.get(`/campaigns/${id}/performance`)
  return response.data
}

// Analytics
export const fetchGeographicDistribution = async () => {
  const response = await api.get('/analytics/geographic-distribution')
  return response.data
}

export const fetchCampaignPerformanceSummary = async () => {
  const response = await api.get('/analytics/campaign-performance')
  return response.data
}

export const fetchTimelineAnalysis = async (days: number = 30) => {
  const response = await api.get(`/analytics/timeline-analysis?days=${days}`)
  return response.data
}

export default api