import { useQuery } from 'react-query'
import {
  UserGroupIcon,
  HeartIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { fetchDashboardMetrics, fetchLeadsByStage } from '../services/api'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

function MetricCard({ title, value, icon: Icon, change, changeType = 'neutral' }: MetricCardProps) {
  return (
    <div className="card">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-8 w-8 text-primary-600" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
              {change && (
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  changeType === 'positive' ? 'text-green-600' : 
                  changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {change}
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery(
    'dashboard-metrics',
    fetchDashboardMetrics
  )

  const { data: leadsByStage, isLoading: stageLoading } = useQuery(
    'leads-by-stage',
    fetchLeadsByStage
  )

  if (metricsLoading || stageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Couples"
          value={metrics?.total_couples?.toLocaleString() || '0'}
          icon={HeartIcon}
          change="+12%"
          changeType="positive"
        />
        <MetricCard
          title="Active Leads"
          value={metrics?.total_leads?.toLocaleString() || '0'}
          icon={UserGroupIcon}
          change="+8%"
          changeType="positive"
        />
        <MetricCard
          title="Qualified Leads"
          value={metrics?.qualified_leads?.toLocaleString() || '0'}
          icon={CheckCircleIcon}
          change="+15%"
          changeType="positive"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${metrics?.conversion_rate || 0}%`}
          icon={ArrowTrendingUpIcon}
          change="+2.1%"
          changeType="positive"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Avg Lead Score"
          value={metrics?.average_lead_score?.toFixed(1) || '0'}
          icon={ArrowTrendingUpIcon}
        />
        <MetricCard
          title="Ready for Contact"
          value={metrics?.leads_ready_for_contact?.toLocaleString() || '0'}
          icon={ClockIcon}
        />
        <MetricCard
          title="Revenue Pipeline"
          value={`$${metrics?.total_revenue?.toLocaleString() || '0'}`}
          icon={CurrencyDollarIcon}
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="space-y-3">
            {leadsByStage?.map((stage: any) => (
              <div key={stage.stage} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {stage.stage.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{stage.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  New couple registered: Sarah & Mike Johnson
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  Lead qualified: Emma & David Wilson
                </p>
                <p className="text-sm text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  Campaign sent to 25 couples
                </p>
                <p className="text-sm text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">
            Create Campaign
          </button>
          <button className="btn-secondary">
            Import Couples
          </button>
          <button className="btn-secondary">
            View Reports
          </button>
        </div>
      </div>
    </div>
  )
}