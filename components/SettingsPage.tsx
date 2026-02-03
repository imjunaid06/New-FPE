
import React, { useState } from 'react';
import { Save, Shield, Cpu, Building, Bell, History } from 'lucide-react';
import { SystemSettings, TicketPriority } from '../types';

interface SettingsPageProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onUpdateSettings }) => {
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'ai' | 'security'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateSettings(formData);
      setIsSaving(false);
    }, 600);
  };

  const InputField = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex">
      {/* Settings Navigation */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
        <button
          onClick={() => setActiveSubTab('general')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeSubTab === 'general' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building size={18} />
          <span>General</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ai')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeSubTab === 'ai' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cpu size={18} />
          <span>AI Engine</span>
        </button>
        <button
          onClick={() => setActiveSubTab('security')}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
            activeSubTab === 'security' ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield size={18} />
          <span>Security & Roles</span>
        </button>
        <div className="pt-4 mt-4 border-t border-slate-200">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
            <Bell size={18} />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100">
            <History size={18} />
            <span>Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
          {activeSubTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Branding & Organization</h3>
                <p className="text-sm text-slate-500">Configure your public-facing identity and support contact.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Application Name"
                  value={formData.appName}
                  onChange={(v: string) => setFormData({ ...formData, appName: v })}
                />
                <InputField
                  label="Organization Name"
                  value={formData.organizationName}
                  onChange={(v: string) => setFormData({ ...formData, organizationName: v })}
                />
              </div>
              <InputField
                label="Primary Support Email"
                value={formData.supportEmail}
                onChange={(v: string) => setFormData({ ...formData, supportEmail: v })}
                type="email"
              />
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Default Ticket Priority</label>
                <select
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.defaultPriority}
                  onChange={(e) => setFormData({ ...formData, defaultPriority: e.target.value as TicketPriority })}
                >
                  <option value={TicketPriority.LOW}>Low</option>
                  <option value={TicketPriority.MEDIUM}>Medium</option>
                  <option value={TicketPriority.HIGH}>High</option>
                  <option value={TicketPriority.URGENT}>Urgent</option>
                </select>
              </div>
            </div>
          )}

          {activeSubTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Gemini Intelligence</h3>
                <p className="text-sm text-slate-500">Control how the AI interacts with incoming incidents.</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="space-y-0.5">
                  <p className="font-semibold text-blue-900">Auto-Categorization</p>
                  <p className="text-xs text-blue-700">Allow AI to automatically set categories and priority levels.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, autoCategorization: !formData.autoCategorization })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.autoCategorization ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.autoCategorization ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Language Model Profile</label>
                <select
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.aiModel}
                  onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (High Speed / Efficient)</option>
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Deep Reasoning / Complex Tasks)</option>
                </select>
              </div>
            </div>
          )}

          {activeSubTab === 'security' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Compliance & Security</h3>
                <p className="text-sm text-slate-500">Set system-wide security constraints and data retention.</p>
              </div>
              <InputField
                label="Data Retention (Days)"
                value={formData.retentionDays}
                onChange={(v: number) => setFormData({ ...formData, retentionDays: Number(v) })}
                type="number"
              />
              <div className="p-4 border border-amber-200 bg-amber-50 rounded-xl">
                <h4 className="text-sm font-bold text-amber-800 mb-1">Advanced Role Access</h4>
                <p className="text-xs text-amber-700">Currently limited to Admin managed access. Granular permissions can be enabled in the Team Members tab.</p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/20"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
