import { useState } from 'react'
import { useQuery } from 'react-query'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'scoring', name: 'Lead Scoring', icon: '📊' },
    { id: 'campaigns', name: 'Campaign Settings', icon: '📧' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'compliance', name: 'Compliance', icon: '⚖️' }
  ]

  const [profileForm, setProfileForm] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    license_number: 'LO12345',
    service_areas: ['California', 'Nevada'],
    max_leads_per_day: 10
  })

  const handleSaveProfile = () => {
    // API call would go here
    toast.success('Profile updated successfully!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.license_number}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, license_number: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Work Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Max Leads Per Day</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileForm.max_leads_per_day}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, max_leads_per_day: parseInt(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="form-label">Service Areas</label>
                  <select multiple className="form-input" size={3}>
                    <option>California</option>
                    <option>Nevada</option>
                    <option>Arizona</option>
                    <option>Oregon</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="btn-primary" onClick={handleSaveProfile}>
                Save Changes
              </button>
            </div>
          </div>
        )

      case 'scoring':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lead Scoring Rules</h3>
              <p className="text-sm text-gray-600 mb-6">
                Customize how leads are scored based on different criteria.
              </p>
              
              <div className="space-y-4">
                <div className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Wedding Budget</h4>
                      <p className="text-sm text-gray-500">Score based on wedding budget ranges</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <input type="range" min="0" max="100" defaultValue="25" className="w-20" />
                      <span className="text-sm font-medium">25%</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Timeline</h4>
                      <p className="text-sm text-gray-500">Score based on wedding timeline and stage</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <input type="range" min="0" max="100" defaultValue="20" className="w-20" />
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Geographic Location</h4>
                      <p className="text-sm text-gray-500">Score based on location and market value</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Weight:</span>
                      <input type="range" min="0" max="100" defaultValue="15" className="w-20" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="btn-primary">Save Scoring Rules</button>
              </div>
            </div>
          </div>
        )

      case 'campaigns':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Default Campaign Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Default From Email</label>
                  <input type="email" className="form-input" defaultValue="john@mortgagecompany.com" />
                </div>
                
                <div>
                  <label className="form-label">Default From Name</label>
                  <input type="text" className="form-input" defaultValue="John Doe - Mortgage Specialist" />
                </div>
                
                <div>
                  <label className="form-label">Email Signature</label>
                  <textarea className="form-input h-32" defaultValue="Best regards,\nJohn Doe\nSenior Loan Officer\nMortgage Company\n(555) 123-4567" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-follow-up" className="rounded" defaultChecked />
                  <label htmlFor="auto-follow-up" className="text-sm text-gray-700">
                    Enable automatic follow-up sequences
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Save Campaign Settings</button>
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Integrations</h3>
              
              <div className="space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                        💕
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">The Knot</h4>
                        <p className="text-sm text-gray-500">Wedding planning platform</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Not Connected</span>
                      <button className="btn-secondary text-sm">Connect</button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        🎉
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Zola</h4>
                        <p className="text-sm text-gray-500">Wedding registry platform</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Not Connected</span>
                      <button className="btn-secondary text-sm">Connect</button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        📧
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">SendGrid</h4>
                        <p className="text-sm text-gray-500">Email delivery service</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-600 mr-2">✓ Connected</span>
                      <button className="btn-secondary text-sm">Configure</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'compliance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="form-label">Waiting Period After Wedding (Days)</label>
                  <input type="number" className="form-input" defaultValue="60" />
                  <p className="text-sm text-gray-500 mt-1">
                    How long to wait after the wedding date before initial contact
                  </p>
                </div>
                
                <div>
                  <label className="form-label">Maximum Contacts Per Day</label>
                  <input type="number" className="form-input" defaultValue="50" />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="tcpa-compliance" className="rounded" defaultChecked />
                  <label htmlFor="tcpa-compliance" className="text-sm text-gray-700">
                    Enable TCPA compliance checks
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-opt-out" className="rounded" defaultChecked />
                  <label htmlFor="auto-opt-out" className="text-sm text-gray-700">
                    Automatically honor opt-out requests
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="audit-trail" className="rounded" defaultChecked />
                  <label htmlFor="audit-trail" className="text-sm text-gray-700">
                    Maintain detailed audit trail
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Save Compliance Settings</button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, preferences, and integrations
        </p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}