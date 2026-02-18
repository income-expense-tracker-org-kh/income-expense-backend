import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Globe,
  ChevronDown,
  Loader2,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../constants';
import toast from 'react-hot-toast';
import logo from "../../assets/logo.png";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(null);
  
  const { user, logout, role, hasPermission } = useAuthStore();
  const { theme, setTheme, language, setLanguage } = useSettingsStore();
  const { t, changeLanguage } = useTranslation(language);

  // Sample notifications
  const [notifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert',
      message: 'You have exceeded 90% of your Food budget',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Bill Reminder',
      message: 'Rent payment due in 3 days',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Income Added',
      message: 'Monthly salary has been recorded',
      time: '2 hours ago',
      read: true,
    },
  ]);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('nav.dashboard'), permission: 'read' },
    { path: '/income', icon: TrendingUp, label: t('nav.income'), permission: 'write' },
    { path: '/expense', icon: TrendingDown, label: t('nav.expense'), permission: 'write' },
    { path: '/budget', icon: Wallet, label: t('nav.budget'), permission: 'write' },
    { path: '/reports', icon: BarChart3, label: t('nav.reports'), permission: 'read' },
    { path: '/transactions', icon: Receipt, label: t('nav.transactions'), permission: 'read' },
  ];

  const handleLogout = () => {
    logout();
    toast.success(t('notifications.success.loggedOut'));
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(t('notifications.success.themeChanged', { mode: newTheme }));
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    changeLanguage(langCode);
    setLanguageMenuOpen(false);
    toast.success(t('notifications.success.languageUpdated'));
  };

  const handleMenuClick = (path) => {
    setLoadingMenu(path);
    setSidebarOpen(false);
    setTimeout(() => {
      navigate(path);
      setLoadingMenu(null);
    }, 300);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-menu') && profileMenuOpen) {
        setProfileMenuOpen(false);
      }
      if (!event.target.closest('.notification-menu') && notificationMenuOpen) {
        setNotificationMenuOpen(false);
      }
      if (!event.target.closest('.language-menu') && languageMenuOpen) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen, notificationMenuOpen, languageMenuOpen]);

  // Filter menu items based on role permissions
  const filteredMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'success':
        return <Check className="text-green-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const currentLanguage = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <img src={logo} alt="FinTracker Logo" className="h-50 w-50" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isLoading = loadingMenu === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleMenuClick(item.path)}
                  disabled={isLoading}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Icon size={20} />
                  )}
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Menu */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User size={20} />
              <span className="font-medium">{t('nav.profile')}</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">{t('nav.settings')}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 ml-4 lg:ml-0">
                {filteredMenuItems.find((item) => item.path === location.pathname)?.label || t('nav.dashboard')}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language Switcher */}
              <div className="relative language-menu">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Globe size={20} />
                  <span className="hidden sm:inline text-sm font-medium">{currentLanguage.flag}</span>
                  <ChevronDown size={16} />
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          language === lang.code ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="font-medium">{lang.name}</span>
                        </span>
                        {language === lang.code && <Check size={18} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              {/* Notifications */}
              <div className="relative notification-menu">
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors relative rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{notification.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative profile-menu">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {role || 'user'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-700">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded">
                        {role || 'user'}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <User size={18} />
                      <span>{t('nav.profile')}</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings size={18} />
                      <span>{t('nav.settings')}</span>
                    </Link>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
