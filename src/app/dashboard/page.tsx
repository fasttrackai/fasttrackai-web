'use client';

import { useState, useEffect } from 'react';
import { BarChart, Users, Calendar, ArrowUpRight } from 'lucide-react';

interface Lead {
  id: string;
  timestamp: string;
  answers: Record<string, string>;
  status: 'New' | 'Contacted' | 'Qualified' | 'Scheduled';
  score: number;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState('all');

  // In a real app, this would fetch from your API/database
  useEffect(() => {
    // Simulated data - replace with actual API call
    const mockLeads: Lead[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        answers: {
          industry_size: 'Technology, 50-100 employees',
          revenue: '$5M-$10M annually',
          data_readiness: 'Yes, using CRM and ERP systems',
          pain_points: 'Customer service automation, data analysis, process optimization',
          current_tech: 'Salesforce, SAP, custom tools',
          timeline_budget: '3-6 months, $100k-$250k budget',
          exit_strategy: 'Yes, actively looking for acquisition opportunities'
        },
        status: 'New',
        score: 85
      },
      // Add more mock leads as needed
    ];
    setLeads(mockLeads);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Lead Management Dashboard</h1>
          <div className="flex space-x-4">
            <select 
              className="border rounded-lg px-4 py-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Leads</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Leads</p>
                <h3 className="text-2xl font-bold">{leads.length}</h3>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Scheduled Consultations</p>
                <h3 className="text-2xl font-bold">
                  {leads.filter(l => l.status === 'Scheduled').length}
                </h3>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Average Lead Score</p>
                <h3 className="text-2xl font-bold">
                  {Math.round(leads.reduce((acc, curr) => acc + curr.score, 0) / leads.length)}%
                </h3>
              </div>
              <BarChart className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{lead.answers.industry_size}</p>
                      <p className="text-sm text-gray-500">{new Date(lead.timestamp).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{lead.score}%</span>
                      <div className="ml-2 w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      View Details
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
} 