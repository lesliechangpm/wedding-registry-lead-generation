import React from 'react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: string
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'blue' | 'green' | 'pink' | 'yellow' | 'emerald' | 'purple' | 'indigo'
}

const colorClasses = {
  blue: 'bg-blue-50',
  green: 'bg-green-50', 
  pink: 'bg-pink-50',
  yellow: 'bg-yellow-50',
  emerald: 'bg-emerald-50',
  purple: 'bg-purple-50',
  indigo: 'bg-indigo-50'
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  color = "blue" 
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center mr-4`}>
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