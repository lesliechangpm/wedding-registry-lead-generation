import React, { useState } from 'react'
import {
  PlusIcon,
  PlayIcon,
  PauseIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  HeartIcon,
  SparklesIcon,
  MegaphoneIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  BoltIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { Card, CardHeader, CardBody, Button, Input, Badge, LoadingSpinner, Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui'
import { clsx } from 'clsx'

interface Campaign {
  id: string
  name: string
  description: string
  campaign_type: 'wedding_milestone' | 'seasonal' | 'platform_specific' | 'nurture_sequence'
  status: 'draft' | 'active' | 'paused' | 'completed' | 'scheduled'
  target_audience: {
    wedding_stage?: string[]
    platforms?: string[]
    timeline?: string
    budget_range?: string
    location?: string[]
  }
  email_template: {
    id: string
    name: string
    subject: string
    preview_text: string
    performance_rating: number
  }
  schedule: {
    trigger: 'immediate' | 'date' | 'milestone' | 'behavioral'
    send_date?: string
    milestone?: string
    delay_days?: number
  }
  metrics: {
    total_sends: number
    total_opens: number
    total_clicks: number
    total_conversions: number
    revenue_generated: number
    cost_per_lead: number
  }
  created_at: string
  created_by: string
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Welcome New Engaged Couples',
    description: 'Automated welcome sequence for newly engaged couples from The Knot',
    campaign_type: 'wedding_milestone',
    status: 'active',
    target_audience: {
      wedding_stage: ['engaged'],
      platforms: ['The Knot'],
      timeline: 'immediate'
    },
    email_template: {
      id: 'tmpl_001',
      name: 'Engagement Congratulations',
      subject: 'Congratulations on Your Engagement! 💍',
      preview_text: 'Your home buying journey starts here...',
      performance_rating: 4.8
    },
    schedule: {
      trigger: 'milestone',
      milestone: 'engagement_announcement'
    },
    metrics: {
      total_sends: 1247,
      total_opens: 856,
      total_clicks: 234,
      total_conversions: 45,
      revenue_generated: 2250000,
      cost_per_lead: 125
    },
    created_at: '2024-01-15',
    created_by: 'John Smith'
  },
  {
    id: '2',
    name: 'Pre-Wedding Home Buying Guide',
    description: '6-month pre-wedding educational campaign about home buying process',
    campaign_type: 'nurture_sequence',
    status: 'active',
    target_audience: {
      wedding_stage: ['planning'],
      timeline: '6 months before wedding'
    },
    email_template: {
      id: 'tmpl_002',
      name: 'Home Buying Timeline',
      subject: '6 Months to "I Do" - Perfect Time for Pre-Approval!',
      preview_text: 'Plan your dream wedding AND dream home...',
      performance_rating: 4.5
    },
    schedule: {
      trigger: 'date',
      delay_days: 180
    },
    metrics: {
      total_sends: 892,
      total_opens: 623,
      total_clicks: 187,
      total_conversions: 38,
      revenue_generated: 1900000,
      cost_per_lead: 98
    },
    created_at: '2024-01-10',
    created_by: 'John Smith'
  },
  {
    id: '3',
    name: 'Newlywed Home Buyers',
    description: 'Post-wedding campaign targeting recently married couples ready to buy',
    campaign_type: 'wedding_milestone',
    status: 'active',
    target_audience: {
      wedding_stage: ['recently_married'],
      timeline: 'within 3 months'
    },
    email_template: {
      id: 'tmpl_003',
      name: 'From Wedding Gifts to Home Keys',
      subject: 'Ready for Your Next Adventure Together? 🏠',
      preview_text: 'Special programs for newlyweds...',
      performance_rating: 4.9
    },
    schedule: {
      trigger: 'milestone',
      milestone: 'wedding_date',
      delay_days: 30
    },
    metrics: {
      total_sends: 634,
      total_opens: 501,
      total_clicks: 178,
      total_conversions: 52,
      revenue_generated: 2600000,
      cost_per_lead: 87
    },
    created_at: '2024-01-08',
    created_by: 'John Smith'
  },
  {
    id: '4',
    name: 'Spring Wedding Season 2024',
    description: 'Seasonal campaign targeting couples with spring weddings',
    campaign_type: 'seasonal',
    status: 'scheduled',
    target_audience: {
      wedding_stage: ['planning'],
      timeline: 'spring 2024'
    },
    email_template: {
      id: 'tmpl_004',
      name: 'Spring Into Homeownership',
      subject: 'Spring Weddings = Perfect Home Buying Season 🌸',
      preview_text: 'Take advantage of spring market trends...',
      performance_rating: 4.3
    },
    schedule: {
      trigger: 'date',
      send_date: '2024-03-01'
    },
    metrics: {
      total_sends: 0,
      total_opens: 0,
      total_clicks: 0,
      total_conversions: 0,
      revenue_generated: 0,
      cost_per_lead: 0
    },
    created_at: '2024-01-20',
    created_by: 'John Smith'
  },
  {
    id: '5',
    name: 'Zola Registry Home Items',
    description: 'Platform-specific campaign for couples with home goods on Zola registry',
    campaign_type: 'platform_specific',
    status: 'paused',
    target_audience: {
      platforms: ['Zola'],
      wedding_stage: ['engaged', 'planning']
    },
    email_template: {
      id: 'tmpl_005',
      name: 'Registry to Reality',
      subject: 'Turn Your Registry Dreams Into Reality 🏡',
      preview_text: 'We noticed home goods on your registry...',
      performance_rating: 4.1
    },
    schedule: {
      trigger: 'behavioral',
      milestone: 'registry_home_items_added'
    },
    metrics: {
      total_sends: 423,
      total_opens: 289,
      total_clicks: 95,
      total_conversions: 18,
      revenue_generated: 900000,
      cost_per_lead: 145
    },
    created_at: '2024-01-05',
    created_by: 'John Smith'
  }
]

const mockTemplates = [
  {
    id: 'tmpl_001',
    name: 'Engagement Congratulations',
    category: 'Milestone',
    performance_rating: 4.8,
    usage_count: 156,
    conversion_rate: 3.6,
    preview_image: '/templates/engagement-congrats.jpg'
  },
  {
    id: 'tmpl_002',
    name: 'Home Buying Timeline',
    category: 'Educational',
    performance_rating: 4.5,
    usage_count: 134,
    conversion_rate: 4.2,
    preview_image: '/templates/home-timeline.jpg'
  },
  {
    id: 'tmpl_003',
    name: 'From Wedding Gifts to Home Keys',
    category: 'Milestone',
    performance_rating: 4.9,
    usage_count: 189,
    conversion_rate: 8.2,
    preview_image: '/templates/newlywed-home.jpg'
  },
  {
    id: 'tmpl_004',
    name: 'Spring Into Homeownership',
    category: 'Seasonal',
    performance_rating: 4.3,
    usage_count: 87,
    conversion_rate: 3.1,
    preview_image: '/templates/spring-season.jpg'
  },
  {
    id: 'tmpl_005',
    name: 'Registry to Reality',
    category: 'Platform-Specific',
    performance_rating: 4.1,
    usage_count: 65,
    conversion_rate: 4.3,
    preview_image: '/templates/registry-items.jpg'
  },
  {
    id: 'tmpl_006',
    name: 'Holiday Engagement Special',
    category: 'Seasonal',
    performance_rating: 4.6,
    usage_count: 112,
    conversion_rate: 5.1,
    preview_image: '/templates/holiday-engagement.jpg'
  }
]

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState<'active' | 'builder' | 'templates'>('active')
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getStatusConfig = (status: string) => {
    const configs = {
      draft: { variant: 'neutral' as const, icon: PencilIcon, text: 'Draft' },
      active: { variant: 'success' as const, icon: PlayIcon, text: 'Active' },
      paused: { variant: 'warning' as const, icon: PauseIcon, text: 'Paused' },
      completed: { variant: 'primary' as const, icon: ChartBarIcon, text: 'Completed' },
      scheduled: { variant: 'accent' as const, icon: ClockIcon, text: 'Scheduled' }
    }
    return configs[status as keyof typeof configs] || configs.draft
  }

  const getCampaignTypeConfig = (type: string) => {
    const configs = {
      wedding_milestone: { icon: HeartIcon, color: 'text-rose-gold-600', bg: 'bg-rose-gold-50', text: 'Wedding Milestone' },
      seasonal: { icon: SparklesIcon, color: 'text-amber-600', bg: 'bg-amber-50', text: 'Seasonal' },
      platform_specific: { icon: MegaphoneIcon, color: 'text-navy-600', bg: 'bg-navy-50', text: 'Platform Specific' },
      nurture_sequence: { icon: ArrowTrendingUpIcon, color: 'text-sage-600', bg: 'bg-sage-50', text: 'Nurture Sequence' }
    }
    return configs[type as keyof typeof configs] || configs.wedding_milestone
  }

  const calculateMetrics = () => {
    const totalSends = campaigns.reduce((sum, c) => sum + c.metrics.total_sends, 0)
    const totalOpens = campaigns.reduce((sum, c) => sum + c.metrics.total_opens, 0)
    const totalClicks = campaigns.reduce((sum, c) => sum + c.metrics.total_clicks, 0)
    const totalConversions = campaigns.reduce((sum, c) => sum + c.metrics.total_conversions, 0)
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.metrics.revenue_generated, 0)

    return {
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalSends,
      avgOpenRate: totalSends > 0 ? ((totalOpens / totalSends) * 100).toFixed(1) : '0',
      totalConversions,
      totalRevenue
    }
  }

  const metrics = calculateMetrics()

  const tabs = [
    { key: 'active' as const, label: 'Active Campaigns', icon: PlayIcon },
    { key: 'builder' as const, label: 'Campaign Builder', icon: PlusIcon },
    { key: 'templates' as const, label: 'Templates', icon: EnvelopeIcon }
  ]

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
            Campaign Management
          </h1>
          <p className="text-warm-gray-600 dark:text-gray-400 mt-1 font-body">
            Automate wedding-based lead nurturing and conversion campaigns
          </p>
        </div>
        <div className="mt-4 lg:mt-0 flex items-center space-x-3">
          <Button variant="outline-primary" leftIcon={<ChartBarIcon className="w-4 h-4" />}>
            Analytics
          </Button>
          <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />}>
            New Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-forest-600">{metrics.activeCampaigns}</div>
            <div className="text-sm text-warm-gray-600 mt-1">Active Campaigns</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-navy-900">{metrics.totalSends.toLocaleString()}</div>
            <div className="text-sm text-warm-gray-600 mt-1">Total Sends</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-rose-gold-600">{metrics.avgOpenRate}%</div>
            <div className="text-sm text-warm-gray-600 mt-1">Avg Open Rate</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-sage-600">{metrics.totalConversions}</div>
            <div className="text-sm text-warm-gray-600 mt-1">Total Conversions</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <div className="text-3xl font-bold text-amber-600">${(metrics.totalRevenue / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-warm-gray-600 mt-1">Revenue Generated</div>
          </CardBody>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-warm-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.key
                    ? 'border-navy-500 text-navy-600'
                    : 'border-transparent text-warm-gray-500 hover:text-warm-gray-700 hover:border-warm-gray-300'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const statusConfig = getStatusConfig(campaign.status)
              const typeConfig = getCampaignTypeConfig(campaign.campaign_type)
              const StatusIcon = statusConfig.icon
              const TypeIcon = typeConfig.icon

              const openRate = campaign.metrics.total_sends > 0 
                ? ((campaign.metrics.total_opens / campaign.metrics.total_sends) * 100).toFixed(1)
                : '0'
              
              const clickRate = campaign.metrics.total_sends > 0
                ? ((campaign.metrics.total_clicks / campaign.metrics.total_sends) * 100).toFixed(1)
                : '0'

              const conversionRate = campaign.metrics.total_sends > 0
                ? ((campaign.metrics.total_conversions / campaign.metrics.total_sends) * 100).toFixed(1)
                : '0'

              return (
                <Card key={campaign.id} hover className="transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={clsx('w-12 h-12 rounded-wedding-lg flex items-center justify-center', typeConfig.bg)}>
                        <TypeIcon className={clsx('w-6 h-6', typeConfig.color)} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900 dark:text-white font-header">
                          {campaign.name}
                        </h3>
                        <Badge variant={statusConfig.variant} size="sm">
                          {statusConfig.text}
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
                      <Button variant="ghost" size="sm">
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-warm-gray-600 dark:text-gray-400 mb-4">
                    {campaign.description}
                  </p>

                  {/* Campaign Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Type</span>
                      <Badge variant="accent" size="sm">
                        {typeConfig.text}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-warm-gray-600 dark:text-gray-400">Template</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-navy-900 dark:text-white">
                          {campaign.email_template.name}
                        </span>
                        <div className="flex items-center space-x-1">
                          <StarIcon className="w-3 h-3 text-amber-500" />
                          <span className="text-xs text-warm-gray-500">
                            {campaign.email_template.performance_rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {campaign.target_audience.wedding_stage && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-warm-gray-600 dark:text-gray-400">Audience</span>
                        <div className="flex flex-wrap gap-1">
                          {campaign.target_audience.wedding_stage.map((stage) => (
                            <Badge key={stage} variant="primary" size="sm">
                              {stage.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="border-t border-warm-gray-200 dark:border-gray-600 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-navy-900 dark:text-white mb-3">Performance</h4>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-navy-900 dark:text-white">
                          {campaign.metrics.total_sends.toLocaleString()}
                        </div>
                        <div className="text-xs text-warm-gray-500">Sends</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-navy-900 dark:text-white">
                          {openRate}%
                        </div>
                        <div className="text-xs text-warm-gray-500">Open Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-navy-900 dark:text-white">
                          {clickRate}%
                        </div>
                        <div className="text-xs text-warm-gray-500">Click Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-navy-900 dark:text-white">
                          {campaign.metrics.total_conversions}
                        </div>
                        <div className="text-xs text-warm-gray-500">Conversions</div>
                      </div>
                    </div>

                    {campaign.metrics.revenue_generated > 0 && (
                      <div className="mt-3 text-center">
                        <div className="text-sm text-warm-gray-600 dark:text-gray-400">Revenue Generated</div>
                        <div className="text-lg font-bold text-forest-600">
                          ${(campaign.metrics.revenue_generated / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'active' && (
                      <Button variant="warning" size="sm" fullWidth>
                        <PauseIcon className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    {campaign.status === 'paused' && (
                      <Button variant="success" size="sm" fullWidth>
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    {campaign.status === 'draft' && (
                      <Button variant="primary" size="sm" fullWidth>
                        <PlayIcon className="w-4 h-4 mr-2" />
                        Launch
                      </Button>
                    )}
                    {campaign.status === 'scheduled' && (
                      <Button variant="accent" size="sm" fullWidth>
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Scheduled
                      </Button>
                    )}
                    <Button variant="outline-primary" size="sm">
                      <ChartBarIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'builder' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="Campaign Builder" subtitle="Create targeted wedding-based campaigns" />
            <CardBody>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BoltIcon className="w-8 h-8 text-navy-600" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white font-header">
                  Campaign Builder Coming Soon
                </h3>
                <p className="text-warm-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                  Drag-and-drop campaign builder with wedding milestone triggers, A/B testing, and automated sequences.
                </p>
                <div className="mt-6">
                  <Button variant="primary">
                    Request Early Access
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTemplates.map((template) => (
              <Card key={template.id} hover className="transition-all duration-200">
                {/* Template Preview */}
                <div className="h-48 bg-gradient-to-br from-navy-50 to-rose-gold-50 rounded-wedding-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <EnvelopeIcon className="w-12 h-12 text-navy-400 mx-auto mb-2" />
                    <p className="text-sm text-navy-600 font-medium">{template.name}</p>
                  </div>
                </div>

                {/* Template Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-navy-900 dark:text-white font-header">
                      {template.name}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">
                        {template.performance_rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="accent" size="sm">
                      {template.category}
                    </Badge>
                    <span className="text-sm text-warm-gray-500">
                      Used {template.usage_count} times
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-forest-600">
                        {template.conversion_rate}%
                      </div>
                      <div className="text-xs text-warm-gray-500">Conversion Rate</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-navy-900">
                        {template.usage_count}
                      </div>
                      <div className="text-xs text-warm-gray-500">Times Used</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Button variant="primary" size="sm" fullWidth>
                      Use Template
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      <EyeIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="outline-primary" size="sm">
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}