import React, { useState } from 'react'
import { Ticket, Calendar, Plus } from 'lucide-react'
import Navbar from '../components/Navbar'
import MyBookings from '../components/dashboard/MyBookings'
import MyEvents from '../components/dashboard/MyEvents'
import CreateEvent from '../components/dashboard/CreateEvent'

const TABS = [
  { id: 'bookings', label: 'My Bookings', icon: Ticket },
  { id: 'events', label: 'My Events', icon: Calendar },
  { id: 'create', label: 'Create Event', icon: Plus },
]

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <MyBookings />
      case 'events':
        return <MyEvents />
      case 'create':
        return <CreateEvent />
      default:
        return <MyBookings />
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Manage your bookings and events
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-800">
          <div className="flex space-x-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-white border-b-2 border-purple-500'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  )
}

export default Dashboard
