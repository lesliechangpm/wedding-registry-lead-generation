import { useState } from 'react'
import { useQuery } from 'react-query'
import { fetchCouples } from '../services/api'
import { HeartIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function Couples() {
  const [filters, setFilters] = useState({
    wedding_stage: '',
    city: '',
    state: '',
  })

  const { data: couples, isLoading, error } = useQuery(
    ['couples', filters],
    () => fetchCouples({
      page_size: 50,
      ...(filters.wedding_stage && { wedding_stage: filters.wedding_stage }),
      ...(filters.city && { city: filters.city }),
      ...(filters.state && { state: filters.state })
    })
  )

  const getStageColor = (stage: string) => {
    const colors = {
      engaged: 'bg-pink-100 text-pink-800',
      planning: 'bg-blue-100 text-blue-800',
      recently_married: 'bg-green-100 text-green-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
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
        <p className="text-red-600">Error loading couples. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Couples</h1>
          <p className="mt-1 text-sm text-gray-500">
            {couples?.length || 0} couples found
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            Import Data
          </button>
          <button className="btn-primary">
            Add Couple
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Wedding Stage</label>
            <select 
              className="form-input"
              value={filters.wedding_stage}
              onChange={(e) => setFilters(prev => ({ ...prev, wedding_stage: e.target.value }))}
            >
              <option value="">All Stages</option>
              <option value="engaged">Engaged</option>
              <option value="planning">Planning</option>
              <option value="recently_married">Recently Married</option>
            </select>
          </div>
          <div>
            <label className="form-label">City</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter city"
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">State</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter state"
              value={filters.state}
              onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button 
              className="btn-secondary"
              onClick={() => setFilters({ wedding_stage: '', city: '', state: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Couples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {couples?.map((couple) => (
          <div key={couple.id} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <HeartIcon className="h-8 w-8 text-pink-500 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {couple.partner_1_name} & {couple.partner_2_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Couple ID: {couple.id}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="text-gray-400 hover:text-gray-600">
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Stage:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(couple.wedding_stage)}`}>
                  {couple.wedding_stage.replace('_', ' ')}
                </span>
              </div>

              {couple.wedding_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Wedding Date:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(couple.wedding_date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {couple.wedding_city && couple.wedding_state && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Location:</span>
                  <span className="text-sm text-gray-900">
                    {couple.wedding_city}, {couple.wedding_state}
                  </span>
                </div>
              )}

              {couple.wedding_budget && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Budget:</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${couple.wedding_budget.toLocaleString()}
                  </span>
                </div>
              )}

              {couple.source_platform && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Source:</span>
                  <span className="text-sm text-gray-900 capitalize">
                    {couple.source_platform.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                {couple.partner_1_email && (
                  <p className="text-xs text-gray-500">{couple.partner_1_email}</p>
                )}
                {couple.partner_2_email && (
                  <p className="text-xs text-gray-500">{couple.partner_2_email}</p>
                )}
              </div>
              <p className="text-xs text-gray-400">
                Added {new Date(couple.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <button className="btn-primary text-sm py-1 px-3 flex-1">
                  Create Lead
                </button>
                <button className="btn-secondary text-sm py-1 px-3">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {couples && couples.length === 0 && (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No couples found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your filters or import new couples data.
          </p>
        </div>
      )}
    </div>
  )
}