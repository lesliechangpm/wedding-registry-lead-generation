import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'
import { Card, CardHeader, CardBody, Button, Badge } from '../components/ui'
import { clsx } from 'clsx'

// Mock data for analytics
const performanceData = [
  { month: 'Jan', leads: 45, conversions: 12, revenue: 600000 },
  { month: 'Feb', leads: 52, conversions: 15, revenue: 750000 },
  { month: 'Mar', leads: 48, conversions: 18, revenue: 900000 },
  { month: 'Apr', leads: 61, conversions: 22, revenue: 1100000 },
  { month: 'May', leads: 55, conversions: 19, revenue: 950000 },
  { month: 'Jun', leads: 67, conversions: 25, revenue: 1250000 },
]

const leadSourceData = [
  { name: 'The Knot', value: 35, count: 156, color: '#1e3a5f' },
  { name: 'Zola', value: 28, count: 124, color: '#e8b4a0' },
  { name: 'WeddingWire', value: 20, count: 89, color: '#9caf88' },
  { name: 'Referrals', value: 12, count: 53, color: '#f59e0b' },
  { name: 'Direct', value: 5, count: 22, color: '#6b7280' }
]

const conversionFunnelData = [
  { name: 'Website Visitors', value: 2000, fill: '#1e3a5f' },
  { name: 'Lead Captures', value: 1200, fill: '#2563eb' },
  { name: 'Qualified Leads', value: 800, fill: '#e8b4a0' },
  { name: 'Applications', value: 350, fill: '#9caf88' },
  { name: 'Approvals', value: 280, fill: '#059669' },
  { name: 'Closings', value: 220, fill: '#dc2626' }
]

const geographicData = [
  { state: 'CA', leads: 89, revenue: 4450000 },
  { state: 'TX', leads: 67, revenue: 3350000 },
  { state: 'NY', leads: 56, revenue: 3920000 },
  { state: 'FL', leads: 45, revenue: 2250000 },
  { state: 'WA', leads: 34, revenue: 2040000 }
]

const weddingStageData = [
  { stage: 'Engaged', count: 145, conversion: 28 },
  { stage: 'Planning', count: 123, conversion: 35 },
  { stage: 'Recently Married', count: 89, conversion: 42 }
]

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  subtitle?: string
}

