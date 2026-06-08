import React from 'react';
import { Trash2, Calendar, FileText, Music, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UploadedPlaylist } from '@/types';
import { useUploadStore } from '@/store/useUploadStore';
import { formatDuration } from '@/utils/playlistParser';

interface UploadedPlaylistListProps {
  onSelect?: (playlist: UploadedPlaylist) => void;
}

export const UploadedPlaylistList: React.FC<UploadedPlaylistListProps> = ({ onSelect }) => {
  const navigate = useNavigate();
  const { uploadedPlaylists, removeUploadedPlaylist } = useUploadStore();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个歌单吗？')) {
      removeUploadedPlaylist(id);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (uploadedPlaylists.length === 0) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-neon-pink" />
          已上传歌单
          <span className="text-sm font-normal text-white/40">({uploadedPlaylists.length})</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uploadedPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => {
              if (onSelect) {
                onSelect(playlist);
              } else {
                navigate(`/playlist/${playlist.id}`);
              }
            }}
            className="group glass-card rounded-2xl p-4 cursor-pointer hover:border-neon-pink/30 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate group-hover:text-neon-pink transition-colors">
                  {playlist.name}
                </h4>
                <div className="flex items-center gap-1 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-neon-purple/20 text-neon-purple text-xs font-medium">
                    {playlist.format.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-white/50">
                  <span className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    {playlist.songIds.length} 首
                  </span>
                  {playlist.totalDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(playlist.totalDuration)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/30">
                  <Calendar className="w-3 h-3" />
                  {formatDate(playlist.uploadTime)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-white/40 truncate flex-1 mr-2">
                {playlist.originalFileName}
              </p>
              <button
                onClick={(e) => handleDelete(e, playlist.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                title="删除歌单"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
