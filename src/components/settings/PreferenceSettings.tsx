import React from 'react';
import { Palette, Volume2, Music, Globe, Monitor, Zap } from 'lucide-react';
import { SettingsSection, SettingsItem, Toggle, Slider, Select } from './index';
import { useSettings } from '@/store/useSettingsStore';
import { Theme, Language, AudioQuality } from '@/types';

export const PreferenceSettings: React.FC = () => {
  const { preferences, setPreferences } = useSettings();

  const themeOptions: { value: Theme; label: string; description: string }[] = [
    { value: 'dark', label: '深色模式', description: '使用深色主题，保护眼睛' },
    { value: 'light', label: '浅色模式', description: '使用浅色主题，明亮清晰' },
    { value: 'auto', label: '跟随系统', description: '根据系统设置自动切换' },
  ];

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en-US', label: 'English' },
    { value: 'ja-JP', label: '日本語' },
  ];

  const qualityOptions: { value: AudioQuality; label: string; description: string }[] = [
    { value: 'low', label: '低音质', description: '128kbps，流量最省' },
    { value: 'standard', label: '标准音质', description: '320kbps，平衡音质与流量' },
    { value: 'high', label: '高音质', description: '1024kbps，享受高品质音乐' },
    { value: 'lossless', label: '无损音质', description: 'FLAC，发烧级音质体验' },
  ];

  return (
    <div className="space-y-6">
      <SettingsSection title="外观设置" icon={<Palette className="w-5 h-5 text-neon-cyan" />}>
        <SettingsItem title="主题模式" description="选择您喜欢的界面主题">
          <div className="w-56">
            <Select
              value={preferences.theme}
              onChange={(value) => setPreferences({ theme: value as Theme })}
              options={themeOptions}
            />
          </div>
        </SettingsItem>

        <SettingsItem title="语言" description="选择应用显示语言">
          <div className="w-56">
            <Select
              value={preferences.language}
              onChange={(value) => setPreferences({ language: value as Language })}
              options={languageOptions}
            />
          </div>
        </SettingsItem>

        <SettingsItem
          title="显示音频频谱"
          description="在播放界面显示动态音频频谱效果"
        >
          <Toggle
            checked={preferences.showSpectrum}
            onChange={(value) => setPreferences({ showSpectrum: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="歌词字体大小"
          description="调整歌词显示的字体大小"
        >
          <div className="w-64">
            <Slider
              value={preferences.lyricsFontSize}
              onChange={(value) => setPreferences({ lyricsFontSize: value })}
              min={12}
              max={32}
              unit="px"
            />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="播放设置" icon={<Music className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="自动播放"
          description="应用启动时自动继续上次的播放"
        >
          <Toggle
            checked={preferences.autoPlay}
            onChange={(value) => setPreferences({ autoPlay: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="音频质量"
          description="选择在线播放的音频质量"
        >
          <div className="w-56">
            <Select
              value={preferences.audioQuality}
              onChange={(value) => setPreferences({ audioQuality: value as AudioQuality })}
              options={qualityOptions}
            />
          </div>
        </SettingsItem>

        <SettingsItem
          title="音量增强"
          description="提升最大音量上限（可能影响音质）"
        >
          <Toggle
            checked={preferences.volumeBoost}
            onChange={(value) => setPreferences({ volumeBoost: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="淡入淡出"
          description="歌曲切换时平滑过渡"
        >
          <Toggle
            checked={preferences.crossfade}
            onChange={(value) => setPreferences({ crossfade: value })}
          />
        </SettingsItem>

        {preferences.crossfade && (
          <SettingsItem
            title="淡入淡出时长"
            description="设置歌曲过渡的时间长度"
          >
            <div className="w-64">
              <Slider
                value={preferences.crossfadeDuration}
                onChange={(value) => setPreferences({ crossfadeDuration: value })}
                min={1}
                max={15}
                unit="秒"
              />
            </div>
          </SettingsItem>
        )}

        <SettingsItem
          title="显示歌词"
          description="播放时自动显示歌曲歌词"
        >
          <Toggle
            checked={preferences.lyricsDisplay}
            onChange={(value) => setPreferences({ lyricsDisplay: value })}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="系统设置" icon={<Monitor className="w-5 h-5 text-neon-purple" />}>
        <SettingsItem
          title="自动更新"
          description="自动检查并下载应用更新"
        >
          <Toggle
            checked={preferences.autoUpdate}
            onChange={(value) => setPreferences({ autoUpdate: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="最小化到托盘"
          description="关闭窗口时最小化到系统托盘"
        >
          <Toggle
            checked={preferences.minimizeToTray}
            onChange={(value) => setPreferences({ minimizeToTray: value })}
          />
        </SettingsItem>

        <SettingsItem
          title="硬件加速"
          description="使用GPU加速渲染，提升性能"
        >
          <Toggle
            checked={preferences.hardwareAcceleration}
            onChange={(value) => setPreferences({ hardwareAcceleration: value })}
          />
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="音质与音量" icon={<Volume2 className="w-5 h-5 text-neon-cyan" />}>
        <SettingsItem
          title="默认音量"
          description="设置应用启动时的默认音量"
        >
          <div className="w-64">
            <Slider
              value={70}
              onChange={() => {}}
              min={0}
              max={100}
              unit="%"
            />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="国际化" icon={<Globe className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="地区设置"
          description="根据您的地区推荐内容"
        >
          <div className="w-56">
            <Select
              value="CN"
              onChange={() => {}}
              options={[
                { value: 'CN', label: '中国大陆' },
                { value: 'HK', label: '中国香港' },
                { value: 'TW', label: '中国台湾' },
                { value: 'US', label: '美国' },
                { value: 'JP', label: '日本' },
              ]}
            />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="性能" icon={<Zap className="w-5 h-5 text-neon-purple" />}>
        <SettingsItem
          title="动画效果"
          description="启用界面过渡动画效果"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>

        <SettingsItem
          title="图片缓存"
          description="缓存专辑封面等图片，提升加载速度"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>

        <SettingsItem title="缓存大小">
          <span className="text-white/60">256 MB</span>
        </SettingsItem>

        <SettingsItem title="清除缓存">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
            清除
          </button>
        </SettingsItem>
      </SettingsSection>
    </div>
  );
};
