import React, { useState } from 'react';
import { User, Mail, Camera, Calendar, Globe, DollarSign, Bell, Lock, Shield, LogOut, Trash2, Save, Edit2, X, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNavigate } from 'react-router-dom';
import { CURRENCIES, LANGUAGES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const { currency, setCurrency, language, setLanguage, theme, setTheme, notifications, updateNotifications } = useSettingsStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'user@example.com',
    username: user?.username || 'johndoe',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Financial preferences state
  const [financialPrefs, setFinancialPrefs] = useState({
    defaultIncomeCategory: user?.defaultIncomeCategory || 'salary',
    defaultExpenseCategory: user?.defaultExpenseCategory || 'food',
    monthlyBudgetLimit: user?.monthlyBudgetLimit || '',
  });

  // Profile image upload
  const [profileImage, setProfileImage] = useState(user?.avatar || null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinancialPrefChange = (e) => {
    const { name, value } = e.target;
    setFinancialPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Immediately update user avatar in store so navbar reflects the change
        updateUser({ avatar: reader.result });
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    updateUser({
      ...profileData,
      avatar: profileImage,
      defaultIncomeCategory: financialPrefs.defaultIncomeCategory,
      defaultExpenseCategory: financialPrefs.defaultExpenseCategory,
      monthlyBudgetLimit: financialPrefs.monthlyBudgetLimit,
    });
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    // Here you would call your API to change password
    toast.success('Password changed successfully');
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteAccount = () => {
    // Here you would call your API to delete account
    toast.success('Account deleted');
    logout();
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'settings', label: 'Account Settings', icon: Globe },
    { id: 'financial', label: 'Financial Preferences', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Profile & Settings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-2">
                <X size={18} />
                Cancel
              </button>
              <button onClick={handleSaveProfile} className="btn-success flex items-center gap-2">
                <Save size={18} />
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{profileData.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                <Camera size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{profileData.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.email}</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">@{profileData.username}</p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2024'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe size={16} />
                <span>{LANGUAGES.find(l => l.code === language)?.name || 'English'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <DollarSign size={16} />
                <span>{CURRENCIES.find(c => c.code === currency)?.name || 'USD'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {/* Profile Information */}
        {activeTab === 'profile' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className="input-field"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="label">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  className="input-field"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'settings' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="label">Preferred Currency</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input-field pl-10"
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Language</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field pl-10"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Theme</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">☀️</div>
                      <div className="font-medium">Light Mode</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌙</div>
                      <div className="font-medium">Dark Mode</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Notification Preferences</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Budget Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when approaching budget limits</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.budgetAlerts}
                      onChange={(e) => updateNotifications({ budgetAlerts: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Monthly Reports</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive monthly financial summary</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.monthlyReport}
                      onChange={(e) => updateNotifications({ monthlyReport: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Bill Reminders</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reminders for recurring payments</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.billReminders}
                      onChange={(e) => updateNotifications({ billReminders: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Unusual Spending Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Detect unusual spending patterns</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.unusualSpending}
                      onChange={(e) => updateNotifications({ unusualSpending: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financial Preferences */}
        {activeTab === 'financial' && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Financial Preferences</h3>
            <div className="space-y-4">
              <div>
                <label className="label">Default Income Category</label>
                <select
                  name="defaultIncomeCategory"
                  value={financialPrefs.defaultIncomeCategory}
                  onChange={handleFinancialPrefChange}
                  disabled={!isEditing}
                  className="input-field"
                >
                  {INCOME_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Default Expense Category</label>
                <select
                  name="defaultExpenseCategory"
                  value={financialPrefs.defaultExpenseCategory}
                  onChange={handleFinancialPrefChange}
                  disabled={!isEditing}
                  className="input-field"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Monthly Budget Limit</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="number"
                    name="monthlyBudgetLimit"
                    value={financialPrefs.monthlyBudgetLimit}
                    onChange={handleFinancialPrefChange}
                    disabled={!isEditing}
                    className="input-field pl-10"
                    placeholder="Enter monthly budget"
                    step="0.01"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Set a monthly spending limit to help track your budget
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-6">Security Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Lock size={24} className="text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button onClick={() => setShowPasswordModal(true)} className="btn-primary">
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield size={24} className="text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="btn-secondary">
                    Enable 2FA
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-6 text-red-600 dark:text-red-400">Danger Zone</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <LogOut size={24} className="text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Logout</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trash2 size={24} className="text-red-600 dark:text-red-400" />
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleChangePassword} className="flex-1 btn-primary">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                <p className="text-red-800 dark:text-red-300 font-medium">Warning: This action cannot be undone!</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  All your data including transactions, budgets, and reports will be permanently deleted.
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                Are you absolutely sure you want to delete your account? This will:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Delete all your financial records</li>
                <li>Remove all budgets and settings</li>
                <li>Cancel any recurring transactions</li>
                <li>Permanently erase your account data</li>
              </ul>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="flex-1 btn-danger">
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
