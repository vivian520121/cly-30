import React, { useState } from 'react';
import { RotateCcw, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PreferenceSettings } from '@/components/settings/PreferenceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { Button } from '@/components/settings';
import { SettingsSection as SettingsSectionType } from '@/types';
import { useSettings } from '@/store/useSettingsStore';
import { showToast } from '@/store/useToastStore';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SettingsSectionType>('account');
  const { saveSettings, resetToDefaults, isLoading, lastSaved } = useSettings();

  const handleSave = async () => {
    await saveSettings();
  };

  const handleReset = () => {
    if (window.confirm('确定要将所有设置恢复为默认值吗？')) {
      resetToDefaults();
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '尚未保存';
    return new Date(lastSaved).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'account':
        return <AccountSettings />;
      case 'preferences':
        return <PreferenceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'privacy':
        return <PrivacySettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">返回首页</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">设置</h1>
            <p className="text-white/50">自定义您的应用体验</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SettingsSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div className="flex-1 min-w-0">
            <div className="sticky top-0 z-10 bg-bg-primary/80 backdrop-blur-xl border-b border-white/5 mb-6 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-white/40">
                  上次保存：{formatLastSaved()}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleReset}
                    size="sm"
                  >
                    <RotateCcw className="w-4 h-4" /> 恢复默认
                  </Button>
                  <Button
                    onClick={handleSave}
                    loading={isLoading}
                    size="sm"
                  >
                    <Save className="w-4 h-4" /> 保存设置
                  </Button>
                </div>
              </div>
            </div>

            <div className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-white/30">
            版本 v1.0.0 | © 2024 音乐播放器
          </p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
              onClick={() => showToast('info', '这是一个演示版本')}
            >
              关于我们
            </button>
            <button
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
              onClick={() => showToast('info', '用户协议')}
            >
              用户协议
            </button>
            <button
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
              onClick={() => showToast('info', '隐私政策')}
            >
              隐私政策
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
