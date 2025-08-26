import { useQuery } from 'react-query'
import { fetchCampaigns } from '../services/api'
import { PlusIcon, PlayIcon, PauseIcon, EyeIcon } from '@heroicons/react/24/outline'

export default function Campaigns() {
  const { data: campaigns, isLoading, error } = useQuery('campaigns', fetchCampaigns)

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const calculateOpenRate = (opens: number, sends: number) => {
    if (sends === 0) return '0%'
    return `${((opens / sends) * 100).toFixed(1)}%`
  }

  const calculateClickRate = (clicks: number, sends: number) => {
    if (sends === 0) return '0%'
    return `${((clicks / sends) * 100).toFixed(1)}%`
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
        <p className="text-red-600">Error loading campaigns. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            {campaigns?.length || 0} campaigns
          </p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Campaign
        </button>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns?.filter(c => c.status === 'active').length || 0}
          </div>
          <div className="text-sm text-gray-500">Active Campaigns</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns?.reduce((sum, c) => sum + c.total_sends, 0).toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-500">Total Sends</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns?.length && campaigns.length > 0 
              ? calculateOpenRate(
                  campaigns.reduce((sum, c) => sum + c.total_opens, 0),
                  campaigns.reduce((sum, c) => sum + c.total_sends, 0)
                )
              : '0%'
            }
          </div>
          <div className="text-sm text-gray-500">Avg. Open Rate</div>
        </div>
        <div className="card">
          <div className="text-2xl font-bold text-gray-900">
            {campaigns?.reduce((sum, c) => sum + c.total_conversions, 0) || 0}
          </div>
          <div className="text-sm text-gray-500">Total Conversions</div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sends
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Open Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Click Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversions
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
              {campaigns?.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.name}
                    </div>
                    {campaign.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {campaign.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                      {campaign.campaign_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.total_sends.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateOpenRate(campaign.total_opens, campaign.total_sends)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateClickRate(campaign.total_clicks, campaign.total_sends)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {campaign.total_conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {campaign.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-900">
                          <PlayIcon className="h-4 w-4" />
                        </button>
                      )}
                      {campaign.status === 'active' && (
                        <button className="text-yellow-600 hover:text-yellow-900">
                          <PauseIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {campaigns && campaigns.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            📧
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first email campaign.
          </p>
          <div className="mt-6">
            <button className="btn-primary">
              Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  )
}