function MetricCard({ title, value, icon: Icon, change, changeType = 'neutral', subtitle }: MetricCardProps) {
  const changeColors = {
    positive: 'text-forest-600',
    negative: 'text-burgundy-600',
    neutral: 'text-warm-gray-600'
  }

  const changeIcons = {
    positive: ArrowTrendingUpIcon,
    negative: ArrowTrendingDownIcon,
    neutral: null
  }

  const ChangeIcon = changeIcons[changeType]

  return (
    <Card>
      <CardBody>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-navy-100 rounded-wedding-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-navy-600" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-warm-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-navy-900 dark:text-white">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                {change && (
                  <div className={clsx('ml-2 flex items-baseline text-sm font-semibold', changeColors[changeType])}>
                    {ChangeIcon && <ChangeIcon className="self-center flex-shrink-0 h-4 w-4" />}
                    <span className="sr-only">{changeType === 'positive' ? 'Increased' : 'Decreased'} by</span>
                    {change}
                  </div>
                )}
              </dd>
              {subtitle && (
                <dd className="text-sm text-warm-gray-400 mt-1">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6m')

  // Calculate key metrics
  const totalLeads = performanceData.reduce((sum, month) => sum + month.leads, 0)
  const totalConversions = performanceData.reduce((sum, month) => sum + month.conversions, 0)
  const totalRevenue = performanceData.reduce((sum, month) => sum + month.revenue, 0)
  const avgConversionRate = ((totalConversions / totalLeads) * 100).toFixed(1)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white font-header">
            Analytics Dashboard
          </h1>
          <p className="text-warm-gray-600 dark:text-gray-400 mt-1 font-body">
            Comprehensive insights and performance metrics for VowCRM
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-base"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline-primary" leftIcon={<ChartBarIcon className="w-4 h-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          icon={UserGroupIcon}
          change="+12%"
          changeType="positive"
          subtitle="vs. last period"
        />
        <MetricCard
          title="Conversions"
          value={totalConversions}
          icon={HeartIcon}
          change="+8%"
          changeType="positive"
          subtitle={`${avgConversionRate}% conversion rate`}
        />
        <MetricCard
          title="Revenue Generated"
          value={formatCurrency(totalRevenue)}
          icon={CurrencyDollarIcon}
          change="+15%"
          changeType="positive"
          subtitle="Total closed loans"
        />
        <MetricCard
          title="Avg. Loan Amount"
          value={formatCurrency(totalRevenue / totalConversions)}
          icon={ArrowTrendingUpIcon}
          change="+3%"
          changeType="positive"
          subtitle="Per conversion"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title="Performance Trends"
            subtitle="Lead generation and conversion trends over time"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#1e3a5f" 
                  strokeWidth={3}
                  dot={{ fill: '#1e3a5f', strokeWidth: 2, r: 6 }}
                  name="Leads"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#e8b4a0" 
                  strokeWidth={3}
                  dot={{ fill: '#e8b4a0', strokeWidth: 2, r: 6 }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader 
            title="Lead Sources"
            subtitle="Distribution of leads by source platform"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={leadSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {leadSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Legend */}
            <div className="mt-4 space-y-2">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm text-warm-gray-700 dark:text-gray-300">{source.name}</span>
                  </div>
                  <span className="text-sm font-medium text-navy-900 dark:text-white">
                    {source.count} leads
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader 
            title="Conversion Funnel"
            subtitle="Lead progression through sales funnel"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={conversionFunnelData}
                  isAnimationActive
                >
                  <LabelList position="center" fill="#fff" stroke="none" />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Distribution */}
        <Card>
          <CardHeader 
            title="Top Performing States"
            subtitle="Lead generation by geographic location"
          />
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="state" 
                  tick={{ fontSize: 12 }}
                  width={30}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'leads') return [value, 'Leads']
                    return [formatCurrency(value), 'Revenue']
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="leads" fill="#1e3a5f" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Wedding Stage Analysis */}
        <Card>
          <CardHeader 
            title="Wedding Stage Performance"
            subtitle="Lead conversion by wedding stage"
          />
          <CardBody>
            <div className="space-y-4">
              {weddingStageData.map((stage) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="w-4 h-4 text-rose-gold-600" />
                      <span className="text-sm font-medium text-navy-900 dark:text-white">
                        {stage.stage}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-navy-900 dark:text-white">
                        {stage.count} leads
                      </div>
                      <div className="text-xs text-warm-gray-500">
                        {stage.conversion}% conversion
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-warm-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-navy-500 to-rose-gold-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stage.conversion / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-sage-50 rounded-wedding-lg">
              <h4 className="text-sm font-semibold text-sage-800 mb-2">💡 Insight</h4>
              <p className="text-sm text-sage-700">
                Recently married couples show the highest conversion rate (42%), likely due to 
                immediate housing needs post-wedding.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Revenue Analysis */}
      <Card>
        <CardHeader 
          title="Revenue Analysis"
          subtitle="Monthly revenue trends and projections"
        />
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#9caf88" 
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9caf88" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9caf88" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader 
          title="Key Performance Insights"
          subtitle="Actionable insights to improve lead generation"
        />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-forest-50 rounded-wedding-lg border border-forest-200">
              <div className="flex items-center mb-2">
                <ArrowTrendingUpIcon className="w-5 h-5 text-forest-600 mr-2" />
                <h4 className="text-sm font-semibold text-forest-800">Best Performing Platform</h4>
              </div>
              <p className="text-sm text-forest-700">
                The Knot generates 35% of all leads with highest conversion rates. 
                Consider increasing investment in this platform.
              </p>
            </div>

            <div className="p-4 bg-rose-gold-50 rounded-wedding-lg border border-rose-gold-200">
              <div className="flex items-center mb-2">
                <ClockIcon className="w-5 h-5 text-rose-gold-600 mr-2" />
                <h4 className="text-sm font-semibold text-rose-gold-800">Optimal Contact Timing</h4>
              </div>
              <p className="text-sm text-rose-gold-700">
                Recently married couples (within 3 months) show 42% higher conversion rates 
                than engaged couples.
              </p>
            </div>

            <div className="p-4 bg-navy-50 rounded-wedding-lg border border-navy-200">
              <div className="flex items-center mb-2">
                <MapPinIcon className="w-5 h-5 text-navy-600 mr-2" />
                <h4 className="text-sm font-semibold text-navy-800">Geographic Opportunity</h4>
              </div>
              <p className="text-sm text-navy-700">
                CA, TX, and NY represent 60% of revenue. Expanding to FL and WA 
                shows strong growth potential.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}