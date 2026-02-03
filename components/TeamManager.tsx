
import React, { useState } from 'react';
import { UserPlus, Trash2, Mail, Shield } from 'lucide-react';
import { TeamMember } from '../types';

interface TeamManagerProps {
  members: TeamMember[];
  onAddMember: (member: Omit<TeamMember, 'id'>) => void;
  onRemoveMember: (id: string) => void;
}

const TeamManager: React.FC<TeamManagerProps> = ({ members, onAddMember, onRemoveMember }) => {
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Agent', status: 'active' as const });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.email) {
      onAddMember(newMember);
      setNewMember({ name: '', email: '', role: 'Agent', status: 'active' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Management</h2>
          <p className="text-slate-500">Manage internal staff roles and access.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors font-medium"
        >
          <UserPlus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            />
            <select
              className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Agent">Agent</option>
            </select>
            <div className="flex space-x-2">
              <button type="submit" className="flex-1 bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-slate-900">{member.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-slate-600 text-sm">
                    <Shield size={14} className="text-slate-400" />
                    <span>{member.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1 text-slate-500 text-sm">
                    <Mail size={14} />
                    <span>{member.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onRemoveMember(member.id)}
                    className="text-red-400 hover:text-red-600 p-2 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamManager;
