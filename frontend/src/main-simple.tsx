import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple App component
function App() {
  const [currentPage, setCurrentPage] = React.useState('dashboard')
  const [dashboardData, setDashboardData] = React.useState<any>(null)
  const [leadsData, setLeadsData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  // Fetch data on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardResponse = await fetch('http://localhost:8000/api/v1/analytics/dashboard')
        const dashboard = await dashboardResponse.json()
        setDashboardData(dashboard)

        const leadsResponse = await fetch('http://localhost:8000/api/v1/leads')
        const leads = await leadsResponse.json()
        setLeadsData(leads)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const navigation = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Leads', id: 'leads' },
    { name: 'Couples', id: 'couples' },
    { name: 'Campaigns', id: 'campaigns' },
  ]

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.total_couples || 0}
                </div>
                <div className="text-sm text-gray-500">Total Couples</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.total_leads || 0}
                </div>
                <div className="text-sm text-gray-500">Active Leads</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.qualified_leads || 0}
                </div>
                <div className="text-sm text-gray-500">Qualified Leads</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-semibold text-gray-900">
                  {dashboardData?.conversion_rate || 0}%
                </div>
                <div className="text-sm text-gray-500">Conversion Rate</div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-900">New couple registered: Sarah & Mike Johnson</p>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-900">Lead qualified: Emma & David Wilson</p>
                    <p className="text-sm text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm text-gray-900">Campaign sent to 25 couples</p>
                    <p className="text-sm text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'leads':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lead ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Target Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadsData?.leads?.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Lead #{lead.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {lead.lead_score.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {lead.status}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case 'couples':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Couples</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Couple management interface would be here...</p>
              <p className="text-sm text-gray-500 mt-2">
                This would show all the wedding couples in your database with their wedding details, 
                contact information, and lead generation status.
              </p>
            </div>
          </div>
        )

      case 'campaigns':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p>Email campaign management interface would be here...</p>
              <p className="text-sm text-gray-500 mt-2">
                This would show your email campaigns, performance metrics, and allow you to 
                create new automated sequences.
              </p>
            </div>
          </div>
        )

      default:
        return <div>Page not found</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">💕 WeddingLeads</div>
            </div>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full text-left px-6 py-3 text-sm font-medium ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="py-6 px-8">
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