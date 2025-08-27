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
import { Card, CardHeader, CardBody, Button, Input, Badge, StatusBadge, PriorityBadge } from '../components/ui'
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
          <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
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
    </div>
  )
}