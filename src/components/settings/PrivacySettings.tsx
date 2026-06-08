import React from 'react';
import { Shield, Eye, EyeOff, Globe, Users, UserX, MessageSquare, BarChart3, Heart, ListMusic, Clock, AlertTriangle } from 'lucide-react';
import { SettingsSection, SettingsItem, Toggle, Select } from './index';
import { useSettings } from '@/store/useSettingsStore';

export const PrivacySettings: React.FC = () => {
  const { privacy, setPrivacy } = useSettings();

  const visibilityOptions = [
    { value: 'public', label: '公开', description: '所有人可见' },
    { value: 'followers', label: '仅粉丝', description: '只有您的粉丝可见' },
    { value: 'private', label: '仅自己', description: '只有您自己可见' },
  ];

  const messageOptions = [
    { value: 'everyone', label: '所有人', description: '任何人都可以给您发消息' },
    { value: 'followers', label: '仅粉丝', description: '只有您的粉丝可以发消息' },
    { value: 'no_one', label: '不接收', description: '不接收任何人的消息' },
  ];

  return (
    <div className="space-y-6">
      <SettingsSection title="个人资料可见性" icon={<Globe className="w-5 h-5 text-neon-cyan" />}>
        <SettingsItem
          title="个人主页可见性"
          description="控制谁可以查看您的个人主页"
        >
          <div className="w-56">
            <Select
              value={privacy.profileVisibility}
              onChange={(value) =>
                setPrivacy({
                  profileVisibility: value as 'public' | 'followers' | 'private',
                })}
              options={visibilityOptions}
            />
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示在线状态"
          description="让其他人看到您是否在线"
        >
          <div className="flex items-center gap-3">
            <Toggle
              checked={privacy.showOnlineStatus}
              onChange={(value) => setPrivacy({ showOnlineStatus: value })}
            />
            {privacy.showOnlineStatus ? (
              <Eye className="w-4 h-4 text-green-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-white/40" />
            )}
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示收听历史"
          description="让其他人看到您最近在听什么"
        >
          <div className="flex items-center gap-3">
            <Toggle
              checked={privacy.showListeningHistory}
              onChange={(value) => setPrivacy({ showListeningHistory: value })}
            />
            <Clock className="w-4 h-4 text-white/40" />
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示收藏"
          description="让其他人看到您收藏的歌曲"
        >
          <div className="flex items-center gap-3">
            <Toggle
              checked={privacy.showFavorites}
              onChange={(value) => setPrivacy({ showFavorites: value })}
            />
            <Heart className="w-4 h-4 text-white/40" />
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示歌单"
          description="让其他人看到您创建的歌单"
        >
          <div className="flex items-center gap-3">
            <Toggle
              checked={privacy.showPlaylists}
              onChange={(value) => setPrivacy({ showPlaylists: value })}
            />
            <ListMusic className="w-4 h-4 text-white/40" />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="消息设置" icon={<MessageSquare className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="谁可以给您发消息"
          description="控制可以向您发送私人消息的用户"
        >
          <div className="w-56">
            <Select
              value={privacy.allowMessages}
              onChange={(value) =>
                setPrivacy({
                  allowMessages: value as 'everyone' | 'followers' | 'no_one',
                })}
              options={messageOptions}
            />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="数据与个性化" icon={<BarChart3 className="w-5 h-5 text-neon-purple" />}>
        <div className="mb-4 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80 font-medium">数据使用说明</p>
              <p className="text-sm text-white/60 mt-1">
                我们使用您的数据来提供个性化的音乐推荐和改善服务体验。您可以随时更改这些设置。
              </p>
            </div>
          </div>
        </div>

        <SettingsItem
          title="允许数据收集"
          description="收集使用数据以帮助我们改进产品"
        >
          <Toggle
            checked={privacy.allowDataCollection}
            onChange={(value) => setPrivacy({ allowDataCollection: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="个性化推荐"
          description="基于您的收听习惯提供个性化推荐"
        >
          <Toggle
            checked={privacy.personalizedRecommendations}
            onChange={(value) => setPrivacy({ personalizedRecommendations: value })}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="内容过滤" icon={<Shield className="w-5 h-5 text-neon-cyan" />}>
        <div className="mb-4 p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-neon-pink shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80 font-medium">内容警告</p>
              <p className="text-sm text-white/60 mt-1">
                部分歌曲可能包含露骨歌词，您可以选择是否屏蔽这些内容。
              </p>
            </div>
          </div>
        </div>

        <SettingsItem
          title="允许显示含露骨内容的歌曲"
          description="显示带有 Explicit 标记的歌曲"
        >
          <Toggle
            checked={privacy.explicitContent}
            onChange={(value) => setPrivacy({ explicitContent: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="屏蔽露骨内容"
          description="自动过滤含有露骨内容的歌曲"
        >
          <Toggle
            checked={privacy.blockExplicit}
            onChange={(value) => setPrivacy({ blockExplicit: value })}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="社交设置" icon={<Users className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="允许被关注"
          description="允许其他用户关注您的账号"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>

        <SettingsItem
          title="显示粉丝列表"
          description="让其他人看到您的粉丝列表"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>

        <SettingsItem
          title="显示关注列表"
          description="让其他人看到您关注的用户"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="账户安全" icon={<Shield className="w-5 h-5 text-neon-purple" />}>
        <SettingsItem
          title="两步验证"
          description="为账户添加额外的安全保护"
        >
          <span className="px-3 py-1 bg-neon-pink/20 text-neon-pink text-xs rounded-full">
            未启用
          </span>
        </SettingsItem>

        <SettingsItem
          title="登录设备管理"
          description="查看和管理已登录的设备"
        >
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            管理
          </button>
        </SettingsItem>

        <SettingsItem
          title="活动日志"
          description="查看账户的登录和活动记录"
        >
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            查看
          </button>
        </SettingsItem>

        <SettingsItem
          title="下载我的数据"
          description="导出您的所有个人数据"
        >
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            导出
          </button>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="屏蔽列表" icon={<UserX className="w-5 h-5 text-neon-pink" />}>
        <p className="text-white/50 text-sm mb-4">
          被屏蔽的用户将无法关注您或与您互动
        </p>
        <SettingsItem title="已屏蔽的用户">
          <span className="text-white/60">暂无屏蔽的用户</span>
        </SettingsItem>
      </SettingsSection>
    </div>
  );
};

const Info: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);
