import React, { useEffect, useState } from 'react';
import { User, Mail, Camera, Calendar, Globe, DollarSign, Bell, Lock, Shield, LogOut, Trash2, Save, Edit2, X, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useNavigate } from 'react-router-dom';
import { CURRENCIES, LANGUAGES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../constants';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import useTranslation from '../../hooks/useTranslation';

// ─── Skeleton Components ──────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
);

const ProfileOverviewSkeleton = () => (
  <div className="card">
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Profile Picture Skeleton */}
      <Skeleton className="w-32 h-32 rounded-full" />

      {/* User Info Skeleton */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
        <Skeleton className="h-5 w-64 mx-auto md:mx-0" />
        <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
        <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
  </div>
);

const ProfileFormSkeleton = () => (
  <div className="card">
    <Skeleton className="h-6 w-40 mb-6" />
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-5 w-24 mb-2" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
      <div>
        <Skeleton className="h-5 w-16 mb-2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);

const SettingsSkeleton = () => (
  <div className="card">
    <Skeleton className="h-6 w-40 mb-6" />
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-11 w-full" />
        </div>
      ))}
      <div>
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-24" />
          <Skeleton className="flex-1 h-24" />
        </div>
      </div>
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const FinancialPrefsSkeleton = () => (
  <div className="card">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-11 w-full" />
          {i === 2 && <Skeleton className="h-4 w-64 mt-1" />}
        </div>
      ))}
    </div>
  </div>
);

