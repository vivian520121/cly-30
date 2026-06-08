import React, { useState } from 'react';
import { Upload, Music, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FileUploader } from '@/components/upload/FileUploader';
import { PlaylistPreview } from '@/components/upload/PlaylistPreview';
import { SuccessToast } from '@/components/upload/SuccessToast';
import { UploadedPlaylistList } from '@/components/upload/UploadedPlaylistList';
import { useUploadStore } from '@/store/useUploadStore';
import { mockSongs } from '@/data/songs';
import { UploadedPlaylist, Song } from '@/types';

export const UploadPlaylist: React.FC = () => {
  const {
    status,
    parsedPlaylist,
    selectedFile,
    resetUpload,
    addUploadedPlaylist,
  } = useUploadStore();

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedPlaylistId, setSavedPlaylistId] = useState<string | null>(null);
  const [savedPlaylistName, setSavedPlaylistName] = useState('');

  const findMatchingSongs = (): string[] => {
    if (!parsedPlaylist) return [];

    const songIds: string[] = [];
    parsedPlaylist.tracks.forEach((track) => {
      const matchedSong = mockSongs.find(
        (song: Song) =>
          song.title.toLowerCase().includes(track.title.toLowerCase()) ||
          track.title.toLowerCase().includes(song.title.toLowerCase()) ||
          (song.artist.toLowerCase().includes(track.artist.toLowerCase()) &&
            track.artist.toLowerCase() !== '未知艺术家')
      );
      if (matchedSong && !songIds.includes(matchedSong.id)) {
        songIds.push(matchedSong.id);
      }
    });

    if (songIds.length === 0 && parsedPlaylist.tracks.length > 0) {
      const fallbackIds = mockSongs
        .slice(0, Math.min(parsedPlaylist.tracks.length, 10))
        .map((s) => s.id);
      return fallbackIds;
    }

    return songIds;
  };

  const handleSave = async () => {
    if (!parsedPlaylist || !selectedFile) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const matchedSongIds = findMatchingSongs();
      const playlistId = `upload-${Date.now()}`;

      const formatColors: Record<string, string> = {
        m3u: 'blue%20aesthetic',
        pls: 'purple%20vibrant',
        xspf: 'cyberpunk%20neon',
      };

      const colorPrompt = formatColors[parsedPlaylist.format] || 'music%20artwork';
      const coverUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20playlist%20cover%20${encodeURIComponent(parsedPlaylist.name)}%20${colorPrompt}&image_size=square_hd`;

      const uploadedPlaylist: UploadedPlaylist = {
        id: playlistId,
        name: parsedPlaylist.name,
        coverUrl,
        description: `本地上传的 ${parsedPlaylist.format.toUpperCase()} 格式歌单，共 ${parsedPlaylist.tracks.length} 首歌曲。`,
        playCount: 0,
        songIds: matchedSongIds,
        creator: '本地上传',
        createTime: new Date().toISOString().split('T')[0],
        tags: ['本地上传', parsedPlaylist.format.toUpperCase(), '个人歌单'],
        format: parsedPlaylist.format,
        originalFileName: selectedFile.name,
        uploadTime: new Date().toISOString(),
        parsedTracks: parsedPlaylist.tracks,
        totalDuration: parsedPlaylist.totalDuration,
      };

      addUploadedPlaylist(uploadedPlaylist);

      setSavedPlaylistId(playlistId);
      setSavedPlaylistName(parsedPlaylist.name);
      setShowSuccess(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    resetUpload();
  };

  const handleCloseToast = () => {
    setShowSuccess(false);
    setSavedPlaylistId(null);
    setSavedPlaylistName('');
  };

  const steps = [
    { icon: Upload, label: '选择文件', active: status !== 'idle', completed: status !== 'idle' && status !== 'selecting' },
    { icon: FileText, label: '解析歌单', active: status === 'uploading' || status === 'parsing', completed: status === 'success' || status === 'error' },
    { icon: Music, label: '预览确认', active: status === 'success', completed: false },
    { icon: CheckCircle2, label: '完成保存', active: isSaving, completed: showSuccess },
  ];

  return (
    <div className="min-h-screen pb-32">
      <PageHeader title="上传歌单" />

      <main className="pt-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold gradient-text mb-2">
              上传本地歌单
            </h1>
            <p className="text-white/60">
              支持 .m3u、.m3u8、.pls、.xspf 等主流歌单格式，快速导入您的音乐收藏
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          step.completed
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                            : step.active
                            ? 'bg-gradient-to-br from-neon-pink to-neon-cyan text-white neon-glow-pink'
                            : 'bg-white/5 text-white/30 border-2 border-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-medium transition-colors ${
                          step.completed || step.active ? 'text-white' : 'text-white/40'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition-colors duration-300 ${
                          step.completed ? 'bg-green-500/50' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <FileUploader />

            {parsedPlaylist && status === 'success' && (
              <PlaylistPreview
                playlist={parsedPlaylist}
                onSave={handleSave}
                onReset={handleReset}
                isSaving={isSaving}
              />
            )}

            <UploadedPlaylistList />
          </div>
        </div>
      </main>

      {showSuccess && savedPlaylistId && (
        <SuccessToast
          playlistName={savedPlaylistName}
          playlistId={savedPlaylistId}
          onClose={handleCloseToast}
        />
      )}

      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>
    </div>
  );
};
