
import React, { useState } from 'react';
import { Plus, Search, Filter, Cpu, User, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import { Ticket, TicketStatus, TicketPriority, Client } from '../types';
import { analyzeIncident } from '../services/geminiService';

interface TicketManagerProps {
  tickets: Ticket[];
  clients: Client[];
  onAddTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: TicketStatus) => void;
  userRole: 'admin' | 'client';
  currentClientId?: string;
}

const TicketManager: React.FC<TicketManagerProps> = ({ tickets, clients, onAddTicket, onUpdateStatus, userRole, currentClientId }) => {
  const [showForm, setShowForm] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [search, setSearch] = useState('');
  
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    clientId: currentClientId || '',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    category: 'General',
    aiAnalysis: ''
  });

  const getClientName = (id: string) => clients.find(c => c.id === id)?.company || 'Unknown Client';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClientId = userRole === 'client' ? currentClientId : newTicket.clientId;
    
    if (newTicket.title && targetClientId) {
      setIsAnalyzing(true);
      const analysis = await analyzeIncident(newTicket.title, newTicket.description);
      
      onAddTicket({
        ...newTicket,
        clientId: targetClientId,
        priority: analysis.priority,
        category: analysis.category,
        aiAnalysis: analysis.summary
      });

      setNewTicket({
        title: '',
        description: '',
        clientId: currentClientId || '',
        status: TicketStatus.OPEN,
        priority: TicketPriority.MEDIUM,
        category: 'General',
        aiAnalysis: ''
      });
      setIsAnalyzing(false);
      setShowForm(false);
    }
  };

  const priorityColors = {
    [TicketPriority.LOW]: 'bg-slate-100 text-slate-600 border-slate-200',
    [TicketPriority.MEDIUM]: 'bg-blue-50 text-blue-600 border-blue-100',
    [TicketPriority.HIGH]: 'bg-orange-50 text-orange-600 border-orange-100',
    [TicketPriority.URGENT]: 'bg-red-50 text-red-600 border-red-100',
  };

  const statusColors = {
    [TicketStatus.OPEN]: 'text-blue-600',
    [TicketStatus.IN_PROGRESS]: 'text-amber-600',
    [TicketStatus.RESOLVED]: 'text-emerald-600',
    [TicketStatus.CLOSED]: 'text-slate-500',
  };

  const filteredTickets = tickets.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    (userRole === 'admin' && getClientName(t.clientId).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {userRole === 'admin' ? 'Support Control Center' : 'My Support Tickets'}
          </h2>
          <p className="text-slate-500">
            {userRole === 'admin' ? 'Unified management of all enterprise incidents.' : 'Track and manage your requests here.'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span>New Incident</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={userRole === 'admin' ? "Search all tickets..." : "Search your tickets..."}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-600">
          <Filter size={18} />
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">Log New Incident</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 text-2xl font-light">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {/* Only show client selector for admins */}
              {userRole === 'admin' && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Client Account</label>
                  <select
                    required
                    className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newTicket.clientId}
                    onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                  >
                    <option value="">Select a Client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.company}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="Summarize the core issue..."
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what's happening..."
                  className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex items-center space-x-3 border border-blue-100">
                <Cpu className="text-blue-600" size={20} />
                <p className="text-sm text-blue-800 font-medium">AI analysis will categorize this report automatically.</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 flex items-center space-x-2 shadow-lg shadow-blue-500/20"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Differentiating...</span>
                  </>
                ) : (
                  <span>Submit Ticket</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </div>
                <div className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {ticket.category}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Clock size={14} />
                <span className="text-xs font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{ticket.title}</h3>
            <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">{ticket.description}</p>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {userRole === 'admin' && (
                  <div className="flex items-center space-x-2 text-slate-500">
                    <User size={14} />
                    <span className="text-xs font-semibold">{getClientName(ticket.clientId)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${statusColors[ticket.status].replace('text-', 'bg-')}`}></div>
                  <span className={`text-xs font-bold uppercase ${statusColors[ticket.status]}`}>{ticket.status}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {userRole === 'admin' && ticket.status === TicketStatus.OPEN && (
                  <button
                    onClick={() => onUpdateStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                    className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    Take Ownership
                  </button>
                )}
                {userRole === 'admin' && ticket.status !== TicketStatus.RESOLVED && (
                  <button
                    onClick={() => onUpdateStatus(ticket.id, TicketStatus.RESOLVED)}
                    className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketManager;
