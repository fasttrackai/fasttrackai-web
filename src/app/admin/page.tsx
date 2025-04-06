'use client';

import { useState } from 'react';
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  MessageSquare,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

interface Metric {
  name: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
}

export default function AdminDashboard() {
  const metrics: Metric[] = [
    {
      name: 'Total Leads',
      value: '245',
      change: 12,
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Scheduled Calls',
      value: '32',
      change: 8,
      changeType: 'increase',
      icon: Calendar,
    },
    {
      name: 'Conversion Rate',
      value: '18.5%',
      change: 2.3,
      changeType: 'decrease',
      icon: TrendingUp,
    },
    {
      name: 'Avg. Response Time',
      value: '2.4h',
      change: 15,
      changeType: 'decrease',
      icon: Clock,
    },
  ];

  const recentActivity: Activity[] = [
    {
      id: '1',
      type: 'New Lead',
      description: 'Tech startup (50-100 employees) interested in AI integration',
      time: '5 minutes ago',
    },
    {
      id: '2',
      type: 'Consultation Scheduled',
      description: 'Manufacturing company booked a call for tomorrow',
      time: '1 hour ago',
    },
    {
      id: '3',
      type: 'Chat Completed',
      description: 'Healthcare provider completed qualification questionnaire',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex space-x-4">
          <select className="border rounded-lg px-4 py-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.name} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm">{metric.name}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {metric.changeType === 'increase' ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={`text-sm ml-1 ${
                    metric.changeType === 'increase'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {metric.change}%
                </span>
                <span className="text-gray-500 text-sm ml-2">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{activity.type}</h3>
                  <p className="text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <ArrowUpRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <MessageSquare className="h-6 w-6 text-blue-600 mb-4" />
          <h3 className="font-medium">View Chat Logs</h3>
          <p className="text-gray-500 text-sm mt-1">
            Review recent customer interactions
          </p>
        </button>
        <button className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Calendar className="h-6 w-6 text-blue-600 mb-4" />
          <h3 className="font-medium">Manage Schedule</h3>
          <p className="text-gray-500 text-sm mt-1">
            Update consultation availability
          </p>
        </button>
        <button className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <Users className="h-6 w-6 text-blue-600 mb-4" />
          <h3 className="font-medium">Lead Management</h3>
          <p className="text-gray-500 text-sm mt-1">
            View and update lead statuses
          </p>
        </button>
      </div>
    </div>
  );
} 