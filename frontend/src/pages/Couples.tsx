import React, { useState } from 'react'
import {
  HeartIcon,
  EyeIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
  FunnelIcon,
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Button, Input, Badge, LoadingSpinner } from '../components/ui'
import { clsx } from 'clsx'

interface Couple {
  id: string
  partner_1_name: string
  partner_2_name: string
  partner_1_email?: string
  partner_2_email?: string
  wedding_date?: string
  wedding_stage: 'engaged' | 'planning' | 'recently_married'
  wedding_city?: string
  wedding_state?: string
  wedding_budget?: number
  source_platform?: string
  created_at: string
  venue_name?: string
  guest_count?: number
  home_purchase_timeline?: string
  credit_score_range?: string
  combined_income?: number
}

const mockCouples: Couple[] = [
  {
    id: '1',
    partner_1_name: 'Sarah',
    partner_2_name: 'Mike Johnson',
    partner_1_email: 'sarah@email.com',
    partner_2_email: 'mike@email.com',
    wedding_date: '2024-06-15',
    wedding_stage: 'planning',
    wedding_city: 'Napa',
    wedding_state: 'CA',
    wedding_budget: 45000,
    source_platform: 'The Knot',
    created_at: '2024-01-10',
    venue_name: 'Silverado Resort',
    guest_count: 120,
    home_purchase_timeline: 'Within 6 months',
    credit_score_range: '750-800',
    combined_income: 145000
  },
  {
    id: '2',
    partner_1_name: 'Emma',
    partner_2_name: 'David Wilson',
    partner_1_email: 'emma.wilson@email.com',
    partner_2_email: 'david.wilson@email.com',
    wedding_date: '2024-08-22',
    wedding_stage: 'engaged',
    wedding_city: 'Austin',
    wedding_state: 'TX',
    wedding_budget: 35000,
    source_platform: 'Zola',
    created_at: '2024-01-08',
    venue_name: 'The Allan House',
    guest_count: 85,
    home_purchase_timeline: 'After wedding',
    credit_score_range: '700-749',
    combined_income: 98000
  },
  {
    id: '3',
    partner_1_name: 'Lisa',
    partner_2_name: 'Tom Chen',
    partner_1_email: 'lisa.chen@email.com',
    partner_2_email: 'tom.chen@email.com',
    wedding_date: '2024-05-18',
    wedding_stage: 'recently_married',
    wedding_city: 'Seattle',
    wedding_state: 'WA',
    wedding_budget: 55000,
    source_platform: 'WeddingWire',
    created_at: '2024-01-14',
    venue_name: 'Fairmont Olympic Hotel',
    guest_count: 150,
    home_purchase_timeline: 'Immediate',
    credit_score_range: '800+',
    combined_income: 185000
  },
  {
    id: '4',
    partner_1_name: 'Maria',
    partner_2_name: 'Carlos Santos',
    partner_1_email: 'maria.santos@email.com',
    partner_2_email: 'carlos.santos@email.com',
    wedding_date: '2024-09-10',
    wedding_stage: 'planning',
    wedding_city: 'Miami',
    wedding_state: 'FL',
    wedding_budget: 40000,
    source_platform: 'Joy',
    created_at: '2024-01-05',
    venue_name: 'Vizcaya Museum',
    guest_count: 100,
    home_purchase_timeline: 'Within 1 year',
    credit_score_range: '650-699',
    combined_income: 125000
  }
]

