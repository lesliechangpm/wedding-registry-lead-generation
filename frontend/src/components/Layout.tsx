import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HomeIcon,
  UserGroupIcon,
  HeartIcon,
  MegaphoneIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline'
import { DarkModeToggle } from './DarkModeToggle'

interface LayoutProps {
  children: ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Leads', href: '/leads', icon: UserGroupIcon },
  { name: 'Couples', href: '/couples', icon: HeartIcon },
  { name: 'Campaigns', href: '/campaigns', icon: MegaphoneIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-warm-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 overflow-y-auto shadow-wedding-lg">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="w-8 h-8 bg-rose-gold-100 rounded-wedding flex items-center justify-center">
              <HeartIcon className="h-5 w-5 text-rose-gold-600" />
            </div>
            <span className="ml-2 text-xl font-bold text-navy-900 dark:text-white font-header">
              VowCRM
            </span>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? 'bg-navy-100 text-navy-900 dark:bg-navy-900 dark:text-navy-100'
                        : 'text-warm-gray-600 hover:bg-warm-gray-50 hover:text-navy-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'group flex items-center px-3 py-2.5 text-sm font-medium rounded-wedding transition-all duration-200'
                    )}
                  >
                    <item.icon
                      className={classNames(
                        isActive ? 'text-navy-600' : 'text-warm-gray-400 group-hover:text-navy-500',
                        'mr-3 flex-shrink-0 h-5 w-5'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          
          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-warm-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-navy-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">JS</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-navy-900 dark:text-white font-body">John Smith</p>
                <p className="text-xs text-warm-gray-500 dark:text-gray-400">Senior Loan Officer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow-wedding border-b border-warm-gray-200 dark:border-gray-700">
          <div className="flex-1 px-6 flex justify-between items-center">
            <div className="flex-1 flex">
              <h1 className="text-lg font-semibold text-navy-900 dark:text-white font-header">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <DarkModeToggle />
              <button className="bg-white dark:bg-gray-700 p-2 rounded-wedding text-warm-gray-400 hover:text-navy-600 dark:text-gray-300 dark:hover:text-gray-200 transition-colors">
                <span className="sr-only">View notifications</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-warm-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}