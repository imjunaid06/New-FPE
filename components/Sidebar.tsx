
import React from 'react';
import { LayoutDashboard, Ticket, Users, ShieldCheck, Settings, LogOut, MessageSquareCode } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  appName: string;
  userRole: 'admin' | 'client';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, appName, userRole }) => {
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'troubleshoot', label: 'AI Support', icon: MessageSquareCode },
    { id: 'team', label: 'Team Members', icon: ShieldCheck },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clientMenuItems = [
    { id: 'dashboard', label: 'My Stats', icon: LayoutDashboard },
    { id: 'tickets', label: 'Support Tickets', icon: Ticket },
    { id: 'troubleshoot', label: 'Quick AI Help', icon: MessageSquareCode },
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white fixed left-0 top-0 z-10">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400 uppercase">{appName}</h1>
        <p className="text-xs text-slate-400 font-medium">
          {userRole === 'admin' ? 'Enterprise Admin' : 'Client Portal'}
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div 
          onClick={() => window.location.href = window.location.pathname}
          className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 cursor-pointer transition-colors mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Exit Session</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
