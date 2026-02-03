
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { 
  Ticket, Users, CheckCircle2, AlertCircle, TrendingUp, Clock, 
  Zap, Target, ArrowRight, ShieldCheck, Activity, AlertTriangle
} from 'lucide-react';
import { Ticket as TicketType, TicketStatus, TicketPriority, Client } from '../types';

interface DashboardProps {
  tickets: TicketType[];
  clients: Client[];
  teamCount: number;
  userRole: 'admin' | 'client';
}

const Dashboard: React.FC<DashboardProps> = ({ tickets, clients, teamCount, userRole }) => {
  const openTickets = tickets.filter(t => t.status === TicketStatus.OPEN).length;
  const inProgressTickets = tickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length;
  const resolvedTickets = tickets.filter(t => t.status === TicketStatus.RESOLVED).length;
  const urgentTickets = tickets.filter(t => t.priority === TicketPriority.URGENT && t.status !== TicketStatus.RESOLVED);

  // Global Aggregated Data for Admins
  const clientHealthData = clients.map(client => {
    const clientTickets = tickets.filter(t => t.clientId === client.id);
    return {
      id: client.id,
      name: client.company,
      total: clientTickets.length,
      open: clientTickets.filter(t => t.status === TicketStatus.OPEN).length,
      resolved: clientTickets.filter(t => t.status === TicketStatus.RESOLVED).length,
      urgent: clientTickets.filter(t => t.priority === TicketPriority.URGENT && t.status !== TicketStatus.RESOLVED).length,
    };
  }).sort((a, b) => b.urgent - a.urgent || b.total - a.total);

  const clientIncidentData = clientHealthData.slice(0, 5);

  // Priority Distribution
  const priorityData = [
    { name: 'Urgent', value: tickets.filter(t => t.priority === TicketPriority.URGENT).length, color: '#ef4444' },
    { name: 'High', value: tickets.filter(t => t.priority === TicketPriority.HIGH).length, color: '#f97316' },
    { name: 'Medium', value: tickets.filter(t => t.priority === TicketPriority.MEDIUM).length, color: '#3b82f6' },
    { name: 'Low', value: tickets.filter(t => t.priority === TicketPriority.LOW).length, color: '#94a3b8' },
  ].filter(p => p.value > 0);

  const trendData = [
    { time: '08:00', load: 12 },
    { time: '10:00', load: 45 },
    { time: '12:00', load: 30 },
    { time: '14:00', load: 85 },
    { time: '16:00', load: 40 },
    { time: '18:00', load: 25 },
  ];

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg shadow-current/10 group-hover:scale-110 transition-transform`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-bold">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-slate-500 font-semibold tracking-tight uppercase">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Context */}
      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {userRole === 'admin' ? "Merged Global Operations" : "Client Performance Hub"}
            </h2>
            <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed">
              {userRole === 'admin' 
                ? "Full dashboard access: Unified intelligence across all enterprise clients." 
                : "Secure dashboard for your organization's support lifecycle and metrics."}
            </p>
          </div>
          {userRole === 'admin' && (
            <div className="flex items-center space-x-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Nodes</p>
                <p className="text-xl font-bold text-blue-400">{clients.length} Clients</p>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Team Size</p>
                <p className="text-xl font-bold text-emerald-400">{teamCount} Agents</p>
              </div>
            </div>
          )}
        </div>
        <ShieldCheck className="absolute -right-12 -bottom-12 w-64 h-64 text-slate-800 opacity-30" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ticket} label={userRole === 'admin' ? "Global Tickets" : "Total Requests"} value={tickets.length} color="bg-indigo-600" trend={userRole === 'admin' ? "+12%" : undefined} />
        <StatCard icon={AlertCircle} label="Active Issues" value={openTickets + inProgressTickets} color="bg-orange-500" />
        <StatCard icon={CheckCircle2} label="Resolution Score" value={resolvedTickets} color="bg-emerald-500" />
        <StatCard icon={Clock} label="Avg Resolution" value="1.2h" color="bg-blue-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Client Portfolio or Activity */}
        <div className="xl:col-span-2 space-y-6">
          {userRole === 'admin' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Client Portfolio Health</h3>
                  <p className="text-sm text-slate-500 font-medium">Merged oversight across all active accounts</p>
                </div>
                <Activity className="text-indigo-600" size={20} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Organization</th>
                      <th className="px-6 py-4">Total Load</th>
                      <th className="px-6 py-4">Status Distribution</th>
                      <th className="px-6 py-4">SLA Compliance</th>
                      <th className="px-6 py-4 text-right">Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientHealthData.map(client => (
                      <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{client.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {client.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-slate-600 font-bold">{client.total}</span>
                            <span className="text-xs text-slate-400 uppercase font-black">Tickets</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase ${client.urgent > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                              {client.urgent} Urgent
                            </div>
                            <div className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-orange-100 text-orange-600">
                              {client.open} Open
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-1000 ${client.resolved/client.total > 0.8 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                style={{ width: `${(client.resolved / (client.total || 1)) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-black text-slate-900">{Math.round((client.resolved / (client.total || 1)) * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 bg-slate-100 rounded-xl text-slate-600 hover:bg-indigo-600 hover:text-white transition-all group-hover:scale-110">
                            <ArrowRight size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Volume Distribution Chart */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {userRole === 'admin' ? "Global Volume Distribution" : "Account Activity Stream"}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {userRole === 'admin' ? "Workload analysis across top enterprise nodes" : "Daily incident frequency and response load"}
                </p>
              </div>
            </div>
            <div className="h-80 w-full">
              {userRole === 'admin' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientIncidentData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      width={140}
                      style={{ fontSize: '11px', fontWeight: 800, fill: '#64748b' }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="total" fill="#4f46e5" radius={[0, 8, 8, 0]} barSize={28} />
                    <Bar dataKey="urgent" fill="#ef4444" radius={[0, 8, 8, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="clientColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" axisLine={false} tickLine={false} style={{ fontSize: '10px', fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} style={{ fontSize: '10px', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="load" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#clientColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Critical Alerts & Priority */}
        <div className="space-y-6">
          {/* Admin Critical Incident Monitor */}
          {userRole === 'admin' && urgentTickets.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-red-900 uppercase text-xs tracking-widest flex items-center gap-2">
                  <AlertTriangle size={16} />
                  Critical Monitor
                </h3>
                <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black">{urgentTickets.length}</span>
              </div>
              <div className="space-y-3">
                {urgentTickets.slice(0, 3).map(ticket => (
                  <div key={ticket.id} className="bg-white p-4 rounded-2xl border border-red-100 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-tight mb-1">
                      {clients.find(c => c.id === ticket.clientId)?.company}
                    </p>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{ticket.title}</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-600 uppercase">Urgent SLA</span>
                      <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priority Spectrum Pie */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Priority Spectrum</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Merged criticality analysis</p>
            <div className="h-64 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={10}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-900 leading-none">{tickets.length}</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global</span>
              </div>
            </div>
            <div className="mt-8 space-y-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-slate-300">{(item.value / (tickets.length || 1) * 100).toFixed(0)}%</span>
                    <span className="text-sm font-black text-slate-900">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Targets */}
          <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Target size={20} />
              Operations Goal
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-200">
                  <span>Target Resolution</span>
                  <span>95%</span>
                </div>
                <div className="h-2 bg-indigo-900/30 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-white w-[92%] rounded-full"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-indigo-200">
                  <span>AI Accuracy</span>
                  <span>99%</span>
                </div>
                <div className="h-2 bg-indigo-900/30 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-white w-[99%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