export default function Couples() {
  const [couples, setCouples] = useState<Couple[]>(mockCouples)
  const [filters, setFilters] = useState({
    wedding_stage: '',
    city: '',
    state: '',
    search: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Filter couples based on current filters
  const filteredCouples = couples.filter(couple => {
    const matchesSearch = !filters.search || 
      couple.partner_1_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      couple.partner_2_name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (couple.wedding_city && couple.wedding_city.toLowerCase().includes(filters.search.toLowerCase())) ||
      (couple.venue_name && couple.venue_name.toLowerCase().includes(filters.search.toLowerCase()))
    
    const matchesStage = !filters.wedding_stage || couple.wedding_stage === filters.wedding_stage
    const matchesCity = !filters.city || (couple.wedding_city && couple.wedding_city.toLowerCase().includes(filters.city.toLowerCase()))
    const matchesState = !filters.state || (couple.wedding_state && couple.wedding_state.toLowerCase().includes(filters.state.toLowerCase()))

    return matchesSearch && matchesStage && matchesCity && matchesState
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const getStageConfig = (stage: string) => {
    const configs = {
      engaged: { 
        variant: 'secondary' as const, 
        text: 'Engaged',
        icon: HeartIcon,
        bgColor: 'bg-rose-gold-50',
        textColor: 'text-rose-gold-800',
        iconColor: 'text-rose-gold-600'
      },
      planning: { 
        variant: 'primary' as const, 
        text: 'Planning',
        icon: CalendarDaysIcon,
        bgColor: 'bg-navy-50',
        textColor: 'text-navy-800',
        iconColor: 'text-navy-600'
      },
      recently_married: { 
        variant: 'success' as const, 
        text: 'Recently Married',
        icon: UserGroupIcon,
        bgColor: 'bg-forest-50',
        textColor: 'text-forest-800',
        iconColor: 'text-forest-600'
      }
    }
    return configs[stage as keyof typeof configs] || configs.engaged
  }

  const getTimelineConfig = (timeline: string) => {
    const configs = {
      'Immediate': { variant: 'danger' as const, priority: 'urgent' as const },
      'Within 6 months': { variant: 'warning' as const, priority: 'high' as const },
      'Within 1 year': { variant: 'accent' as const, priority: 'medium' as const },
      'After wedding': { variant: 'neutral' as const, priority: 'low' as const }
    }
    return configs[timeline as keyof typeof configs] || configs['After wedding']
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white font-header">
            Couples Management
          </h1>
          <p className="text-warm-gray-600 dark:text-gray-400 mt-1 font-body">
            Track and manage {filteredCouples.length} couples across their wedding journey
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Button variant="outline-primary" leftIcon={<FunnelIcon className="w-4 h-4" />}>
            Import Data
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
            Add Couple
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <Input
                variant="search"
                placeholder="Search couples, venues, cities..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Wedding Stage Filter */}
            <div>
              <select
                value={filters.wedding_stage}
                onChange={(e) => handleFilterChange('wedding_stage', e.target.value)}
                className="input-base"
              >
                <option value="">All Stages</option>
                <option value="engaged">Engaged</option>
                <option value="planning">Planning</option>
                <option value="recently_married">Recently Married</option>
              </select>
            </div>

            {/* City Filter */}
            <div>
              <Input
                placeholder="City"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              />
            </div>

            {/* State Filter */}
            <div>
              <Input
                placeholder="State"
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
              />
            </div>

            {/* Clear Filters */}
            <div>
              <Button 
                variant="ghost"
                fullWidth
                onClick={() => setFilters({ wedding_stage: '', city: '', state: '', search: '' })}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Couples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCouples.map((couple) => {
          const stageConfig = getStageConfig(couple.wedding_stage)
          const timelineConfig = couple.home_purchase_timeline ? getTimelineConfig(couple.home_purchase_timeline) : null

          return (
            <Card key={couple.id} hover className="transition-all duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={clsx('w-12 h-12 rounded-wedding-lg flex items-center justify-center', stageConfig.bgColor)}>
                    <HeartIcon className={clsx('w-6 h-6', stageConfig.iconColor)} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white font-header">
                      {couple.partner_1_name} & {couple.partner_2_name}
                    </h3>
                    <Badge variant={stageConfig.variant} size="sm">
                      {stageConfig.text}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <EyeIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Wedding Details */}
              <div className="space-y-3 mb-4">
                {couple.wedding_date && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="w-4 h-4 text-warm-gray-400" />
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Wedding Date</span>
                    </div>
                    <span className="text-sm font-medium text-navy-900 dark:text-white">
                      {new Date(couple.wedding_date).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {couple.venue_name && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="w-4 h-4 text-warm-gray-400" />
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Venue</span>
                    </div>
                    <span className="text-sm text-navy-900 dark:text-white">
                      {couple.venue_name}
                    </span>
                  </div>
                )}

                {couple.wedding_city && couple.wedding_state && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-warm-gray-600 dark:text-gray-400">Location</span>
                    <span className="text-sm text-navy-900 dark:text-white">
                      {couple.wedding_city}, {couple.wedding_state}
                    </span>
                  </div>
                )}

                {couple.guest_count && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserGroupIcon className="w-4 h-4 text-warm-gray-400" />
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Guests</span>
                    </div>
                    <span className="text-sm text-navy-900 dark:text-white">
                      {couple.guest_count}
                    </span>
                  </div>
                )}

                {couple.wedding_budget && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BanknotesIcon className="w-4 h-4 text-warm-gray-400" />
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Budget</span>
                    </div>
                    <span className="text-sm font-medium text-navy-900 dark:text-white">
                      ${couple.wedding_budget.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Home Purchase Info */}
              {(couple.home_purchase_timeline || couple.combined_income || couple.credit_score_range) && (
                <div className="border-t border-warm-gray-200 dark:border-gray-600 pt-4 mb-4">
                  <h4 className="text-sm font-semibold text-navy-900 dark:text-white mb-3">Home Purchase Profile</h4>
                  
                  {couple.home_purchase_timeline && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Timeline</span>
                      <Badge variant={timelineConfig?.variant} size="sm">
                        {couple.home_purchase_timeline}
                      </Badge>
                    </div>
                  )}

                  {couple.combined_income && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Combined Income</span>
                      <span className="text-sm font-medium text-navy-900 dark:text-white">
                        ${couple.combined_income.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {couple.credit_score_range && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Credit Score</span>
                      <span className="text-sm font-medium text-navy-900 dark:text-white">
                        {couple.credit_score_range}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Info */}
              <div className="border-t border-warm-gray-200 dark:border-gray-600 pt-4 mb-4">
                <div className="space-y-1">
                  {couple.partner_1_email && (
                    <p className="text-xs text-warm-gray-500 dark:text-gray-400 truncate">
                      {couple.partner_1_email}
                    </p>
                  )}
                  {couple.partner_2_email && (
                    <p className="text-xs text-warm-gray-500 dark:text-gray-400 truncate">
                      {couple.partner_2_email}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm">
                      {couple.source_platform}
                    </Badge>
                    <span className="text-xs text-warm-gray-400">
                      Added {new Date(couple.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="primary" size="sm" fullWidth>
                  Create Lead
                </Button>
                <Button variant="outline-primary" size="sm">
                  <EnvelopeIcon className="w-4 h-4" />
                </Button>
                <Button variant="outline-primary" size="sm">
                  <PhoneIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCouples.length === 0 && (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-rose-gold-100 rounded-full flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-rose-gold-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white font-header">
                No couples found
              </h3>
              <p className="text-warm-gray-600 dark:text-gray-400 mt-1">
                Try adjusting your filters or import new couples data to get started.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
                Add Couple
              </Button>
              <Button variant="outline-primary">
                Import Data
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}