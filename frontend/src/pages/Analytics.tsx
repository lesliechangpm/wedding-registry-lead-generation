import { useQuery } from 'react-query'
import {
  fetchGeographicDistribution,
  fetchCampaignPerformanceSummary,
  fetchTimelineAnalysis
} from '../services/api'

export default function Analytics() {
  const { data: geographic } = useQuery('geographic-distribution', fetchGeographicDistribution)
  const { data: campaignPerf } = useQuery('campaign-performance-summary', fetchCampaignPerformanceSummary)
  const { data: timeline } = useQuery('timeline-analysis', () => fetchTimelineAnalysis(30))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Insights and performance metrics for your lead generation
        </p>
      </div>

      {/* Campaign Performance */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {campaignPerf?.total_campaigns || 0}
            </div>
            <div className="text-sm text-gray-500">Total Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {campaignPerf?.average_open_rate || 0}%
            </div>
            <div className="text-sm text-gray-500">Avg. Open Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {campaignPerf?.average_click_rate || 0}%
            </div>
            <div className="text-sm text-gray-500">Avg. Click Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {campaignPerf?.average_conversion_rate || 0}%
            </div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
          
          {/* By State */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3">Top States</h4>
            <div className="space-y-2">
              {geographic?.by_state?.slice(0, 5).map((item: any, index: number) => (
                <div key={item.state} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm text-gray-500">#{index + 1}</div>
                    <div className="text-sm font-medium text-gray-900">{item.state}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-sm text-gray-600 mr-2">{item.count}</div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / (geographic.by_state[0]?.count || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-md font-medium text-gray-700 mb-3">Top Cities</h4>
            <div className="space-y-2">
              {geographic?.top_cities?.slice(0, 5).map((item: any, index: number) => (
                <div key={item.city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 text-sm text-gray-500">#{index + 1}</div>
                    <div className="text-sm font-medium text-gray-900">{item.city}</div>
                  </div>
                  <div className="text-sm text-gray-600">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Analysis */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Growth Timeline (Last 30 Days)</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Couples Added</span>
                <span className="text-sm text-gray-500">
                  {timeline?.couples_timeline?.reduce((sum: number, day: any) => sum + day.count, 0) || 0} total
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Leads Created</span>
                <span className="text-sm text-gray-500">
                  {timeline?.leads_timeline?.reduce((sum: number, day: any) => sum + day.count, 0) || 0} total
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity Chart Placeholder */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center text-sm text-gray-500">
              📈 Timeline chart would be rendered here with actual chart library
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  High Engagement States
                </p>
                <p className="text-xs text-green-600 mt-1">
                  CA, NY, and TX show highest lead conversion rates
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Best Contact Timing
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  60-90 days post-engagement shows highest response rates
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Budget Correlation
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Higher wedding budgets correlate with mortgage readiness
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}