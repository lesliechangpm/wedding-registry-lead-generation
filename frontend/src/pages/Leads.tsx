import React, { useState } from 'react'
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  HeartIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Button, Input, Badge, StatusBadge, PriorityBadge, Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui'
import Table, { Column } from '../components/ui/Table'
import { clsx } from 'clsx'

interface Lead {
  id: string
  couple_name: string
  partner1_name: string
  partner2_name: string
  email: string
  phone: string
  wedding_date: string
  venue_location: string
  platform: string
  lead_score: number
  status: 'new' | 'contacted' | 'qualified' | 'application' | 'approved' | 'closed' | 'declined'
  last_contact: string
  estimated_loan_amount: number
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  loan_officer: string
}

const mockLeads: Lead[] = [
  {
    id: '1',
    couple_name: 'Sarah & Mike Johnson',
    partner1_name: 'Sarah Johnson',
    partner2_name: 'Mike Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    wedding_date: '2024-06-15',
    venue_location: 'Napa Valley, CA',
    platform: 'The Knot',
    lead_score: 85,
    status: 'qualified',
    last_contact: '2024-01-15',
    estimated_loan_amount: 650000,
    priority: 'high',
    created_at: '2024-01-10',
    loan_officer: 'John Smith'
  },
  {
    id: '2',
    couple_name: 'Emma & David Wilson',
    partner1_name: 'Emma Wilson',
    partner2_name: 'David Wilson',
    email: 'emma.wilson@email.com',
    phone: '(555) 234-5678',
    wedding_date: '2024-08-22',
    venue_location: 'Austin, TX',
    platform: 'Zola',
    lead_score: 72,
    status: 'contacted',
    last_contact: '2024-01-12',
    estimated_loan_amount: 425000,
    priority: 'medium',
    created_at: '2024-01-08',
    loan_officer: 'John Smith'
  },
  {
    id: '3',
    couple_name: 'Lisa & Tom Chen',
    partner1_name: 'Lisa Chen',
    partner2_name: 'Tom Chen',
    email: 'lisa.chen@email.com',
    phone: '(555) 345-6789',
    wedding_date: '2024-05-18',
    venue_location: 'Seattle, WA',
    platform: 'WeddingWire',
    lead_score: 91,
    status: 'new',
    last_contact: '2024-01-14',
    estimated_loan_amount: 785000,
    priority: 'urgent',
    created_at: '2024-01-14',
    loan_officer: 'John Smith'
  },
  {
    id: '4',
    couple_name: 'Maria & Carlos Santos',
    partner1_name: 'Maria Santos',
    partner2_name: 'Carlos Santos',
    email: 'maria.santos@email.com',
    phone: '(555) 456-7890',
    wedding_date: '2024-09-10',
    venue_location: 'Miami, FL',
    platform: 'Joy',
    lead_score: 68,
    status: 'application',
    last_contact: '2024-01-13',
    estimated_loan_amount: 520000,
    priority: 'medium',
    created_at: '2024-01-05',
    loan_officer: 'John Smith'
  }
]

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [filters, setFilters] = useState({
    search: '',
    platform: '',
    status: '',
    leadScore: '',
    priority: ''
  })
  const [sortKey, setSortKey] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    partner1_name: '',
    partner2_name: '',
    email: '',
    phone: '',
    wedding_date: '',
    venue_location: '',
    platform: '',
    estimated_loan_amount: '',
    priority: 'medium' as const,
    notes: '',
    contact_preference: 'email' as const,
    home_purchase_timeline: '',
    combined_income: '',
    credit_score_range: '',
    loan_type_preference: ''
  })

  // Filter leads based on current filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !filters.search || 
      lead.couple_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.venue_location.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesPlatform = !filters.platform || lead.platform === filters.platform
    const matchesStatus = !filters.status || lead.status === filters.status
    const matchesLeadScore = !filters.leadScore || 
      (filters.leadScore === 'high' && lead.lead_score >= 80) ||
      (filters.leadScore === 'medium' && lead.lead_score >= 60 && lead.lead_score < 80) ||
      (filters.leadScore === 'low' && lead.lead_score < 60)
    const matchesPriority = !filters.priority || lead.priority === filters.priority

    return matchesSearch && matchesPlatform && matchesStatus && matchesLeadScore && matchesPriority
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSelectRow = (id: string, selected: boolean) => {
    setSelectedRows(prev => 
      selected 
        ? [...prev, id]
        : prev.filter(rowId => rowId !== id)
    )
  }

  const handleSelectAll = (selected: boolean) => {
    setSelectedRows(selected ? filteredLeads.map(lead => lead.id) : [])
  }

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handleRowClick = (lead: Lead) => {
    console.log('View lead details:', lead)
  }

  const columns: Column<Lead>[] = [
    {
      key: 'couple_name',
      title: 'Couple',
      sortable: true,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-rose-gold-100 rounded-full flex items-center justify-center">
            <HeartIcon className="w-5 h-5 text-rose-gold-600" />
          </div>
          <div>
            <div className="font-medium text-navy-900 dark:text-white">
              {record.couple_name}
            </div>
            <div className="text-sm text-warm-gray-500 dark:text-gray-400">
              {record.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'wedding_date',
      title: 'Wedding Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <CalendarDaysIcon className="w-4 h-4 text-warm-gray-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'lead_score',
      title: 'Lead Score',
      sortable: true,
      align: 'center',
      render: (value) => (
        <div className="flex items-center justify-center">
          <div className={clsx(
            'w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold',
            value >= 80 ? 'bg-forest-100 text-forest-700' :
            value >= 60 ? 'bg-amber-100 text-amber-700' :
            'bg-burgundy-100 text-burgundy-700'
          )}>
            {value}
          </div>
        </div>
      )
    },
    {
      key: 'platform',
      title: 'Platform',
      sortable: true,
      render: (value) => (
        <Badge variant="accent" size="sm">
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value as any} />
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (value) => (
        <PriorityBadge priority={value as any} size="sm" />
      )
    },
    {
      key: 'estimated_loan_amount',
      title: 'Est. Loan Amount',
      sortable: true,
      align: 'right',
      render: (value) => (
        <div className="flex items-center justify-end space-x-1">
          <BanknotesIcon className="w-4 h-4 text-warm-gray-400" />
          <span className="font-medium">
            ${value.toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: 'last_contact',
      title: 'Last Contact',
      sortable: true,
      render: (value) => (
        <span className="text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="ghost" size="sm">
            <EyeIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <EnvelopeIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <PhoneIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <EllipsisVerticalIcon className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ]

  // Paginated data
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize)

  // Form handling functions
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      partner1_name: '',
      partner2_name: '',
      email: '',
      phone: '',
      wedding_date: '',
      venue_location: '',
      platform: '',
      estimated_loan_amount: '',
      priority: 'medium',
      notes: '',
      contact_preference: 'email',
      home_purchase_timeline: '',
      combined_income: '',
      credit_score_range: '',
      loan_type_preference: ''
    })
  }

  const generateLeadScore = (data: typeof formData): number => {
    let score = 50 // Base score
    
    // Higher income increases score
    if (data.combined_income) {
      const income = parseInt(data.combined_income.replace(/\D/g, ''))
      if (income >= 150000) score += 30
      else if (income >= 100000) score += 20
      else if (income >= 75000) score += 10
    }
    
    // Credit score impact
    if (data.credit_score_range === '800+') score += 25
    else if (data.credit_score_range === '750-799') score += 20
    else if (data.credit_score_range === '700-749') score += 15
    else if (data.credit_score_range === '650-699') score += 10
    
    // Timeline urgency
    if (data.home_purchase_timeline === 'Immediate') score += 20
    else if (data.home_purchase_timeline === 'Within 6 months') score += 15
    else if (data.home_purchase_timeline === 'Within 1 year') score += 10
    
    // Platform quality
    if (['The Knot', 'Zola'].includes(data.platform)) score += 10
    
    return Math.min(Math.max(score, 0), 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newLead: Lead = {
        id: (leads.length + 1).toString(),
        couple_name: `${formData.partner1_name} & ${formData.partner2_name}`,
        partner1_name: formData.partner1_name,
        partner2_name: formData.partner2_name,
        email: formData.email,
        phone: formData.phone,
        wedding_date: formData.wedding_date,
        venue_location: formData.venue_location,
        platform: formData.platform || 'Manual Entry',
        lead_score: generateLeadScore(formData),
        status: 'new',
        last_contact: 'Never',
        estimated_loan_amount: parseInt(formData.estimated_loan_amount.replace(/\D/g, '')) || 0,
        priority: formData.priority,
        created_at: new Date().toISOString().split('T')[0],
        loan_officer: 'Current User'
      }

      setLeads(prev => [newLead, ...prev])
      setIsAddLeadModalOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error adding lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white font-header">
            Lead Management
          </h1>
          <p className="text-warm-gray-600 dark:text-gray-400 mt-1 font-body">
            Track and manage your wedding leads across all platforms
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Button variant="outline-primary" leftIcon={<FunnelIcon className="w-4 h-4" />}>
            Export
          </Button>
          <Button 
            variant="primary" 
            leftIcon={<PlusIcon className="w-4 h-4" />}
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            Add Manual Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                variant="search"
                placeholder="Search couples, email, or location..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Platform Filter */}
            <div>
              <select
                value={filters.platform}
                onChange={(e) => handleFilterChange('platform', e.target.value)}
                className="input-base"
              >
                <option value="">All Platforms</option>
                <option value="The Knot">The Knot</option>
                <option value="Zola">Zola</option>
                <option value="WeddingWire">WeddingWire</option>
                <option value="Joy">Joy</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-base"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="application">Application</option>
                <option value="approved">Approved</option>
                <option value="closed">Closed</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Lead Score Filter */}
            <div>
              <select
                value={filters.leadScore}
                onChange={(e) => handleFilterChange('leadScore', e.target.value)}
                className="input-base"
              >
                <option value="">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (60-79)</option>
                <option value="low">Low (&lt;60)</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-base"
              >
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <Card variant="bordered">
          <CardBody className="py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-navy-900 dark:text-white">
                {selectedRows.length} lead{selectedRows.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <Button variant="outline-primary" size="sm">
                  Send Email
                </Button>
                <Button variant="outline-secondary" size="sm">
                  Update Status
                </Button>
                <Button variant="outline-primary" size="sm">
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Data Table */}
      <Card padding="none">
        <Table
          columns={columns}
          data={paginatedLeads}
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onRowClick={handleRowClick}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredLeads.length,
            onChange: setCurrentPage
          }}
        />
      </Card>

      {/* Add Manual Lead Modal */}
      <Modal 
        isOpen={isAddLeadModalOpen} 
        onClose={() => {
          setIsAddLeadModalOpen(false)
          resetForm()
        }}
        size="lg"
      >
        <ModalHeader
          title="Add Manual Lead"
          subtitle="Enter lead information for manual follow-up"
          onClose={() => {
            setIsAddLeadModalOpen(false)
            resetForm()
          }}
        />
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Couple Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4 font-header">
                <HeartIcon className="w-5 h-5 inline mr-2 text-rose-gold-600" />
                Couple Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Partner 1 Name"
                  placeholder="First partner's name"
                  value={formData.partner1_name}
                  onChange={(e) => handleFormChange('partner1_name', e.target.value)}
                  required
                />
                <Input
                  label="Partner 2 Name"
                  placeholder="Second partner's name"
                  value={formData.partner2_name}
                  onChange={(e) => handleFormChange('partner2_name', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4 font-header">
                <EnvelopeIcon className="w-5 h-5 inline mr-2 text-navy-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="couple@email.com"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                    Contact Preference
                  </label>
                  <select
                    value={formData.contact_preference}
                    onChange={(e) => handleFormChange('contact_preference', e.target.value)}
                    className="input-base"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                    <option value="both">Email & Phone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                    className="input-base"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Wedding Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4 font-header">
                <CalendarDaysIcon className="w-5 h-5 inline mr-2 text-rose-gold-600" />
                Wedding Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Wedding Date"
                  type="date"
                  value={formData.wedding_date}
                  onChange={(e) => handleFormChange('wedding_date', e.target.value)}
                />
                <Input
                  label="Venue/Location"
                  placeholder="City, State or Venue Name"
                  value={formData.venue_location}
                  onChange={(e) => handleFormChange('venue_location', e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                  Source Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleFormChange('platform', e.target.value)}
                  className="input-base"
                >
                  <option value="">Select Platform</option>
                  <option value="The Knot">The Knot</option>
                  <option value="Zola">Zola</option>
                  <option value="WeddingWire">WeddingWire</option>
                  <option value="Joy">Joy</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Financial Information */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4 font-header">
                <BanknotesIcon className="w-5 h-5 inline mr-2 text-forest-600" />
                Financial Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Estimated Loan Amount"
                  placeholder="$500,000"
                  value={formData.estimated_loan_amount}
                  onChange={(e) => handleFormChange('estimated_loan_amount', e.target.value)}
                />
                <Input
                  label="Combined Annual Income"
                  placeholder="$120,000"
                  value={formData.combined_income}
                  onChange={(e) => handleFormChange('combined_income', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                    Credit Score Range
                  </label>
                  <select
                    value={formData.credit_score_range}
                    onChange={(e) => handleFormChange('credit_score_range', e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select Range</option>
                    <option value="800+">800+ (Excellent)</option>
                    <option value="750-799">750-799 (Very Good)</option>
                    <option value="700-749">700-749 (Good)</option>
                    <option value="650-699">650-699 (Fair)</option>
                    <option value="600-649">600-649 (Poor)</option>
                    <option value="<600">Below 600</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                    Loan Type Preference
                  </label>
                  <select
                    value={formData.loan_type_preference}
                    onChange={(e) => handleFormChange('loan_type_preference', e.target.value)}
                    className="input-base"
                  >
                    <option value="">Select Type</option>
                    <option value="Conventional">Conventional</option>
                    <option value="FHA">FHA</option>
                    <option value="VA">VA</option>
                    <option value="USDA">USDA</option>
                    <option value="Jumbo">Jumbo</option>
                    <option value="First-time Buyer">First-time Buyer Program</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline & Notes */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4 font-header">
                <MapPinIcon className="w-5 h-5 inline mr-2 text-sage-600" />
                Purchase Timeline & Notes
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                  Home Purchase Timeline
                </label>
                <select
                  value={formData.home_purchase_timeline}
                  onChange={(e) => handleFormChange('home_purchase_timeline', e.target.value)}
                  className="input-base"
                >
                  <option value="">Select Timeline</option>
                  <option value="Immediate">Immediate (Ready to buy now)</option>
                  <option value="Within 6 months">Within 6 months</option>
                  <option value="Within 1 year">Within 1 year</option>
                  <option value="After wedding">After wedding</option>
                  <option value="1-2 years">1-2 years from now</option>
                  <option value="Just exploring">Just exploring options</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-gray-700 dark:text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleFormChange('notes', e.target.value)}
                  placeholder="Any additional information about this lead..."
                  rows={4}
                  className="w-full px-3 py-2 border border-warm-gray-300 dark:border-gray-600 rounded-wedding shadow-sm placeholder-warm-gray-400 focus:outline-none focus:border-navy-500 focus:ring-navy-500 transition-colors duration-200 text-warm-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => {
              setIsAddLeadModalOpen(false)
              resetForm()
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Adding Lead...' : 'Add Lead'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}