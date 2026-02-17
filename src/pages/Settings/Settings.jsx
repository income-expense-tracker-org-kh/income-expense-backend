import React, { useState } from 'react';
import { Globe, DollarSign, Calendar, Download, Upload, Trash2, RefreshCw, Bell, Palette, Database, Shield } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useBudgetStore } from '../../store/budgetStore';
import { CURRENCIES, LANGUAGES, DATE_FORMATS } from '../../constants';
import toast from 'react-hot-toast';

const Settings = () => {
  const { 
    currency, 
    setCurrency, 
    language, 
    setLanguage, 
    theme, 
    setTheme, 
    dateFormat, 
    setDateFormat,
    notifications,
    updateNotifications,
    resetSettings
  } = useSettingsStore();

  const { transactions, setTransactions } = useTransactionStore();
  const { budgets, setBudgets } = useBudgetStore();

  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ];

  // Data Export
  const handleExportAllData = () => {
    const exportData = {
      transactions,
      budgets,
      settings: {
        currency,
        language,
        theme,
        dateFormat,
        notifications,
      },
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fintracker-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  // Data Import
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          
          if (importedData.transactions) {
            setTransactions(importedData.transactions);
          }
          if (importedData.budgets) {
            setBudgets(importedData.budgets);
          }
          if (importedData.settings) {
            const { currency, language, theme, dateFormat, notifications } = importedData.settings;
            if (currency) setCurrency(currency);
            if (language) setLanguage(language);
            if (theme) setTheme(theme);
            if (dateFormat) setDateFormat(dateFormat);
            if (notifications) updateNotifications(notifications);
          }
          
          toast.success('Data imported successfully');
        } catch (error) {
          toast.error('Failed to import data. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Clear All Data
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete all your data? This cannot be undone!')) {
      setTransactions([]);
      setBudgets([]);
      toast.success('All data cleared');
    }
  };

  // Reset Settings
  const handleResetSettings = () => {
    if (window.confirm('Reset all settings to default values?')) {
      resetSettings();
      toast.success('Settings reset to default');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your application preferences</p>
      </div>

      {/* Section Navigation */}
      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Icon size={24} />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* General Settings */}
      {activeSection === 'general' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">General Settings</h3>
            
            <div className="space-y-6">
              {/* Currency */}
              <div>
                <label className="label">Default Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                      toast.success('Currency updated');
                    }}
                    className="input-field pl-10"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This will be used for all financial calculations and displays
                </p>
              </div>

              {/* Language */}
              <div>
                <label className="label">Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      toast.success('Language updated');
                    }}
                    className="input-field pl-10"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select your preferred language for the interface
                </p>
              </div>

              {/* Date Format */}
              <div>
                <label className="label">Date Format</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={dateFormat}
                    onChange={(e) => {
                      setDateFormat(e.target.value);
                      toast.success('Date format updated');
                    }}
                    className="input-field pl-10"
                  >
                    {DATE_FORMATS.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  How dates will be displayed throughout the application
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeSection === 'appearance' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Appearance</h3>
            
            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="label">Theme Mode</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={() => {
                      setTheme('light');
                      toast.success('Theme changed to Light');
                    }}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">☀️</div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">Light Mode</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bright and clean</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setTheme('dark');
                      toast.success('Theme changed to Dark');
                    }}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">🌙</div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">Dark Mode</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Easy on the eyes</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Color Scheme Preview */}
              <div>
                <label className="label">Color Preview</label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <div className="text-center">
                    <div className="w-full h-16 bg-primary-600 rounded-lg mb-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Primary</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-income rounded-lg mb-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Income</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-expense rounded-lg mb-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Expense</span>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-16 bg-gray-500 rounded-lg mb-2"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">Neutral</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Budget Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when approaching budget limits</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.budgetAlerts}
                  onChange={(e) => {
                    updateNotifications({ budgetAlerts: e.target.checked });
                    toast.success(e.target.checked ? 'Budget alerts enabled' : 'Budget alerts disabled');
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Monthly Reports</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive monthly financial summary reports</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.monthlyReport}
                  onChange={(e) => {
                    updateNotifications({ monthlyReport: e.target.checked });
                    toast.success(e.target.checked ? 'Monthly reports enabled' : 'Monthly reports disabled');
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Bill Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reminders for upcoming recurring payments</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.billReminders}
                  onChange={(e) => {
                    updateNotifications({ billReminders: e.target.checked });
                    toast.success(e.target.checked ? 'Bill reminders enabled' : 'Bill reminders disabled');
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Unusual Spending Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Detect and notify unusual spending patterns</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.unusualSpending}
                  onChange={(e) => {
                    updateNotifications({ unusualSpending: e.target.checked });
                    toast.success(e.target.checked ? 'Unusual spending alerts enabled' : 'Unusual spending alerts disabled');
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Management */}
      {activeSection === 'data' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Data Management</h3>
            
            <div className="space-y-4">
              {/* Export Data */}
              <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Download className="text-primary-600" size={20} />
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Export Data</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Download all your transactions, budgets, and settings as a JSON file
                    </p>
                  </div>
                  <button onClick={handleExportAllData} className="btn-primary ml-4">
                    Export
                  </button>
                </div>
              </div>

              {/* Import Data */}
              <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="text-blue-600" size={20} />
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Import Data</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Restore your data from a previously exported JSON file
                    </p>
                  </div>
                  <label className="btn-secondary ml-4 cursor-pointer">
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset Settings */}
              <div className="p-4 border-2 border-yellow-200 dark:border-yellow-900 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="text-yellow-600" size={20} />
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Reset Settings</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reset all settings to their default values (keeps your data)
                    </p>
                  </div>
                  <button onClick={handleResetSettings} className="btn-secondary ml-4">
                    Reset
                  </button>
                </div>
              </div>

              {/* Clear All Data */}
              <div className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Trash2 className="text-red-600" size={20} />
                      <h4 className="font-semibold text-red-600 dark:text-red-400">Clear All Data</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete all transactions and budgets (cannot be undone)
                    </p>
                  </div>
                  <button onClick={handleClearAllData} className="btn-danger ml-4">
                    Clear Data
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Info */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Storage Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{transactions.length}</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Budgets</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{budgets.length}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Storage Used</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {((JSON.stringify({ transactions, budgets }).length / 1024).toFixed(2))} KB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security & Privacy */}
      {activeSection === 'security' && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Security & Privacy</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Data Storage</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your financial data is stored locally in your browser using localStorage. 
                  Data is encrypted and never sent to external servers.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Privacy</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We don't collect, store, or share any of your personal or financial information. 
                  All data remains on your device.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Session Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  For enhanced security, you can enable automatic logout after inactivity.
                </p>
                <div className="flex items-center gap-4">
                  <select className="input-field flex-1">
                    <option value="never">Never</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                  </select>
                  <button className="btn-primary">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
