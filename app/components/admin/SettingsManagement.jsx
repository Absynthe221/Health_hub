'use client';

import { useState } from 'react';
import { 
  Settings,
  Save,
  RefreshCw,
  Globe,
  Lock,
  Bell,
  Mail,
  Database,
  Server,
  Shield,
  Eye,
  EyeOff,
  Key,
  Upload,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Palette,
  Zap,
  Clock,
  Users,
  BookOpen,
  FileText,
  Code,
  Boxes
} from 'lucide-react';

export default function SettingsManagement({ onActionClick }) {
  const [activeSection, setActiveSection] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Settings categories
  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'platform', label: 'Platform', icon: Globe },
    { id: 'authentication', label: 'Authentication', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup & Restore', icon: Download }
  ];

  // Current settings (mock data - in production from API)
  const [settings, setSettings] = useState({
    general: {
      platformName: 'Health Hub ECG',
      platformTagline: 'Comprehensive ECG Learning Platform',
      supportEmail: 'support@healthhub.com',
      adminEmail: 'admin@healthhub.com',
      timezone: 'Europe/London',
      language: 'en',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    },
    platform: {
      maintenanceMode: false,
      registrationOpen: true,
      requireEmailVerification: true,
      allowSelfRegistration: true,
      defaultUserRole: 'learner',
      maxUsersPerInstructor: 150,
      sessionTimeout: 60,
      maxLoginAttempts: 5
    },
    authentication: {
      requireStrongPassword: true,
      minPasswordLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      enableTwoFactor: true,
      twoFactorMethod: 'email',
      sessionDuration: 7,
      rememberMeDuration: 30
    },
    notifications: {
      enableInApp: true,
      enableEmail: true,
      enablePush: false,
      notifyModuleCompletion: true,
      notifyQuizResults: true,
      notifyCertificates: true,
      notifyInactivity: true,
      inactivityDays: 7,
      digestFrequency: 'weekly'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: 'noreply@healthhub.com',
      smtpPassword: '••••••••••••',
      fromName: 'Health Hub ECG',
      fromEmail: 'noreply@healthhub.com',
      replyTo: 'support@healthhub.com'
    },
    database: {
      type: 'PostgreSQL',
      host: 'localhost',
      port: 5432,
      database: 'healthhub_db',
      maxConnections: 20,
      backupFrequency: 'daily',
      retentionDays: 30
    },
    security: {
      enableFirewall: true,
      enableRateLimiting: true,
      rateLimit: 100,
      rateLimitWindow: 15,
      enableCORS: true,
      allowedOrigins: ['https://healthhub.com'],
      enableSSL: true,
      enableCSP: true,
      enableXSSProtection: true
    },
    api: {
      openaiKey: 'sk-••••••••••••••••',
      googleGeminiKey: 'AIza••••••••••••',
      stripeKey: 'sk_test_••••••••••',
      twilioSid: 'AC••••••••••••••',
      awsAccessKey: 'AKIA••••••••••',
      enableAPILogging: true,
      apiRateLimit: 1000
    },
    appearance: {
      primaryColor: '#3B82F6',
      accentColor: '#8B5CF6',
      theme: 'light',
      fontFamily: 'Inter',
      enableAnimations: true,
      compactMode: false
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retainBackups: 30,
      includeMedia: true,
      compressionEnabled: true
    }
  });

  const handleSave = (section) => {
    setUnsavedChanges(false);
    if (onActionClick) {
      onActionClick(`Save ${section} Settings`);
    }
  };

  const handleReset = (section) => {
    if (onActionClick) {
      onActionClick(`Reset ${section} Settings to Default`);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.general.platformName}
              onChange={(e) => {
                setSettings({...settings, general: {...settings.general, platformName: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform Tagline</label>
            <input
              type="text"
              value={settings.general.platformTagline}
              onChange={(e) => {
                setSettings({...settings, general: {...settings.general, platformTagline: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => {
                  setSettings({...settings, general: {...settings.general, supportEmail: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.general.adminEmail}
                onChange={(e) => {
                  setSettings({...settings, general: {...settings.general, adminEmail: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.general.timezone}
                onChange={(e) => {
                  setSettings({...settings, general: {...settings.general, timezone: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={settings.general.language}
                onChange={(e) => {
                  setSettings({...settings, general: {...settings.general, language: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-500">Disable platform access for maintenance</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.platform.maintenanceMode}
                onChange={(e) => {
                  setSettings({...settings, platform: {...settings.platform, maintenanceMode: e.target.checked}});
                  setUnsavedChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Open Registration</p>
                <p className="text-sm text-gray-500">Allow new users to self-register</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.platform.registrationOpen}
                onChange={(e) => {
                  setSettings({...settings, platform: {...settings.platform, registrationOpen: e.target.checked}});
                  setUnsavedChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Require Email Verification</p>
                <p className="text-sm text-gray-500">Users must verify email before access</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.platform.requireEmailVerification}
                onChange={(e) => {
                  setSettings({...settings, platform: {...settings.platform, requireEmailVerification: e.target.checked}});
                  setUnsavedChanges(true);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default User Role</label>
              <select
                value={settings.platform.defaultUserRole}
                onChange={(e) => {
                  setSettings({...settings, platform: {...settings.platform, defaultUserRole: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="learner">Learner</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.platform.sessionTimeout}
                onChange={(e) => {
                  setSettings({...settings, platform: {...settings.platform, sessionTimeout: parseInt(e.target.value)}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Security Notice</p>
              <p className="text-sm text-yellow-700 mt-1">
                Changes to security settings may affect all users. Use caution when modifying these settings.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Password Requirements</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require strong passwords</span>
                <input
                  type="checkbox"
                  checked={settings.authentication.requireStrongPassword}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, requireStrongPassword: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">Minimum Password Length</label>
                <input
                  type="number"
                  value={settings.authentication.minPasswordLength}
                  min="6"
                  max="32"
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, minPasswordLength: parseInt(e.target.value)}});
                    setUnsavedChanges(true);
                  }}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require uppercase letters</span>
                <input
                  type="checkbox"
                  checked={settings.authentication.requireUppercase}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, requireUppercase: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require numbers</span>
                <input
                  type="checkbox"
                  checked={settings.authentication.requireNumbers}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, requireNumbers: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require special characters</span>
                <input
                  type="checkbox"
                  checked={settings.authentication.requireSpecialChars}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, requireSpecialChars: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded-border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enable 2FA</span>
                <input
                  type="checkbox"
                  checked={settings.authentication.enableTwoFactor}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, enableTwoFactor: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">2FA Method</label>
                <select
                  value={settings.authentication.twoFactorMethod}
                  onChange={(e) => {
                    setSettings({...settings, authentication: {...settings.authentication, twoFactorMethod: e.target.value}});
                    setUnsavedChanges(true);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email OTP</option>
                  <option value="sms">SMS OTP</option>
                  <option value="app">Authenticator App</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Rate Limiting</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Enable Rate Limiting</span>
                <input
                  type="checkbox"
                  checked={settings.security.enableRateLimiting}
                  onChange={(e) => {
                    setSettings({...settings, security: {...settings.security, enableRateLimiting: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Max Requests</label>
                  <input
                    type="number"
                    value={settings.security.rateLimit}
                    onChange={(e) => {
                      setSettings({...settings, security: {...settings.security, rateLimit: parseInt(e.target.value)}});
                      setUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Time Window (min)</label>
                  <input
                    type="number"
                    value={settings.security.rateLimitWindow}
                    onChange={(e) => {
                      setSettings({...settings, security: {...settings.security, rateLimitWindow: parseInt(e.target.value)}});
                      setUnsavedChanges(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys & Integration</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Secure Storage</p>
              <p className="text-sm text-blue-700 mt-1">
                API keys are encrypted and stored securely. Never share your keys publicly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key</label>
            <div className="flex">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.api.openaiKey}
                onChange={(e) => {
                  setSettings({...settings, api: {...settings.api, openaiKey: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Used for AI-powered quiz generation and content analysis</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Gemini API Key</label>
            <input
              type="password"
              value={settings.api.googleGeminiKey}
              onChange={(e) => {
                setSettings({...settings, api: {...settings.api, googleGeminiKey: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="AIza..."
            />
            <p className="text-xs text-gray-500 mt-1">Used for image analysis and multimodal processing</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stripe API Key (Optional)</label>
            <input
              type="password"
              value={settings.api.stripeKey}
              onChange={(e) => {
                setSettings({...settings, api: {...settings.api, stripeKey: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="sk_test_..."
            />
            <p className="text-xs text-gray-500 mt-1">For payment processing (if offering paid courses)</p>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Code className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Enable API Logging</p>
                <p className="text-sm text-gray-500">Log all API requests for debugging</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.api.enableAPILogging}
              onChange={(e) => {
                setSettings({...settings, api: {...settings.api, enableAPILogging: e.target.checked}});
                setUnsavedChanges(true);
              }}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Configuration</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
              <input
                type="text"
                value={settings.email.smtpHost}
                onChange={(e) => {
                  setSettings({...settings, email: {...settings.email, smtpHost: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
              <input
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => {
                  setSettings({...settings, email: {...settings.email, smtpPort: parseInt(e.target.value)}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
            <input
              type="text"
              value={settings.email.smtpUser}
              onChange={(e) => {
                setSettings({...settings, email: {...settings.email, smtpUser: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
            <input
              type="password"
              value={settings.email.smtpPassword}
              onChange={(e) => {
                setSettings({...settings, email: {...settings.email, smtpPassword: e.target.value}});
                setUnsavedChanges(true);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
              <input
                type="text"
                value={settings.email.fromName}
                onChange={(e) => {
                  setSettings({...settings, email: {...settings.email, fromName: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
              <input
                type="email"
                value={settings.email.fromEmail}
                onChange={(e) => {
                  setSettings({...settings, email: {...settings.email, fromEmail: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => onActionClick && onActionClick('Test Email Configuration')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send Test Email
          </button>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Restore</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Automatic Backups</p>
                <p className="text-sm text-gray-500">Schedule regular system backups</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.backup.autoBackup}
              onChange={(e) => {
                setSettings({...settings, backup: {...settings.backup, autoBackup: e.target.checked}});
                setUnsavedChanges(true);
              }}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={settings.backup.backupFrequency}
                onChange={(e) => {
                  setSettings({...settings, backup: {...settings.backup, backupFrequency: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Backup Time</label>
              <input
                type="time"
                value={settings.backup.backupTime}
                onChange={(e) => {
                  setSettings({...settings, backup: {...settings.backup, backupTime: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retain (days)</label>
              <input
                type="number"
                value={settings.backup.retainBackups}
                onChange={(e) => {
                  setSettings({...settings, backup: {...settings.backup, retainBackups: parseInt(e.target.value)}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-6">
            <h4 className="font-medium text-gray-900 mb-4">Backup Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onActionClick && onActionClick('Create Backup Now')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Backup Now
              </button>

              <button
                onClick={() => onActionClick && onActionClick('Restore from Backup')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Restore Backup
              </button>

              <button
                onClick={() => onActionClick && onActionClick('View Backup History')}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                Backup History
              </button>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Last Backup</p>
                <p className="text-sm text-green-700 mt-1">
                  October 8, 2025 at 02:00 AM • 245 MB • All data included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Configuration</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Critical Settings</p>
              <p className="text-sm text-red-700 mt-1">
                Modifying database settings incorrectly can cause data loss. Only change if you know what you're doing.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Database Type</label>
              <select
                value={settings.database.type}
                onChange={(e) => {
                  setSettings({...settings, database: {...settings.database, type: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MySQL">MySQL</option>
                <option value="MongoDB">MongoDB</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
              <input
                type="text"
                value={settings.database.host}
                onChange={(e) => {
                  setSettings({...settings, database: {...settings.database, host: e.target.value}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
              <input
                type="number"
                value={settings.database.port}
                onChange={(e) => {
                  setSettings({...settings, database: {...settings.database, port: parseInt(e.target.value)}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Connections</label>
              <input
                type="number"
                value={settings.database.maxConnections}
                onChange={(e) => {
                  setSettings({...settings, database: {...settings.database, maxConnections: parseInt(e.target.value)}});
                  setUnsavedChanges(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={() => onActionClick && onActionClick('Test Database Connection')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Delivery Channels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-sm text-gray-700">In-App Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.enableInApp}
                  onChange={(e) => {
                    setSettings({...settings, notifications: {...settings.notifications, enableInApp: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.enableEmail}
                  onChange={(e) => {
                    setSettings({...settings, notifications: {...settings.notifications, enableEmail: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-purple-500 mr-3" />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.enablePush}
                  onChange={(e) => {
                    setSettings({...settings, notifications: {...settings.notifications, enablePush: e.target.checked}});
                    setUnsavedChanges(true);
                  }}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
            <div className="space-y-3">
              {[
                { key: 'notifyModuleCompletion', label: 'Module Completion', checked: settings.notifications.notifyModuleCompletion },
                { key: 'notifyQuizResults', label: 'Quiz Results', checked: settings.notifications.notifyQuizResults },
                { key: 'notifyCertificates', label: 'Certificate Available', checked: settings.notifications.notifyCertificates },
                { key: 'notifyInactivity', label: 'Inactivity Alerts', checked: settings.notifications.notifyInactivity }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => {
                      setSettings({...settings, notifications: {...settings.notifications, [item.key]: e.target.checked}});
                      setUnsavedChanges(true);
                    }}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setSettings({...settings, appearance: {...settings.appearance, theme: 'light'}});
                  setUnsavedChanges(true);
                }}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  settings.appearance.theme === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-500 rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium">Light</p>
              </button>

              <button
                onClick={() => {
                  setSettings({...settings, appearance: {...settings.appearance, theme: 'dark'}});
                  setUnsavedChanges(true);
                }}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  settings.appearance.theme === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-gray-800 border-2 border-gray-600 rounded flex items-center justify-center">
                    <div className="w-6 h-6 bg-blue-400 rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium">Dark</p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => {
                    setSettings({...settings, appearance: {...settings.appearance, primaryColor: e.target.value}});
                    setUnsavedChanges(true);
                  }}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-600">{settings.appearance.primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={settings.appearance.accentColor}
                  onChange={(e) => {
                    setSettings({...settings, appearance: {...settings.appearance, accentColor: e.target.value}});
                    setUnsavedChanges(true);
                  }}
                  className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                />
                <span className="ml-3 text-sm text-gray-600">{settings.appearance.accentColor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Enable Animations</p>
                <p className="text-sm text-gray-500">Smooth transitions and effects</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.appearance.enableAnimations}
              onChange={(e) => {
                setSettings({...settings, appearance: {...settings.appearance, enableAnimations: e.target.checked}});
                setUnsavedChanges(true);
              }}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'platform':
        return renderPlatformSettings();
      case 'authentication':
      case 'security':
        return renderSecuritySettings();
      case 'api':
        return renderAPISettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'database':
        return renderDatabaseSettings();
      case 'backup':
        return renderBackupSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-8">
              <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a setting category from the left</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            <p className="text-sm text-gray-500 mt-1">Configure platform behavior and preferences</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {unsavedChanges && (
              <span className="text-sm text-orange-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Unsaved changes
              </span>
            )}
            
            <button
              onClick={() => handleSave(activeSection)}
              disabled={!unsavedChanges}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>

            <button
              onClick={() => handleReset(activeSection)}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      if (onActionClick) {
                        onActionClick(`View ${section.label} Settings`);
                      }
                    }}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">Server Status</p>
              <p className="text-sm font-semibold text-green-700">Online</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Database className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">Database</p>
              <p className="text-sm font-semibold text-green-700">Connected</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Server className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">API Services</p>
              <p className="text-sm font-semibold text-green-700">Operational</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-sm font-semibold text-blue-700">99.9%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow p-6 border-2 border-red-200">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          These actions are irreversible. Proceed with extreme caution.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onActionClick && onActionClick('Clear All Cache')}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cache
          </button>

          <button
            onClick={() => onActionClick && onActionClick('Reset All Settings to Default')}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </button>

          <button
            onClick={() => onActionClick && onActionClick('Delete All User Data (DANGEROUS)')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}

