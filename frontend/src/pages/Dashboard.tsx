import { useQuery } from 'react-query'
import {
  UserGroupIcon,
  HeartIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BellIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { fetchDashboardMetrics, fetchLeadsByStage } from '../services/api'
import { Card, CardHeader, CardBody, Button, Badge, LoadingSpinner } from '../components/ui'
import { clsx } from 'clsx'

interface MetricCardProps {
  title: string
  value: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  trend?: 'up' | 'down' | 'flat'
}

function MetricCard({ title, value, icon: Icon, change, changeType = 'neutral', trend }: MetricCardProps) {
  const changeColors = {
    positive: 'text-forest-500',
    negative: 'text-burgundy-500',
    neutral: 'text-warm-gray-500'
  }

  const trendIcon = {
    up: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    flat: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    )
  }

  return (
    <Card hover className="transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-navy-50 dark:bg-navy-900/20 rounded-wedding-lg flex items-center justify-center">
              <Icon className="h-6 w-6 text-navy-600 dark:text-navy-400" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-warm-gray-600 dark:text-gray-400 font-body">
              {title}
            </p>
            <p className="text-2xl font-bold text-navy-900 dark:text-white font-header">
              {value}
            </p>
          </div>
        </div>
        {change && (
          <div className={clsx('flex items-center space-x-1', changeColors[changeType])}>
            {trend && trendIcon[trend]}
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
    </Card>
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

  // Mock data for demonstration
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  if (metricsLoading || stageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  const recentLeads = [
    {
      id: 1,
      names: "Sarah & Mike Johnson",
      weddingDate: "2024-06-15",
      leadScore: 85,
      platform: "The Knot",
      status: "qualified",
      avatar: "SJ"
    },
    {
      id: 2,
      names: "Emma & David Wilson",
      weddingDate: "2024-08-22",
      leadScore: 72,
      platform: "Zola",
      status: "contacted",
      avatar: "EW"
    },
    {
      id: 3,
      names: "Lisa & Tom Chen",
      weddingDate: "2024-05-18",
      leadScore: 91,
      platform: "WeddingWire",
      status: "new",
      avatar: "LC"
    }
  ]

  const upcomingFollowups = [
    {
      id: 1,
      names: "Jennifer & Alex Rodriguez",
      type: "Wedding Venue Visit",
      date: "Today, 2:00 PM",
      priority: "high"
    },
    {
      id: 2,
      names: "Maria & Carlos Santos",
      type: "Loan Application Review",
      date: "Tomorrow, 10:00 AM",
      priority: "medium"
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white font-header">
            Good morning, John! 👋
          </h1>
          <p className="text-warm-gray-600 dark:text-gray-400 mt-1 font-body">
            {currentTime}
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Button variant="outline-primary" leftIcon={<BellIcon className="w-4 h-4" />}>
            3 Notifications
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <Card variant="gradient" className="text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold font-header">24</div>
            <div className="text-sm opacity-90">New Leads This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-header">15</div>
            <div className="text-sm opacity-90">Active Pipeline</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-header">8</div>
            <div className="text-sm opacity-90">Closings This Month</div>
          </div>
        </div>
      </Card>

      {/* Main Grid - 3x2 or 4x2 layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Card 1: Lead Pipeline Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title="Lead Pipeline Funnel"
            subtitle="Visual funnel from leads to closings"
          />
          <CardBody>
            <div className="space-y-4">
              {[
                { stage: 'New Leads', count: 48, percentage: 100, color: 'bg-navy-500' },
                { stage: 'Contacted', count: 35, percentage: 73, color: 'bg-rose-gold-500' },
                { stage: 'Qualified', count: 28, percentage: 58, color: 'bg-sage-400' },
                { stage: 'Applications', count: 18, percentage: 38, color: 'bg-amber-500' },
                { stage: 'Closings', count: 8, percentage: 17, color: 'bg-forest-500' }
              ].map((item) => (
                <div key={item.stage} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-warm-gray-700 dark:text-gray-300">
                    {item.stage}
                  </div>
                  <div className="flex-1 bg-warm-gray-200 dark:bg-gray-700 rounded-full h-6">
                    <div 
                      className={clsx('h-6 rounded-full flex items-center justify-end pr-2', item.color)}
                      style={{ width: `${item.percentage}%` }}
                    >
                      <span className="text-xs text-white font-semibold">{item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Card 2: Recent Wedding Leads */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title="Recent Wedding Leads"
            subtitle="Latest couples with action items"
            action={
              <Button variant="ghost" size="sm">View All</Button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center space-x-4 p-3 rounded-wedding hover:bg-warm-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-10 h-10 bg-rose-gold-100 rounded-full flex items-center justify-center text-rose-gold-800 font-semibold text-sm">
                    {lead.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-navy-900 dark:text-white">{lead.names}</p>
                      <Badge variant="primary" size="sm">Score: {lead.leadScore}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-warm-gray-600 dark:text-gray-400">
                        Wedding: {new Date(lead.weddingDate).toLocaleDateString()}
                      </p>
                      <Badge variant="accent" size="sm">{lead.platform}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline-primary">Contact</Button>
                    <Button size="sm" variant="secondary">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="New Leads"
          value={metrics?.total_couples?.toLocaleString() || '142'}
          icon={HeartIcon}
          change="+12%"
          changeType="positive"
          trend="up"
        />
        <MetricCard
          title="Active Pipeline"
          value={metrics?.total_leads?.toLocaleString() || '85'}
          icon={UserGroupIcon}
          change="+8%"
          changeType="positive"
          trend="up"
        />
        <MetricCard
          title="This Month's Closings"
          value={metrics?.qualified_leads?.toLocaleString() || '23'}
          icon={CheckCircleIcon}
          change="+15%"
          changeType="positive"
          trend="up"
        />
        <MetricCard
          title="Revenue Pipeline"
          value="$2.4M"
          icon={CurrencyDollarIcon}
          change="+18%"
          changeType="positive"
          trend="up"
        />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Follow-ups */}
        <Card>
          <CardHeader 
            title="Upcoming Follow-ups"
            subtitle="Wedding milestone alerts and scheduled contacts"
            action={
              <Button variant="ghost" size="sm" leftIcon={<CalendarDaysIcon className="w-4 h-4" />}>
                View Calendar
              </Button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              {upcomingFollowups.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-warm-gray-200 dark:border-gray-600 rounded-wedding">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-rose-gold-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white">{item.names}</p>
                      <p className="text-sm text-warm-gray-600 dark:text-gray-400">{item.type}</p>
                      <p className="text-xs text-warm-gray-500 dark:text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <Badge variant={item.priority === 'high' ? 'danger' : 'warning'} size="sm">
                    {item.priority} priority
                  </Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader 
            title="Market Insights"
            subtitle="Local wedding season trends and statistics"
            action={
              <Button variant="ghost" size="sm" leftIcon={<ChartBarIcon className="w-4 h-4" />}>
                Full Report
              </Button>
            }
          />
          <CardBody>
            <div className="space-y-4">
              <div className="p-4 bg-sage-50 dark:bg-sage-900/10 rounded-wedding">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sage-800 dark:text-sage-200">Peak Wedding Season</p>
                    <p className="text-xs text-sage-600 dark:text-sage-400">May - September 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-sage-800 dark:text-sage-200">67%</p>
                    <p className="text-xs text-sage-600 dark:text-sage-400">of annual weddings</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">$28K</p>
                  <p className="text-xs text-warm-gray-600 dark:text-gray-400">Avg Wedding Cost</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">18mo</p>
                  <p className="text-xs text-warm-gray-600 dark:text-gray-400">Planning Duration</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}