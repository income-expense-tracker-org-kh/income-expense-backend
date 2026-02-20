import React, { useState, useEffect } from 'react';
import { Globe, DollarSign, Calendar, Download, Upload, Trash2, RefreshCw, Bell, Palette, Database, Shield } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTransactionStore } from '../../store/transactionStore';
import { useBudgetStore } from '../../store/budgetStore';
import { CURRENCIES, LANGUAGES, DATE_FORMATS } from '../../constants';
import toast from 'react-hot-toast';
import useTranslation from '../../hooks/useTranslation';
import ConfirmModal from '../../components/Common/ConfirmModal';
import { useConfirm } from '../../hooks/useConfirm';

// ======== Skeleton Primitives =======

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} />
);

const SkeletonText = ({ width = 'w-full', height = 'h-4' }) => (
  <Skeleton className={`${width} ${height}`} />
);

// ======= Section Skeleton Variants ======

const GeneralSkeleton = () => (
  <div className="card space-y-8">
    <SkeletonText width="w-40" height="h-6" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        <SkeletonText width="w-32" height="h-4" />
        <Skeleton className="w-full h-11 rounded-lg" />
        <SkeletonText width="w-64" height="h-3" />
      </div>
    ))}
  </div>
);

const AppearanceSkeleton = () => (
  <div className="card space-y-6">
    <SkeletonText width="w-32" height="h-6" />
    <div className="space-y-2">
      <SkeletonText width="w-24" height="h-4" />
      <div className="grid grid-cols-2 gap-4 mt-2">
        {[1, 2].map((i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
      </div>
    </div>
    <div className="space-y-2">
      <SkeletonText width="w-28" height="h-4" />
      <div className="grid grid-cols-4 gap-4 mt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full h-16 rounded-lg" />
            <SkeletonText width="w-3/4" height="h-3" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NotificationsSkeleton = () => (
  <div className="card space-y-4">
    <SkeletonText width="w-48" height="h-6" />
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="space-y-2 flex-1">
          <SkeletonText width="w-36" height="h-4" />
          <SkeletonText width="w-56" height="h-3" />
        </div>
        <Skeleton className="w-5 h-5 rounded ml-4" />
      </div>
    ))}
  </div>
);

const DataSkeleton = () => (
  <div className="space-y-6">
    <div className="card space-y-4">
      <SkeletonText width="w-40" height="h-6" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5 rounded" />
              <SkeletonText width="w-28" height="h-4" />
            </div>
            <SkeletonText width="w-64" height="h-3" />
          </div>
          <Skeleton className="w-20 h-9 rounded-lg ml-4" />
        </div>
      ))}
    </div>
    <div className="card space-y-4">
      <SkeletonText width="w-44" height="h-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
      </div>
    </div>
  </div>
);

const SecuritySkeleton = () => (
  <div className="card space-y-4">
    <SkeletonText width="w-40" height="h-6" />
    {[1, 2].map((i) => (
      <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2">
        <SkeletonText width="w-28" height="h-5" />
        <SkeletonText width="w-full" height="h-3" />
        <SkeletonText width="w-4/5" height="h-3" />
      </div>
    ))}
    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
      <SkeletonText width="w-36" height="h-5" />
      <SkeletonText width="w-full" height="h-3" />
      <div className="flex items-center gap-4 mt-2">
        <Skeleton className="flex-1 h-11 rounded-lg" />
        <Skeleton className="w-20 h-11 rounded-lg" />
      </div>
    </div>
  </div>
);

const NavSkeleton = () => (
  <div className="card">
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="w-16 h-3 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const skeletonMap = {
  general: GeneralSkeleton,
  appearance: AppearanceSkeleton,
  notifications: NotificationsSkeleton,
  data: DataSkeleton,
  security: SecuritySkeleton,
};

// ======= Main Component =======

