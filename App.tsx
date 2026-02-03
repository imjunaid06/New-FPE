
import React, { useState, useEffect, useMemo } from 'react';
// Fix: Import missing ShieldCheck icon from lucide-react
import { ShieldCheck } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TicketManager from './components/TicketManager';
import TeamManager from './components/TeamManager';
import ClientManager from './components/ClientManager';
import SettingsPage from './components/SettingsPage';
import ChatTroubleshooter from './components/ChatTroubleshooter';
import { Ticket, Client, TeamMember, TicketStatus, TicketPriority, SystemSettings } from './types';

const INITIAL_CLIENTS: Client[] = [
  { id: 'c1', name: 'John Miller', company: 'CyberDyne Systems', email: 'john@cyberdyne.com', createdAt: new Date().toISOString() },
  { id: 'c2', name: 'Sarah Connor', company: 'Resistance IT', email: 'sarah@resistance.org', createdAt: new Date().toISOString() },
];

const INITIAL_TEAM: TeamMember[] = [
  { id: 't1', name: 'Alex Rivera', role: 'Admin', email: 'alex@nexus.io', status: 'active' },
  { id: 't2', name: 'Jordan Lee', role: 'Senior Agent', email: 'jordan@nexus.io', status: 'active' },
];

const INITIAL_SETTINGS: SystemSettings = {
  appName: 'Nexus',
  organizationName: 'Nexus Global',
  supportEmail: 'support@nexus.io',
  aiModel: 'gemini-3-flash-preview',
  autoCategorization: true,
  defaultPriority: TicketPriority.MEDIUM,
  retentionDays: 90
};

const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tk1',
    title: 'Server downtime in US-EAST-1',
    description: 'Production cluster is unresponsive. Critical latency spikes detected.',
    clientId: 'c1',
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    category: 'Infrastructure',
    createdAt: new Date().toISOString(),
    aiAnalysis: 'Urgent system outage requires immediate DevOps intervention.'
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  // Detect Client Portal Session - This is the UNIQUE LINK logic
  const currentClientId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('clientId');
  }, []);

  const userRole = currentClientId ? 'client' : 'admin';
  const activeClient = useMemo(() => clients.find(c => c.id === currentClientId), [clients, currentClientId]);

  // Scoped Data - CRITICAL: Client can NEVER see other client tickets
  const scopedTickets = useMemo(() => {
    if (userRole === 'admin') return tickets;
    return tickets.filter(t => t.clientId === currentClientId);
  }, [tickets, userRole, currentClientId]);

  // Persistence
  useEffect(() => {
    const savedTickets = localStorage.getItem('nexus_tickets');
    const savedClients = localStorage.getItem('nexus_clients');
    const savedTeam = localStorage.getItem('nexus_team');
    const savedSettings = localStorage.getItem('nexus_settings');

    if (savedTickets) setTickets(JSON.parse(savedTickets));
    if (savedClients) setClients(JSON.parse(savedClients));
    if (savedTeam) setTeam(JSON.parse(savedTeam));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, []);

  const saveState = (tk: Ticket[], cl: Client[], tm: TeamMember[], st: SystemSettings) => {
    localStorage.setItem('nexus_tickets', JSON.stringify(tk));
    localStorage.setItem('nexus_clients', JSON.stringify(cl));
    localStorage.setItem('nexus_team', JSON.stringify(tm));
    localStorage.setItem('nexus_settings', JSON.stringify(st));
  };

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newTicket = { ...ticket, id: `tk-${Date.now()}`, createdAt: new Date().toISOString() };
    const nextTickets = [newTicket, ...tickets];
    setTickets(nextTickets);
    saveState(nextTickets, clients, team, settings);
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    const nextTickets = tickets.map(t => t.id === id ? { ...t, status } : t);
    setTickets(nextTickets);
    saveState(nextTickets, clients, team, settings);
  };

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient = { ...client, id: `c-${Date.now()}`, createdAt: new Date().toISOString() };
    const nextClients = [...clients, newClient];
    setClients(nextClients);
    saveState(tickets, nextClients, team, settings);
  };

  const removeClient = (id: string) => {
    const nextClients = clients.filter(c => c.id !== id);
    setClients(nextClients);
    saveState(tickets, nextClients, team, settings);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = { ...member, id: `t-${Date.now()}` };
    const nextTeam = [...team, newMember];
    setTeam(nextTeam);
    saveState(tickets, clients, nextTeam, settings);
  };

  const removeTeamMember = (id: string) => {
    const nextTeam = team.filter(t => t.id !== id);
    setTeam(nextTeam);
    saveState(tickets, clients, nextTeam, settings);
  };

  const updateSettings = (nextSettings: SystemSettings) => {
    setSettings(nextSettings);
    saveState(tickets, clients, team, nextSettings);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard tickets={scopedTickets} clients={userRole === 'admin' ? clients : []} teamCount={team.length} userRole={userRole} />;
      case 'tickets':
        return <TicketManager 
          tickets={scopedTickets} 
          clients={userRole === 'admin' ? clients : [activeClient!].filter(Boolean)} 
          onAddTicket={addTicket} 
          onUpdateStatus={updateTicketStatus} 
          userRole={userRole}
          currentClientId={currentClientId || undefined}
        />;
      case 'troubleshoot':
        return <ChatTroubleshooter />;
      case 'team':
        if (userRole === 'client') return null;
        return <TeamManager members={team} onAddMember={addTeamMember} onRemoveMember={removeTeamMember} />;
      case 'clients':
        if (userRole === 'client') return null;
        return <ClientManager clients={clients} onAddClient={addClient} onRemoveClient={removeClient} />;
      case 'settings':
        if (userRole === 'client') return null;
        return <SettingsPage settings={settings} onUpdateSettings={updateSettings} />;
      default:
        return <Dashboard tickets={scopedTickets} clients={userRole === 'admin' ? clients : []} teamCount={team.length} userRole={userRole} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        appName={settings.appName} 
        userRole={userRole}
      />
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">
              {userRole === 'admin' ? settings.organizationName : `${activeClient?.company} Enterprise Portal`}
            </p>
            <h1 className="text-3xl font-black text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center space-x-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">
                {userRole === 'admin' ? 'System Administrator' : activeClient?.name}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {userRole === 'admin' ? 'Nexus Global Console' : 'Premium Account Manager'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl border-2 border-white shadow-lg flex items-center justify-center font-black text-lg ${
              userRole === 'admin' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white'
            }`}>
              {userRole === 'admin' ? 'AD' : activeClient?.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
          {activeClient === undefined && userRole === 'client' ? (
            <div className="bg-white border border-slate-200 p-16 rounded-[2rem] text-center shadow-xl shadow-slate-200/50 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Denied</h2>
              <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">The individual portal link you used is invalid, inactive, or has been revoked. Please reach out to your account manager for a new secure access link.</p>
              <button 
                onClick={() => window.location.href = window.location.pathname}
                className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Return to Admin Login
              </button>
            </div>
          ) : renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
