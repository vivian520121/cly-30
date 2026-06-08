import React from 'react';
import { Bell, Volume2, Monitor, Mail, Calendar, Music, Disc, User, Settings, Megaphone } from 'lucide-react';
import { SettingsSection, SettingsItem, Toggle, Slider } from './index';
import { useSettings } from '@/store/useSettingsStore';
import { NotificationType } from '@/types';

export const NotificationSettings: React.FC = () => {
  const { notifications, setNotifications, updateNotificationType } = useSettings();

  const notificationTypeIcons: Record<NotificationType, React.ReactNode> = {
    song: <Music className="w-4 h-4" />,
    playlist: <Disc className="w-4 h-4" />,
    artist: <User className="w-4 h-4" />,
    system: <Settings className="w-4 h-4" />,
    marketing: <Megaphone className="w-4 h-4" />,
  };

  const notificationTypeLabels: Record<NotificationType, { title: string; description: string }> = {
    song: { title: '新歌推荐', description: '当有您关注的歌手发布新歌时通知您' },
    playlist: { title: '歌单更新', description: '当收藏的歌单有更新时通知您' },
    artist: { title: '歌手动态', description: '当关注的歌手有新动态时通知您' },
    system: { title: '系统通知', description: '接收系统维护、功能更新等通知' },
    marketing: { title: '营销推送', description: '接收活动促销、会员优惠等信息' },
  };

  return (
    <div className="space-y-6">
      <SettingsSection title="通知总开关" icon={<Bell className="w-5 h-5 text-neon-cyan" />}>
        <SettingsItem
          title="启用通知"
          description="开启后将接收所有类型的通知"
        >
          <Toggle
            checked={notifications.enabled}
            onChange={(value) => setNotifications({ enabled: value })}
            size="lg"
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="通知方式" icon={<Monitor className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="桌面通知"
          description="在系统桌面显示通知弹窗"
        >
          <Toggle
            checked={notifications.desktopNotifications && notifications.enabled}
            onChange={(value) => setNotifications({ desktopNotifications: value })}
            disabled={!notifications.enabled}
          />
        </SettingsItem>

        <SettingsItem
          title="通知声音"
          description="接收通知时播放提示音"
        >
          <Toggle
            checked={notifications.soundEnabled && notifications.enabled}
            onChange={(value) => setNotifications({ soundEnabled: value })}
            disabled={!notifications.enabled}
          />
        </SettingsItem>

        <SettingsItem
          title="邮件通知"
          description="将重要通知发送到您的邮箱"
        >
          <Toggle
            checked={notifications.emailNotifications && notifications.enabled}
            onChange={(value) => setNotifications({ emailNotifications: value })}
            disabled={!notifications.enabled}
          />
        </SettingsItem>

        <SettingsItem
          title="每周摘要"
          description="每周发送收听报告和个性化推荐"
        >
          <div className="flex items-center gap-4">
            <Toggle
              checked={notifications.weeklyDigest && notifications.enabled}
              onChange={(value) => setNotifications({ weeklyDigest: value })}
              disabled={!notifications.enabled}
            />
            <Mail className="w-4 h-4 text-white/40" />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="通知类型" icon={<Bell className="w-5 h-5 text-neon-purple" />}>
        <p className="text-white/50 text-sm mb-4">
          选择您希望接收的通知类型
        </p>
        {(Object.keys(notificationTypeLabels) as NotificationType[]).map((type) => (
          <SettingsItem
            key={type}
            title={
              <span className="flex items-center gap-2">
                {notificationTypeIcons[type]}
                {notificationTypeLabels[type].title}
              </span>
            }
            description={notificationTypeLabels[type].description}
          >
            <Toggle
              checked={notifications.types[type] && notifications.enabled}
              onChange={(value) => updateNotificationType(type, value)}
              disabled={!notifications.enabled}
            />
          </SettingsItem>
        ))}
      </SettingsSection>

      <SettingsSection title="勿扰模式" icon={<Calendar className="w-5 h-5 text-neon-cyan" />}>
        <SettingsItem
          title="启用勿扰模式"
          description="在指定时间段内不显示通知"
        >
          <Toggle
            checked={notifications.doNotDisturb && notifications.enabled}
            onChange={(value) => setNotifications({ doNotDisturb: value })}
            disabled={!notifications.enabled}
          />
        </SettingsItem>

        {notifications.doNotDisturb && notifications.enabled && (
          <>
            <SettingsItem
              title="开始时间"
              description="勿扰模式开始时间"
            >
              <div className="w-40">
                <input
                  type="time"
                  value={notifications.doNotDisturbStart}
                  onChange={(e) => setNotifications({ doNotDisturbStart: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
            </SettingsItem>

            <SettingsItem
              title="结束时间"
              description="勿扰模式结束时间"
            >
              <div className="w-40">
                <input
                  type="time"
                  value={notifications.doNotDisturbEnd}
                  onChange={(e) => setNotifications({ doNotDisturbEnd: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                />
              </div>
            </SettingsItem>
          </>
        )}
      </SettingsSection>

      <SettingsSection title="通知预览" icon={<Volume2 className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="通知音量"
          description="调整通知提示音的音量大小"
        >
          <div className="w-64">
            <Slider
              value={80}
              onChange={() => {}}
              min={0}
              max={100}
              unit="%"
              disabled={!notifications.enabled || !notifications.soundEnabled}
            />
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示预览"
          description="通知中显示内容预览"
        >
          <Toggle
            checked={true}
            onChange={() => {}}
            disabled={!notifications.enabled}
          />
        </SettingsItem>

        <SettingsItem
          title="通知保留时间"
          description="通知在屏幕上显示的时长"
        >
          <div className="w-40">
            <select
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              disabled={!notifications.enabled}
            >
              <option value="5">5 秒</option>
              <option value="10">10 秒</option>
              <option value="15">15 秒</option>
              <option value="-1">直到手动关闭</option>
            </select>
          </div>
        </SettingsItem>
      </SettingsSection>
    </div>
  );
};