const Settings = () => {
  const {
    currency, setCurrency,
    language, setLanguage,
    theme, setTheme,
    dateFormat, setDateFormat,
    notifications, updateNotifications,
    resetSettings
  } = useSettingsStore();

  const { transactions, setTransactions } = useTransactionStore();
  const { budgets, setBudgets } = useBudgetStore();
  const { t } = useTranslation(language);
  const { confirm, confirmProps } = useConfirm(); // ← useConfirm hook
  const [activeSection, setActiveSection] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSectionLoading, setIsSectionLoading] = useState(false);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Skeleton on section switch
  const handleSectionChange = (sectionId) => {
    if (sectionId === activeSection) return;
    setIsSectionLoading(true);
    setActiveSection(sectionId);
    const timer = setTimeout(() => setIsSectionLoading(false), 500);
    return () => clearTimeout(timer);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
  ];

  const handleExportAllData = () => {
    const exportData = {
      transactions, budgets,
      settings: { currency, language, theme, dateFormat, notifications },
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
    toast.success(t('notifications.success.dataExported'));
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          if (importedData.transactions) setTransactions(importedData.transactions);
          if (importedData.budgets) setBudgets(importedData.budgets);
          if (importedData.settings) {
            const { currency, language, theme, dateFormat, notifications } = importedData.settings;
            if (currency) setCurrency(currency);
            if (language) setLanguage(language);
            if (theme) setTheme(theme);
            if (dateFormat) setDateFormat(dateFormat);
            if (notifications) updateNotifications(notifications);
          }
          toast.success(t('notifications.success.dataImported'));
        } catch {
          toast.error(t('notifications.error.importFailed'));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = async () => {
    const ok = await confirm({
      title: t('notifications.confirm.clearAllData'),
      message: "",
      confirmText: t('common.delete') || 'Delete',
      cancelText: t('common.cancel') || 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    setTransactions([]);
    setBudgets([]);
    toast.success(t('notifications.success.dataClear'));
  };

  const handleResetSettings = async () => {
    const ok = await confirm({
      title: t('notifications.confirm.resetSettings'),
      message: "",
      confirmText: t('common.delete') || 'Delete',
      cancelText: t('common.cancel') || 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    resetSettings();
    toast.success(t('notifications.success.settingsReset'));
  };

  const SectionSkeleton = skeletonMap[activeSection];
  const showSkeleton = isLoading || isSectionLoading;

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div>
        {isLoading ? (
          <div className="space-y-2">
            <SkeletonText width="w-32" height="h-8" />
            <SkeletonText width="w-64" height="h-4" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t("settings.title")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t("settings.subtitle")}</p>
          </>
        )}
      </div>

      {/* Section Navigation */}
      {isLoading ? (
        <NavSkeleton />
      ) : (
        <div className="card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(section.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-sm font-medium">{t(`settings.${section.id}`)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Content */}
      {showSkeleton ? (
        <SectionSkeleton />
      ) : (
        <>
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("settings.generalSettings")}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="label">{t("settings.defaultCurrency")}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select value={currency} onChange={(e) => { setCurrency(e.target.value); toast.success('Currency updated'); }} className="input-field pl-10">
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.code}>{curr.symbol} {curr.code} - {curr.name}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("settings.currencyHelp")}</p>
                  </div>
                  <div>
                    <label className="label">{t("profile.language")}</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select value={language} onChange={(e) => { setLanguage(e.target.value); toast.success('Language updated'); }} className="input-field pl-10">
                        {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("settings.languageHelp")}</p>
                  </div>
                  <div>
                    <label className="label">{t("settings.dateFormat")}</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <select value={dateFormat} onChange={(e) => { setDateFormat(e.target.value); toast.success('Date format updated'); }} className="input-field pl-10">
                        {DATE_FORMATS.map((format) => (
                          <option key={format.value} value={format.value}>{format.label}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("settings.dateFormatHelp")}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("settings.appearanceSettings")}</h3>
                <div className="space-y-6">
                  <div>
                    <label className="label">{t("settings.themeMode")}</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <button onClick={() => { setTheme('light'); toast.success('Theme changed to Light'); }} className={`p-6 border-2 rounded-lg transition-all ${theme === 'light' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                        <div className="text-center">
                          <div className="text-4xl mb-3">☀️</div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{t("settings.lightMode")}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("settings.lightModeDesc")}</div>
                        </div>
                      </button>
                      <button onClick={() => { setTheme('dark'); toast.success('Theme changed to Dark'); }} className={`p-6 border-2 rounded-lg transition-all ${theme === 'dark' ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                        <div className="text-center">
                          <div className="text-4xl mb-3">🌙</div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">{t("settings.darkMode")}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t("settings.darkModeDesc")}</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">{t("settings.colorPreview")}</label>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="text-center"><div className="w-full h-16 bg-primary-600 rounded-lg mb-2"></div><span className="text-xs text-gray-600 dark:text-gray-400">{t("settings.primary")}</span></div>
                      <div className="text-center"><div className="w-full h-16 bg-income rounded-lg mb-2"></div><span className="text-xs text-gray-600 dark:text-gray-400">{t("settings.income")}</span></div>
                      <div className="text-center"><div className="w-full h-16 bg-expense rounded-lg mb-2"></div><span className="text-xs text-gray-600 dark:text-gray-400">{t("settings.expense")}</span></div>
                      <div className="text-center"><div className="w-full h-16 bg-gray-500 rounded-lg mb-2"></div><span className="text-xs text-gray-600 dark:text-gray-400">{t("settings.neutral")}</span></div>
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
                <h3 className="text-lg font-semibold mb-6">{t("settings.notificationSettings")}</h3>
                  <div>
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

          {/* Data Management */}
          {activeSection === 'data' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-6">{t("settings.dataManagementSettings")}</h3>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><Download className="text-primary-600" size={20} /><h4 className="font-semibold text-gray-800 dark:text-gray-200">{t("settings.exportData")}</h4></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.exportDataDesc")}</p>
                      </div>
                      <button onClick={handleExportAllData} className="btn-primary ml-4">{t("settings.export")}</button>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><Upload className="text-blue-600" size={20} /><h4 className="font-semibold text-gray-800 dark:text-gray-200">{t("settings.importData")}</h4></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.importDataDesc")}</p>
                      </div>
                      <label className="btn-secondary ml-4 cursor-pointer">{t("settings.import")}<input type="file" accept=".json" onChange={handleImportData} className="hidden" /></label>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-yellow-200 dark:border-yellow-900 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><RefreshCw className="text-yellow-600" size={20} /><h4 className="font-semibold text-gray-800 dark:text-gray-200">{t("settings.resetSettings")}</h4></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.resetSettingsDesc")}</p>
                      </div>
                      <button onClick={handleResetSettings} className="btn-secondary ml-4">{t("settings.reset")}</button>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-red-200 dark:border-red-900 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2"><Trash2 className="text-red-600" size={20} /><h4 className="font-semibold text-red-600 dark:text-red-400">{t("settings.clearAllData")}</h4></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.clearAllDataDesc")}</p>
                      </div>
                      <button onClick={handleClearAllData} className="btn-danger ml-4">{t("settings.clearData")}</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">{t("settings.storageInfo")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">{t("settings.transactions")}</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{transactions.length}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">{t("settings.budgets")}</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{budgets.length}</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">{t("settings.storageUsed")}</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {(JSON.stringify({ transactions, budgets }).length / 1024).toFixed(2)} KB
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
                <h3 className="text-lg font-semibold mb-6">{t("settings.securitySettings")}</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("settings.dataStorage")}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.dataStorageDesc")}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("settings.privacy")}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.privacyDesc")}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t("settings.sessionSecurity")}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t("settings.sessionSecurityDesc")}</p>
                    <div className="flex items-center gap-4">
                      <select className="input-field flex-1">
                        <option value="never">{t("settings.never")}</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                      <button className="btn-primary">{t("settings.apply")}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
    {/* ====== Global Confirm Modal ====== */ }
    <ConfirmModal {...confirmProps} />
    </>
  );
};

export default Settings;