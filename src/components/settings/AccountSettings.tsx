import React, { useState } from 'react';
import { User, Mail, Calendar, LogOut, Trash2, Edit3, Save, Camera } from 'lucide-react';
import { SettingsSection, SettingsItem, Input, Button, Toggle } from './index';
import { useSettings } from '@/store/useSettingsStore';
import { showToast } from '@/store/useToastStore';

export const AccountSettings: React.FC = () => {
  const { account, setAccount, changePassword, logout, deleteAccount, isLoading } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(account.displayName);
  const [bio, setBio] = useState(account.bio);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    if (!displayName.trim()) {
      showToast('error', '昵称不能为空');
      return;
    }
    setAccount({ displayName: displayName.trim(), bio: bio.trim() });
    setIsEditing(false);
    showToast('success', '个人资料已更新');
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('error', '请填写完整的密码信息');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', '两次输入的新密码不一致');
      return;
    }
    const success = await changePassword(oldPassword, newPassword);
    if (success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <SettingsSection title="个人资料" icon={<User className="w-5 h-5 text-neon-cyan" />}>
        <div className="flex items-center gap-6 mb-6 p-4 bg-white/5 rounded-xl">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center text-2xl font-bold text-white">
              {account.displayName.charAt(0).toUpperCase()}
            </div>
            <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="昵称"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="请输入昵称"
                  maxLength={20}
                />
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">个人简介</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 transition-all resize-none"
                    rows={3}
                    placeholder="介绍一下自己吧..."
                  />
                  <p className="mt-1 text-sm text-white/40">{bio.length}/100</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4" /> 保存
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setDisplayName(account.displayName);
                      setBio(account.bio);
                      setIsEditing(false);
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-white">{account.displayName}</h3>
                <p className="text-white/50 mt-1">@{account.username}</p>
                <p className="text-white/60 mt-2">{account.bio}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
                >
                  <Edit3 className="w-3 h-3" /> 编辑资料
                </button>
              </>
            )}
          </div>
        </div>

        <SettingsItem title="用户名" description="用户名唯一且不可修改">
          <span className="text-white/60">@{account.username}</span>
        </SettingsItem>

        <SettingsItem title="邮箱" description="用于接收系统通知">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white/40" />
            <span className="text-white/60">{account.email}</span>
          </div>
        </SettingsItem>

        <SettingsItem title="注册时间">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            <span className="text-white/60">{formatDate(account.createdAt)}</span>
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="修改密码" icon={<Edit3 className="w-5 h-5 text-neon-cyan" />}>
        <div className="space-y-4 max-w-md">
          <Input
            label="原密码"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="请输入原密码"
            showPasswordToggle
          />
          <Input
            label="新密码"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="请输入新密码（至少6位）"
            showPasswordToggle
            hint="密码长度至少6位，建议包含字母和数字"
          />
          <Input
            label="确认新密码"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="请再次输入新密码"
            showPasswordToggle
          />
          <Button onClick={handleChangePassword} loading={isLoading}>
            确认修改
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="账户操作" icon={<User className="w-5 h-5 text-neon-pink" />}>
        <SettingsItem
          title="保持登录状态"
          description="在本机保持登录，下次打开应用无需重新登录"
        >
          <Toggle checked={true} onChange={() => {}} />
        </SettingsItem>

        <div className="pt-4 space-y-4">
          <Button
            variant="secondary"
            fullWidth
            onClick={logout}
            className="justify-center"
          >
            <LogOut className="w-4 h-4" /> 退出登录
          </Button>

          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowDeleteConfirm(true)}
              className="justify-center"
            >
              <Trash2 className="w-4 h-4" /> 删除账户
            </Button>
          ) : (
            <div className="p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl space-y-4">
              <p className="text-sm text-white/70">
                ⚠️ 确定要删除账户吗？此操作不可撤销，您的所有数据将被永久删除。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="danger"
                  onClick={handleDeleteAccount}
                  loading={isLoading}
                  className="flex-1 justify-center"
                >
                  确认删除
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 justify-center"
                >
                  取消
                </Button>
              </div>
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
};
