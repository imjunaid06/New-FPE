
import React, { useState } from 'react';
import { UserPlus, Trash2, Building2, ExternalLink, Link, Check, Globe, ShieldCheck } from 'lucide-react';
import { Client } from '../types';

interface ClientManagerProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  onRemoveClient: (id: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ clients, onAddClient, onRemoveClient }) => {
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', company: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email && newClient.company) {
      onAddClient(newClient);
      setNewClient({ name: '', email: '', company: '' });
      setShowForm(false);
    }
  };

  const getPortalUrl = (clientId: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?clientId=${clientId}`;
  };

  const copyPortalLink = (clientId: string) => {
    navigator.clipboard.writeText(getPortalUrl(clientId));
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Enterprise Clients</h2>
          <p className="text-slate-500 text-sm">Create isolated portals for your customers. Each client receives a unique link with zero visibility into other accounts.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all font-semibold shadow-lg shadow-indigo-200"
        >
          <UserPlus size={20} />
          <span>Register New Client</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-indigo-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" size={20} />
            Secure Onboarding
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Contact Person</label>
              <input
                type="text"
                placeholder="e.g. Jane Doe"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Organization Email</label>
              <input
                type="email"
                placeholder="e.g. jane@company.com"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={newClient.company}
                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-bold shadow-lg">Activate Portal</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{client.company}</h3>
                <div className="flex items-center space-x-3 mt-0.5">
                  <span className="text-sm text-slate-500">{client.name}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-xs text-slate-400 font-mono">#{client.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-end mr-4 hidden lg:flex">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Access Link</span>
                <span className="text-xs text-indigo-600 font-mono truncate max-w-[200px]">{getPortalUrl(client.id)}</span>
              </div>
              
              <button
                onClick={() => copyPortalLink(client.id)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 border font-bold text-sm ${
                  copiedId === client.id 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-sm'
                }`}
              >
                {copiedId === client.id ? <Check size={16} /> : <Link size={16} />}
                <span>{copiedId === client.id ? 'URL Copied!' : 'Copy Portal URL'}</span>
              </button>

              <a
                href={getPortalUrl(client.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 rounded-xl transition-all shadow-sm"
                title="Open Client View"
              >
                <Globe size={18} />
              </a>

              <button
                onClick={() => onRemoveClient(client.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Archive Client"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {clients.length === 0 && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
            <Building2 className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-bold text-slate-900">No Enterprise Clients</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-1">Register your first client to generate their private support portal and start managing their tickets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;
