import React, { useEffect } from 'react';
import { CheckCircle2, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessToastProps {
  playlistName: string;
  playlistId: string;
  onClose: () => void;
  duration?: number;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  playlistName,
  playlistId,
  onClose,
  duration = 5000,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleViewPlaylist = () => {
    navigate(`/playlist/${playlistId}`);
    onClose();
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 animate-slide-up">
      <div className="glass-card rounded-2xl p-4 bg-green-500/10 border border-green-500/30 shadow-2xl shadow-green-500/20 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-green-400 font-medium">上传成功！</p>
            <p className="text-sm text-white/70 mt-1 truncate">
              歌单「{playlistName}」已成功保存
            </p>
            <button
              onClick={handleViewPlaylist}
              className="mt-2 text-xs text-neon-cyan hover:text-white flex items-center gap-1 transition-colors"
            >
              查看歌单
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/50 hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
