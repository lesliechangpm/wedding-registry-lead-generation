import React from 'react'
import ReactDOM from 'react-dom/client'
import './index-professional.css'

// Professional App component with modern UI
function App() {
  const [currentPage, setCurrentPage] = React.useState('dashboard')
  const [dashboardData, setDashboardData] = React.useState<any>(null)
  const [leadsData, setLeadsData] = React.useState<any>(null)
  const [couplesData, setCouplesData] = React.useState<any>(null)
  const [campaignsData, setCampaignsData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, leadsRes, couplesRes, campaignsRes] = await Promise.all([
          fetch('http://localhost:8000/api/v1/analytics/dashboard'),
          fetch('http://localhost:8000/api/v1/leads?page_size=20'),
          fetch('http://localhost:8000/api/v1/couples?page_size=20'),
          fetch('http://localhost:8000/api/v1/campaigns')
        ])

        const [dashboard, leads, couples, campaigns] = await Promise.all([
          dashboardRes.json(),
          leadsRes.json(), 
          couplesRes.json(),
          campaignsRes.json()
        ])

        setDashboardData(dashboard)
        setLeadsData(leads)
        setCouplesData(couples)
        setCampaignsData(campaigns)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊', color: 'text-blue-600' },
    { name: 'Leads', id: 'leads', icon: '🎯', color: 'text-green-600' },
    { name: 'Couples', id: 'couples', icon: '💕', color: 'text-pink-600' },
    { name: 'Campaigns', id: 'campaigns', icon: '📧', color: 'text-purple-600' },
    { name: 'Analytics', id: 'analytics', icon: '📈', color: 'text-indigo-600' },
  ]

  const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, color = "blue" }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`w-12 h-12 ${color === 'blue' ? 'bg-blue-50' : color === 'green' ? 'bg-green-50' : color === 'pink' ? 'bg-pink-50' : color === 'yellow' ? 'bg-yellow-50' : color === 'emerald' ? 'bg-emerald-50' : color === 'purple' ? 'bg-purple-50' : color === 'indigo' ? 'bg-indigo-50' : 'bg-gray-50'} rounded-lg flex items-center justify-center mr-4`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>
        {trend && (
          <div className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className="flex items-center">
              {trend === 'up' ? '↗️' : '↘️'} {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  )

  const getStatusBadge = (status: string) => {
    const statusColors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      nurturing: 'bg-purple-100 text-purple-800',
      converted: 'bg-emerald-100 text-emerald-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      engaged: 'bg-pink-100 text-pink-800',
      planning: 'bg-blue-100 text-blue-800',
      recently_married: 'bg-green-100 text-green-800'
    }
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 font-bold'
    if (score >= 80) return 'text-green-600 font-semibold'
    if (score >= 70) return 'text-yellow-600 font-semibold'
    if (score >= 60) return 'text-orange-600 font-semibold'
    return 'text-red-600 font-semibold'
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      )
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your wedding leads.</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  📧 New Campaign
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  📊 View Reports
                </button>
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Couples"
                value={dashboardData?.total_couples?.toLocaleString() || '0'}
                icon="💕"
                trend="up"
                trendValue="+12.5%"
                color="pink"
              />
              <MetricCard
                title="Active Leads"
                value={dashboardData?.total_leads?.toLocaleString() || '0'}
                subtitle={`${dashboardData?.leads_ready_for_contact || 0} ready for contact`}
                icon="🎯"
                trend="up"
                trendValue="+8.2%"
                color="green"
              />
              <MetricCard
                title="Qualified Leads"
                value={dashboardData?.qualified_leads?.toLocaleString() || '0'}
                icon="✅"
                trend="up"
                trendValue="+15.3%"
                color="emerald"
              />
              <MetricCard
                title="Revenue Pipeline"
                value={`$${(dashboardData?.total_revenue || 0).toLocaleString()}`}
                subtitle={`${dashboardData?.conversion_rate || 0}% conversion rate`}
                icon="💰"
                trend="up"
                trendValue="+22.1%"
                color="yellow"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Avg Lead Score"
                value={`${dashboardData?.average_lead_score || 0}/100`}
                icon="📊"
                color="blue"
              />
              <MetricCard
                title="Response Rate"
                value="24.8%"
                icon="📈"
                trend="up"
                trendValue="+3.2%"
                color="indigo"
              />
              <MetricCard
                title="Time to Contact"
                value="2.3 days"
                icon="⏱️"
                trend="up" 
                trendValue="-0.5 days"
                color="purple"
              />
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  {[
                    { type: 'success', message: 'Sarah & Mike Johnson qualified for $450K loan', time: '2 hours ago', icon: '🎉' },
                    { type: 'info', message: 'New couple registered from San Francisco', time: '4 hours ago', icon: '💕' },
                    { type: 'warning', message: 'Follow-up needed: Emma & David Wilson', time: '6 hours ago', icon: '⏰' },
                    { type: 'success', message: 'Campaign sent to 25 engaged couples', time: '1 day ago', icon: '📧' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                        <span className="text-sm">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Leads</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all</button>
                </div>
                <div className="space-y-4">
                  {leadsData?.leads?.slice(0, 4).map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">{Math.round(lead.lead_score)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Lead #{lead.id}</p>
                          <p className="text-sm text-gray-500">{lead.target_location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          ${lead.target_purchase_price?.toLocaleString()}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'leads':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
                <p className="text-gray-600 mt-1">{leadsData?.total_count || 0} total leads in your pipeline</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  📥 Import Leads
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  🔧 Filters
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🆕</span>
                  <div>
                    <p className="text-blue-100">New Leads</p>
                    <p className="text-2xl font-bold">{leadsData?.leads?.filter((l: any) => l.status === 'new').length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📞</span>
                  <div>
                    <p className="text-yellow-100">Contacted</p>
                    <p className="text-2xl font-bold">{leadsData?.leads?.filter((l: any) => l.status === 'contacted').length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">✅</span>
                  <div>
                    <p className="text-green-100">Qualified</p>
                    <p className="text-2xl font-bold">{leadsData?.leads?.filter((l: any) => l.status === 'qualified').length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <p className="text-purple-100">Converted</p>
                    <p className="text-2xl font-bold">{leadsData?.leads?.filter((l: any) => l.status === 'converted').length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Leads Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lead Pipeline</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
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
                        Income
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leadsData?.leads?.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {lead.id}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Lead #{lead.id}</div>
                              <div className="text-sm text-gray-500">Couple #{lead.couple_id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-lg font-bold ${getScoreColor(lead.lead_score)}`}>
                            {Math.round(lead.lead_score)}
                          </div>
                          <div className="text-xs text-gray-500">/ 100</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(lead.status)}`}>
                            {lead.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${lead.target_purchase_price?.toLocaleString() || 'Not set'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.target_down_payment ? `$${lead.target_down_payment.toLocaleString()} down` : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lead.target_location || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${lead.estimated_income?.toLocaleString() || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {lead.credit_score_range || 'No credit info'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 font-medium">View</button>
                            <button className="text-green-600 hover:text-green-900 font-medium">Contact</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'couples':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Wedding Couples</h1>
                <p className="text-gray-600 mt-1">{couplesData?.length || 0} couples in your database</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  💕 Add Couple
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  📥 Import Data
                </button>
              </div>
            </div>

            {/* Couples Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couplesData?.slice(0, 12).map((couple: any) => (
                <div key={couple.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        💕
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {couple.partner_1_name} & {couple.partner_2_name}
                        </h3>
                        <p className="text-sm text-gray-500">Couple #{couple.id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="text-gray-400 hover:text-gray-600 p-1">👁️</button>
                      <button className="text-gray-400 hover:text-gray-600 p-1">✏️</button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stage:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(couple.wedding_stage)}`}>
                        {couple.wedding_stage.replace('_', ' ')}
                      </span>
                    </div>

                    {couple.wedding_date && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Wedding:</span>
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
                        <span className="text-sm font-semibold text-gray-900">
                          ${couple.wedding_budget.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Create Lead
                      </button>
                      <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'campaigns':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
                <p className="text-gray-600 mt-1">Manage your automated wedding lead campaigns</p>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                ✨ Create Campaign
              </button>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚀</span>
                  <div>
                    <p className="text-green-100">Active</p>
                    <p className="text-2xl font-bold">{campaignsData?.filter((c: any) => c.status === 'active').length || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📧</span>
                  <div>
                    <p className="text-blue-100">Total Sends</p>
                    <p className="text-2xl font-bold">{campaignsData?.reduce((sum: number, c: any) => sum + c.total_sends, 0) || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">👁️</span>
                  <div>
                    <p className="text-yellow-100">Avg Open Rate</p>
                    <p className="text-2xl font-bold">68%</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <p className="text-purple-100">Conversions</p>
                    <p className="text-2xl font-bold">{campaignsData?.reduce((sum: number, c: any) => sum + c.total_conversions, 0) || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaignsData?.map((campaign: any) => (
                <div key={campaign.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        📧
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <p className="text-sm text-gray-500">{campaign.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(campaign.status)}`}>
                        {campaign.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">⚙️</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{campaign.total_sends}</p>
                      <p className="text-sm text-gray-500">Sends</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{campaign.total_opens}</p>
                      <p className="text-sm text-gray-500">Opens</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{campaign.total_clicks}</p>
                      <p className="text-sm text-gray-500">Clicks</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{campaign.total_conversions}</p>
                      <p className="text-sm text-gray-500">Conversions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {campaign.total_sends > 0 ? Math.round((campaign.total_opens / campaign.total_sends) * 100) : 0}%
                      </p>
                      <p className="text-sm text-gray-500">Open Rate</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
              <p className="text-gray-600 mt-1">Performance metrics and market insights</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Performance Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Conversion Rate</span>
                    <span className="text-lg font-bold text-green-600">{dashboardData?.conversion_rate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Avg Lead Score</span>
                    <span className="text-lg font-bold text-blue-600">{dashboardData?.average_lead_score || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Revenue per Lead</span>
                    <span className="text-lg font-bold text-purple-600">$243</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🗺️ Top Markets</h3>
                <div className="space-y-3">
                  {['California', 'Texas', 'New York', 'Florida', 'Washington'].map((state, index) => (
                    <div key={state} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 text-sm text-gray-500">#{index + 1}</div>
                        <div className="text-sm font-medium text-gray-900">{state}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-600 mr-2">{25 - index * 3} couples</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${100 - index * 15}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💕</span>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold text-gray-900">WeddingLeads</div>
                <div className="text-xs text-gray-500">Mortgage CRM</div>
              </div>
            </div>
          </div>
          
          <nav className="mt-6 px-3">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full text-left px-4 py-3 mb-1 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {item.name}
                {currentPage === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Senior Loan Officer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)