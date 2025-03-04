"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Moon, 
  Sun, 
  Settings, 
  Activity,
  Share2,
  ChevronRight,
  Save
} from 'lucide-react';

// Define types
interface ProfileData {
  fullName: string;
  email: string;
  jobTitle: string;
  company: string;
  timezone: string;
}

interface ConnectedService {
  name: string;
  connected: boolean;
  lastSync: string;
}

interface SessionData {
  device: string;
  location: string;
  browser: string;
  time: string;
}

interface NotificationType {
  name: string;
  desc: string;
  enabled: boolean;
}

interface Integration {
  name: string;
  description: string;
}

interface ActivityItem {
  action: string;
  object: string;
  time: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
}

interface SwitchProps {
  enabled: boolean;
  onChange: (newValue: boolean) => void;
}

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
}

const SettingsPage: React.FC = () => {
  // State for different settings
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [marketingEmails, setMarketingEmails] = useState<boolean>(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState<boolean>(false);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [showActivityLog, setShowActivityLog] = useState<boolean>(false);
  
  // User profile form state
  const [profile, setProfile] = useState<ProfileData>({
    fullName: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    jobTitle: 'Marketing Director',
    company: 'Acme Inc.',
    timezone: 'America/New_York'
  });

  // Connected services
  const connectedServices: ConnectedService[] = [
    { name: 'Google Analytics', connected: true, lastSync: '2 hours ago' },
    { name: 'Mailchimp', connected: true, lastSync: '1 day ago' },
    { name: 'Slack', connected: false, lastSync: 'Never' },
    { name: 'HubSpot', connected: true, lastSync: '3 days ago' }
  ];

  // Toggle switches helper function
  const Switch: React.FC<SwitchProps> = ({ enabled, onChange }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full ${enabled ? 'bg-blue-600' : 'bg-muted'}`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </button>
  );

  // Form input helper component
  const FormInput: React.FC<FormInputProps> = ({ label, type = 'text', value, onChange, name, placeholder = '' }) => (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="w-full p-2 border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would save the profile data
    alert('Settings saved!');
  };

  // Notification types
  const notificationTypes: NotificationType[] = [
    { name: 'Report Completed', desc: 'When a report has finished generating', enabled: true },
    { name: 'Mentions', desc: 'When someone mentions you in a comment', enabled: true },
    { name: 'Shared Reports', desc: 'When someone shares a report with you', enabled: true },
    { name: 'Team Updates', desc: 'Updates from your team members', enabled: true }
  ];

  // Session data
  const sessions: SessionData[] = [
    { device: 'Windows PC', location: 'New York, USA', browser: 'Chrome', time: 'Current session' },
    { device: 'iPhone 13', location: 'New York, USA', browser: 'Safari', time: '2 hours ago' },
    { device: 'MacBook Pro', location: 'Boston, USA', browser: 'Firefox', time: '3 days ago' }
  ];

  // Integrations
  const availableIntegrations: Integration[] = [
    { name: 'Twitter', description: 'Connect to post reports directly to Twitter' },
    { name: 'LinkedIn', description: 'Share insights with your LinkedIn network' },
    { name: 'Zapier', description: 'Connect with 3,000+ apps and automate workflows' },
    { name: 'Google Drive', description: 'Save reports directly to your Google Drive' }
  ];

  // Activity logs
  const todayActivities: ActivityItem[] = [
    { action: 'Downloaded report', object: 'Q1 2025 Social Media Analysis', time: '10:30 AM' },
    { action: 'Created report', object: 'New Product Launch Strategy', time: '9:15 AM' },
    { action: 'Logged in', object: 'Chrome on Windows', time: '8:45 AM' }
  ];

  const yesterdayActivities: ActivityItem[] = [
    { action: 'Shared report', object: 'Competitor SEO Strategy Analysis with Marketing Team', time: '4:30 PM' },
    { action: 'Updated settings', object: 'Changed notification preferences', time: '2:15 PM' }
  ];

  const lastWeekActivities: ActivityItem[] = [
    { action: 'Created new folder', object: 'Q1 Reports', time: 'Feb 28, 2025' },
    { action: 'Connected service', object: 'Google Analytics', time: 'Feb 27, 2025' },
    { action: 'Deleted report', object: 'Draft SEO Analysis', time: 'Feb 26, 2025' }
  ];

  // Navigation items
  const navItems: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'activity', label: 'Activity Log', icon: Activity }
  ];

  // Helper function to toggle notification settings
  const toggleNotification = (index: number) => {
    const updatedTypes = [...notificationTypes];
    updatedTypes[index].enabled = !updatedTypes[index].enabled;
    // In a real app, this would update the state
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Profile Settings</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4 overflow-hidden">
                    <img src="/api/placeholder/200/200" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" className="px-3 py-1 text-sm border border-border rounded-md bg-card text-foreground hover:bg-accent/50">
                    Change Photo
                  </button>
                </div>
                <div className="md:w-2/3">
                  <FormInput 
                    label="Full Name" 
                    value={profile.fullName} 
                    onChange={handleProfileChange} 
                    name="fullName"
                  />
                  <FormInput 
                    label="Email" 
                    type="email" 
                    value={profile.email} 
                    onChange={handleProfileChange} 
                    name="email"
                  />
                  <FormInput 
                    label="Job Title" 
                    value={profile.jobTitle} 
                    onChange={handleProfileChange} 
                    name="jobTitle"
                  />
                  <FormInput 
                    label="Company" 
                    value={profile.company} 
                    onChange={handleProfileChange} 
                    name="company"
                  />
                  <div className="mb-4">
                    <label htmlFor="timezone" className="block text-sm font-medium text-foreground mb-1">Timezone</label>
                    <select 
                      id="timezone"
                      className="w-full p-2 border border-input rounded-md bg-card text-foreground"
                      value={profile.timezone}
                      onChange={handleProfileChange}
                      name="timezone"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Europe/Paris">Central European Time (CET)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    </select>
                  </div>
                  <div className="mt-6">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        );
      
      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Notification Preferences</h2>
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="mb-4 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch enabled={emailNotifications} onChange={setEmailNotifications} />
                </div>
              </div>
              
              <div className="mb-4 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">Push Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch enabled={pushNotifications} onChange={setPushNotifications} />
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">Marketing Emails</h3>
                    <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                  </div>
                  <Switch enabled={marketingEmails} onChange={setMarketingEmails} />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3 text-foreground">Notification Types</h3>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {notificationTypes.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch enabled={item.enabled} onChange={() => toggleNotification(index)} />
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Security Settings</h2>
            
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch enabled={twoFactorAuth} onChange={setTwoFactorAuth} />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <button 
                  type="button"
                  className="px-3 py-1 text-sm border border-border rounded-md bg-card text-foreground hover:bg-accent/50"
                >
                  Change Password
                </button>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3 text-foreground">Active Sessions</h3>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              {sessions.map((session, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-foreground">{session.device} · {session.browser}</h4>
                    <p className="text-sm text-muted-foreground">{session.location} · {session.time}</p>
                  </div>
                  {session.time !== 'Current session' && (
                    <button 
                      type="button"
                      className="px-2 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500/10"
                    >
                      Log out
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button 
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out of All Devices
              </button>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Appearance Settings</h2>
            
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <div className="mb-4 pb-4 border-b border-border">
                <h3 className="font-medium text-foreground mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`border ${!darkMode ? 'border-blue-500 bg-white' : 'border-border bg-card'} rounded-lg p-3 cursor-pointer`}
                    onClick={() => setDarkMode(false)}
                  >
                    <div className="flex justify-center mb-2">
                      <Sun className="h-6 w-6 text-gray-800" />
                    </div>
                    <p className="text-center text-sm font-medium text-foreground">Light</p>
                  </div>
                  <div 
                    className={`border ${darkMode ? 'border-blue-500' : 'border-border'} rounded-lg p-3 cursor-pointer bg-[#171F2A]`}
                    onClick={() => setDarkMode(true)}
                  >
                    <div className="flex justify-center mb-2">
                      <Moon className="h-6 w-6 text-gray-200" />
                    </div>
                    <p className="text-center text-sm font-medium text-gray-200">Dark</p>
                  </div>
                  <div className="border border-border rounded-lg p-3 cursor-pointer bg-card">
                    <div className="flex justify-center mb-2">
                      <Settings className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-center text-sm font-medium text-foreground">System</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">Compact Mode</h3>
                    <p className="text-sm text-muted-foreground">Use a more compact layout for tables and lists</p>
                  </div>
                  <Switch enabled={false} onChange={() => {}} />
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3 text-foreground">Dashboard Customization</h3>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-foreground">Default View</h3>
                    <p className="text-sm text-muted-foreground">Select which view to show by default</p>
                  </div>
                  <select className="p-1 border border-input rounded-md bg-card text-foreground">
                    <option>Card View</option>
                    <option>Table View</option>
                    <option>List View</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4 pb-4 border-b border-border">
                <h3 className="font-medium text-foreground mb-2">Home Widgets</h3>
                <p className="text-sm text-muted-foreground mb-3">Select which widgets appear on your home dashboard</p>
                <div className="space-y-2">
                  {['Recent Reports', 'Team Activity', 'Quick Actions', 'Storage Usage', 'Analytics Overview'].map((widget, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`widget-${i}`} 
                        className="rounded border-input text-blue-600 focus:ring-blue-500 bg-card" 
                        defaultChecked={i < 4}
                      />
                      <label htmlFor={`widget-${i}`} className="text-sm text-foreground">{widget}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">Auto Save</h3>
                    <p className="text-sm text-muted-foreground">Automatically save your work</p>
                  </div>
                  <Switch enabled={autoSave} onChange={setAutoSave} />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'integrations':
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Connected Services</h2>
            
            <div className="bg-card border border-border rounded-lg divide-y divide-border mb-6">
              {connectedServices.map((service, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                      <span className="text-lg font-medium text-foreground">{service.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{service.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {service.connected ? `Last sync: ${service.lastSync}` : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className={`px-3 py-1 text-sm border rounded-md ${
                      service.connected 
                        ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                        : 'border-blue-500 text-blue-500 hover:bg-blue-500/10'
                    }`}
                  >
                    {service.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-medium mb-3 text-foreground">Available Integrations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableIntegrations.map((integration, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-4 flex items-start">
                  <div className="h-10 w-10 rounded bg-muted flex items-center justify-center mr-3">
                    <span className="text-lg font-medium text-foreground">{integration.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{integration.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                    <button 
                      type="button"
                      className="px-3 py-1 text-sm border border-border rounded-md text-foreground hover:bg-accent/50"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'activity':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Activity Log</h2>
              <button 
                type="button"
                className="px-3 py-1 text-sm border border-border rounded-md bg-card text-foreground hover:bg-accent/50"
                onClick={() => setShowActivityLog(!showActivityLog)}
              >
                {showActivityLog ? 'Show Less' : 'Show All'}
              </button>
            </div>
            
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <div className="flex items-center mb-2">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  <h3 className="font-medium text-foreground">Today</h3>
                </div>
                <div className="ml-6 space-y-4">
                  {todayActivities.map((activity, index) => (
                    <div key={index} className="pb-2 border-b border-border last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-foreground">{activity.action}</span>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.object}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-b border-border">
                <div className="flex items-center mb-2">
                  <Activity className="h-4 w-4 mr-2 text-blue-500" />
                  <h3 className="font-medium text-foreground">Yesterday</h3>
                </div>
                <div className="ml-6 space-y-4">
                  {yesterdayActivities.map((activity, index) => (
                    <div key={index} className="pb-2 border-b border-border last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-foreground">{activity.action}</span>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.object}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {showActivityLog && (
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    <h3 className="font-medium text-foreground">Last 7 Days</h3>
                  </div>
                  <div className="ml-6 space-y-4">
                    {lastWeekActivities.map((activity, index) => (
                      <div key={index} className="pb-2 border-b border-border last:border-0 last:pb-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-foreground">{activity.action}</span>
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.object}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    
      default:
        return <div>Select a settings category</div>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="md:w-1/4">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-muted mr-3 overflow-hidden">
                  <img src="/api/placeholder/100/100" alt="Profile" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Alex Johnson</h3>
                  <p className="text-sm text-muted-foreground">Marketing Director</p>
                </div>
              </div>
            </div>
            <nav className="divide-y divide-border">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`w-full flex items-center p-3 text-left ${
                    activeTab === item.id 
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'text-foreground hover:bg-accent/50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && <ChevronRight className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-card border border-border rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;