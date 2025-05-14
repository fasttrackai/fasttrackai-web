'use client';

import { useState, useEffect } from 'react';
import { getLeads, updateLeadStatus } from '@/lib/firebase/firebaseUtils';
import { LeadData } from '@/lib/types/leads';

type Lead = LeadData & { id: string };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Fetch leads when component mounts or filter changes
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const leadData = await getLeads(statusFilter);
        setLeads(leadData as Lead[]);
        setError(null);
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Failed to load leads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [statusFilter]);

  // Handle updating lead status
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      
      // Update local state
      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus as LeadData['status'], updatedAt: new Date().toISOString() } 
          : lead
      ));
      
      // Update selected lead if it's the one being changed
      if (selectedLead?.id === leadId) {
        setSelectedLead({
          ...selectedLead,
          status: newStatus as LeadData['status'],
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('Failed to update lead status. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ChatBot Leads</h1>
      
      {/* Filter controls */}
      <div className="mb-6">
        <label className="font-medium mr-2">Filter by status:</label>
        <select 
          value={statusFilter || ''} 
          onChange={(e) => setStatusFilter(e.target.value || undefined)}
          className="border rounded px-3 py-2"
        >
          <option value="">All leads</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-700"></div>
          <p className="mt-2">Loading leads...</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Leads table */}
          <div className="md:w-1/2 overflow-x-auto">
            {leads.length === 0 ? (
              <p className="text-gray-500 text-center py-10">No leads found.</p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border text-left">Date</th>
                    <th className="py-2 px-4 border text-left">Method</th>
                    <th className="py-2 px-4 border text-left">Status</th>
                    <th className="py-2 px-4 border text-left">Messages</th>
                    <th className="py-2 px-4 border text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedLead?.id === lead.id ? 'bg-purple-50' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="py-2 px-4 border">{formatDate(lead.timestamp)}</td>
                      <td className="py-2 px-4 border">{lead.contactMethod}</td>
                      <td className="py-2 px-4 border">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : ''}
                          ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${lead.status === 'qualified' ? 'bg-green-100 text-green-800' : ''}
                          ${lead.status === 'converted' ? 'bg-purple-100 text-purple-800' : ''}
                          ${lead.status === 'archived' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {lead.status || 'new'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">{lead.messageCount}</td>
                      <td className="py-2 px-4 border">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                          }}
                          className="text-purple-600 hover:text-purple-800 mr-2"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Lead details panel */}
          <div className="md:w-1/2">
            {selectedLead ? (
              <div className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Lead Details</h2>
                  <select
                    value={selectedLead.status || 'new'}
                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                    className="border rounded px-3 py-1"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p>{formatDate(selectedLead.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Method</p>
                    <p className="capitalize">{selectedLead.contactMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Duration</p>
                    <p>{Math.floor(selectedLead.interactionDuration / 60)} min {selectedLead.interactionDuration % 60} sec</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Page</p>
                    <p>{selectedLead.pagePath || 'Not recorded'}</p>
                  </div>
                </div>
                
                {Object.keys(selectedLead.assessmentAnswers).length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-2">Assessment Answers</h3>
                    <div className="bg-gray-50 p-4 rounded">
                      {Object.entries(selectedLead.assessmentAnswers).map(([questionId, answer]) => (
                        <div key={questionId} className="mb-3">
                          <p className="font-medium text-sm">{questionId}</p>
                          <p className="ml-4">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold mb-2">Conversation</h3>
                  <div className="bg-gray-50 p-4 rounded overflow-auto max-h-96 whitespace-pre-line">
                    {selectedLead.conversationHistory}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-6 bg-gray-50 flex items-center justify-center h-full">
                <p className="text-gray-500">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 