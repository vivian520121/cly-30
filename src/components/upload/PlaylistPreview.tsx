import React from 'react';
import { Music, Clock, Disc3, Save, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ParsedPlaylist, ParsedPlaylistTrack, Song } from '@/types';
import { useUploadStore } from '@/store/useUploadStore';
import { formatDuration } from '@/utils/playlistParser';
import { mockSongs } from '@/data/songs';

interface PlaylistPreviewProps {
  playlist: ParsedPlaylist;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

const findMatchingSong = (track: ParsedPlaylistTrack): Song | undefined => {
  return mockSongs.find(
    (song) =>
      song.title.toLowerCase().includes(track.title.toLowerCase()) ||
      track.title.toLowerCase().includes(song.title.toLowerCase()) ||
      (song.artist.toLowerCase().includes(track.artist.toLowerCase()) &&
        track.artist.toLowerCase() !== '未知艺术家')
  );
};

export const PlaylistPreview: React.FC<PlaylistPreviewProps> = ({
  playlist,
  onSave,
  onReset,
  isSaving,
}) => {
  const navigate = useNavigate();
  const { selectedFile } = useUploadStore();

  const formatTotalDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '未知';
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  };

  const matchedCount = playlist.tracks.filter((track) => findMatchingSong(track)).length;

  return (
    <div className="animate-slide-up">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-purple neon-glow-pink">
              <Disc3 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold gradient-text">{playlist.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  {playlist.tracks.length} 首歌曲
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTotalDuration(playlist.totalDuration)}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neon-cyan/20 text-neon-cyan text-xs font-medium">
                  {playlist.format.toUpperCase()}
                </span>
                {matchedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-medium">
                    已匹配 {matchedCount} 首
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl glass-card text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              重新上传
            </button>
            <button
              onClick={onSave}
              disabled={isSaving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-neon-pink/30 transition-all btn-hover disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '保存中...' : '保存歌单'}
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <Music className="w-4 h-4 text-neon-pink" />
              歌曲列表
            </h4>
            {selectedFile && (
              <span className="text-xs text-white/40">
                来源文件：{selectedFile.name}
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto space-y-1 pr-2">
            {playlist.tracks.map((track, index) => {
              const matchedSong = findMatchingSong(track);
              return (
                <div
                  key={index}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => {
                    if (matchedSong) {
                      navigate(`/song/${matchedSong.id}`);
                    }
                  }}
                >
                  <span className="w-8 text-center text-white/30 text-sm font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>

                  {matchedSong ? (
                    <img
                      src={matchedSong.coverUrl}
                      alt={track.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                      <Music className="w-5 h-5 text-white/30" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-medium truncate ${
                        matchedSong ? 'text-white group-hover:text-neon-pink' : 'text-white/70'
                      } transition-colors`}
                    >
                      {track.title}
                      {matchedSong && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-normal">
                          已匹配
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-white/50 truncate">
                      {track.artist}
                      {track.album && <span className="text-white/30"> · {track.album}</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    {track.duration && (
                      <span className="text-sm text-white/40 font-mono">
                        {formatDuration(track.duration)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