const SecuritySkeleton = () => (
  <div className="space-y-6">
    <div className="card">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
    <div className="card">
      <Skeleton className="h-6 w-32 mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Profile = () => {
  const { user, logout } = useAuthStore();
  const { currency, setCurrency, language, setLanguage, theme, setTheme, notifications, updateNotifications } = useSettingsStore();
  const navigate = useNavigate();
  const { t } = useTranslation(language);
  const [activeTab, setActiveTab] = useState('profileInfo');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);


  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name ,
    email: user?.email,
    username: user?.username ,
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
        setProfileData(prev => ({ ...prev, avatar: reader.result })); // ← FIX HERE
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const getDetailUserMe = async () => {
    try {
      setLoading(true);
      const res = await authService.getAll();
      setProfileData(res?.data);
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getDetailUserMe();
  }, [user]);

  const handleSaveProfile = async () => {
    const updateUser = {
      ...profileData,
      avatar: profileImage,
      defaultIncomeCategory: financialPrefs.defaultIncomeCategory,
      defaultExpenseCategory: financialPrefs.defaultExpenseCategory,
      monthlyBudgetLimit: financialPrefs.monthlyBudgetLimit,
    };

    try {
      if (isEditing) {
         await authService.updateProfile(updateUser);
        toast.success(t('notifications.success.profileUpdated'));
      }
      getDetailUserMe();
      setIsEditing(false);
    } catch (error) {
      toast.error('Save failed');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error(t('notifications.error.fillAllPasswordFields'));
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('notifications.error.passwordsNotMatch'));
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error(t('notifications.error.passwordMinLength'));
      return;
    }

    const paramPassword = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    };

    try {
      await authService.updatePassword(paramPassword);

      // ✅ SUCCESS — close modal, logout, redirect
      toast.success(t('notifications.success.passwordChanged'));
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      logout();
      navigate('/login');

    } catch (error) {
      // ✅ FAILED — show error toast, stay on current page (no navigate)
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Current password is incorrect';

      toast.error(message);
      // ❌ REMOVED: navigate("/profile") — was causing reload loop
    }
  };

  const handleDeleteAccount = () => {
     toast.success(t('notifications.success.accountDeleted'));
    logout();
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    toast.success(t('notifications.success.loggedOut'));
    navigate('/login');
  };

  const tabs = [
    { id: 'profileInfo', label: 'Profile Info', icon: User },
    { id: 'accountSettings', label: 'Account Settings', icon: Globe },
    { id: 'financialPreferences', label: 'Financial Preferences', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Shield },
  ];
  const placeholders = {
    currentPassword: t('profile.enterCurrentPassword'),
    newPassword: t('profile.enterNewPassword'),
    confirmPassword: t('profile.enterConfirmPassword'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t("profile.title")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t("profile.subtitle")}</p>
        </div>
        {!loading && (
          <div className="flex gap-2">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
                <Edit2 size={18} />
                {t("profile.editProfile")}
              </button>
            ) : (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary flex items-center gap-2">
                  <X size={18} />
                  {t("common.cancel")}
                </button>
                <button onClick={handleSaveProfile} className="btn-success flex items-center gap-2">
                  <Save size={18} />
                  {t("profile.saveChanges")}
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Profile Overview */}
      {loading ? (
        <ProfileOverviewSkeleton />
      ) : (
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
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
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
                  <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'January 2026'}</span>
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
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap disabled:opacity-50 ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
              >
                <Icon size={18} />
                {t(`profile.${tab.id}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {loading ? (
          <>
            {activeTab === 'profileInfo' && <ProfileFormSkeleton />}
            {activeTab === 'accountSettings' && <SettingsSkeleton />}
            {activeTab === 'financialPreferences' && <FinancialPrefsSkeleton />}
            {activeTab === 'security' && <SecuritySkeleton />}
          </>
        ) : (
          <>
            {/* Profile Information */}
            {activeTab === 'profileInfo' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("profile.profileInfo")}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{t("profile.fullName")}</label>
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
                      <label className="label">{t("profile.username")}</label>
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
                      <label className="label">{t("profile.email")}</label>
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
                      <label className="label">{t("profile.phone")}</label>
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
                    <label className="label">{t("profile.bio")}</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className="input-field"
                      rows="4"
                      placeholder={t("profile.bioPlaceholder")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'accountSettings' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("profile.accountSettings")}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="label">{t("profile.preferredCurrency")}</label>
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
                    <label className="label">{t("profile.language")}</label>
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
                    <label className="label">{t("profile.theme")}</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 p-4 border-2 rounded-lg transition-colors ${theme === 'light'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">☀️</div>
                          <div className="font-medium">{t("settings.lightMode")}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 p-4 border-2 rounded-lg transition-colors ${theme === 'dark'
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                          }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🌙</div>
                          <div className="font-medium">{t("settings.darkMode")}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4">{t("profile.notificationPreferences")}</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'budgetAlertsDesc' },
                        { key: 'monthlyReports', label: 'Monthly Reports', desc: 'monthlyReportsDesc' },
                        { key: 'billReminders', label: 'Bill Reminders', desc: 'billRemindersDesc' },
                        { key: 'unusualSpending', label: 'Unusual Spending Alerts', desc: 'unusualSpendingDesc' },
                      ].map(({ key, desc }) => (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Bell size={20} className="text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-200">{t(`profile.${key}`)}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{t(`profile.${desc}`)}</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications[key]}
                            onChange={(e) => updateNotifications({ [key]: e.target.checked })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Preferences */}
            {activeTab === 'financialPreferences' && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("profile.financialPreferences")}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="label">{t("profile.defaultIncomeCategory")}</label>
                    <select
                      name="defaultIncomeCategory"
                      value={financialPrefs.defaultIncomeCategory}
                      onChange={handleFinancialPrefChange}
                      disabled={!isEditing}
                      className="input-field"
                    >
                      {INCOME_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {t(`income.categories.${cat.id}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">{t("profile.defaultExpenseCategory")}</label>
                    <select
                      name="defaultExpenseCategory"
                      value={financialPrefs.defaultExpenseCategory}
                      onChange={handleFinancialPrefChange}
                      disabled={!isEditing}
                      className="input-field"
                    >
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {t(`expense.categories.${cat.id}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">{t("profile.monthlyBudgetLimit")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        name="monthlyBudgetLimit"
                        value={financialPrefs.monthlyBudgetLimit}
                        onChange={handleFinancialPrefChange}
                        disabled={!isEditing}
                        className="input-field pl-10"
                        placeholder={t("profile.enterMonthlyBudget")}
                        step="0.01"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {t("profile.monthlyBudgetLimitHelp")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-6">{t("profile.securitySettings")}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock size={24} className="text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{t("profile.password")}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.passwordLastChanged")}</p>
                        </div>
                      </div>
                      <button onClick={() => setShowPasswordModal(true)} className="btn-primary">
                        {t("profile.changePassword")}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield size={24} className="text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{t("profile.twoFactorAuth")}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.twoFactorAuthDesc")}</p>
                        </div>
                      </div>
                      <button className="btn-secondary">
                        {t("profile.enable2FA")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-6 text-red-600 dark:text-red-400">{t("profile.dangerZone")}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <LogOut size={24} className="text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">{t("profile.logout")}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.logoutDesc")}</p>
                        </div>
                      </div>
                      <button onClick={handleLogout} className="btn-secondary">
                        {t("profile.logout")}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Trash2 size={24} className="text-red-600 dark:text-red-400" />
                        <div>
                          <p className="font-medium text-red-600 dark:text-red-400">{t("profile.deleteAccount")}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t("profile.deleteAccountDesc")}</p>
                        </div>
                      </div>
                      <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
                        {t("profile.deleteAccount")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t("profile.changePassword")}</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {['currentPassword', 'newPassword', 'confirmPassword'].map((field, idx) => (
                <div key={field}>
                  <label className="label">
                    {field === 'currentPassword'
                      ? t('profile.currentPassword')
                      : field === 'newPassword'
                        ? t('profile.newPassword')
                        : t('profile.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPasswords[field.replace('Password', '')] || showPasswords[field === 'confirmPassword' ? 'confirm' : field.replace('Password', '')] ? 'text' : 'password'}
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="input-field pl-10 pr-10"
                      placeholder={placeholders[field] || ''}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        [field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm']: !prev[field === 'currentPassword' ? 'current' : field === 'newPassword' ? 'new' : 'confirm']
                      }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {(field === 'currentPassword' ? showPasswords.current : field === 'newPassword' ? showPasswords.new : showPasswords.confirm) ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowPasswordModal(false)} className="flex-1 btn-secondary">
                  {t("common.cancel")}
                </button>
                <button onClick={handleChangePassword} className="flex-1 btn-primary">
                  {t("profile.changePassword")}
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
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400">{t("profile.deleteAccount")}</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg">
                <p className="text-red-800 dark:text-red-300 font-medium">{t("profile.deleteAccountWarning")}</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {t("profile.deleteAccountConfirm")}
                </p>
              </div>

              <p className="text-gray-600 dark:text-gray-400">
                {t("profile.deleteAccountQuestion")}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {t('profile.deleteAccountList', { returnObjects: true }).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              {/* <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>Delete all your financial records</li>
                <li>Remove all budgets and settings</li>
                <li>Cancel any recurring transactions</li>
                <li>Permanently erase your account data</li>
              </ul> */}

              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-secondary">
                  {t("common.cancel")}
                </button>
                <button onClick={handleDeleteAccount} className="flex-1 btn-danger">
                  {t("profile.yesDelete")}
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