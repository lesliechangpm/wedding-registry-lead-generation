import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { fetchLeads } from '../services/api'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function Leads() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    min_score: '',
  })

  const { data, isLoading, error } = useQuery(
    ['leads', page, filters],
    () => fetchLeads({ 
      page, 
      page_size: 20,
      ...(filters.status && { status: filters.status }),
      ...(filters.min_score && { min_score: parseFloat(filters.min_score) })
    }),
    { keepPreviousData: true }
  )

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      nurturing: 'bg-purple-100 text-purple-800',
      converted: 'bg-indigo-100 text-indigo-800',
      closed_won: 'bg-emerald-100 text-emerald-800',
      closed_lost: 'bg-red-100 text-red-800',
      opt_out: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold'
    if (score >= 60) return 'text-yellow-600 font-semibold'
    if (score >= 40) return 'text-orange-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading leads. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {data?.total_count || 0} total leads
          </p>
        </div>
        <button className="btn-primary">
          Import Leads
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Status</label>
            <select 
              className="form-input"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="nurturing">Nurturing</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <div>
            <label className="form-label">Minimum Score</label>
            <input
              type="number"
              className="form-input"
              placeholder="0-100"
              value={filters.min_score}
              onChange={(e) => setFilters(prev => ({ ...prev, min_score: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="btn-secondary"
              onClick={() => setFilters({ status: '', min_score: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Couple
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Lead #{lead.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Couple ID: {lead.couple_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${getScoreColor(lead.lead_score)}`}>
                      {lead.lead_score.toFixed(1)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.target_purchase_price ? 
                      `$${lead.target_purchase_price.toLocaleString()}` : 
                      'Not set'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {lead.target_location || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button className="text-primary-600 hover:text-primary-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing page {page} of {Math.ceil((data?.total_count || 0) / 20)}
        </div>
        <div className="flex space-x-2">
          <button
            className="btn-secondary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="btn-secondary"
            disabled={page >= Math.ceil((data?.total_count || 0) / 20)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}