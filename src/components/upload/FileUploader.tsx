import React, { useCallback, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useUploadStore } from '@/store/useUploadStore';
import {
  validatePlaylistFile,
  parsePlaylist,
  formatFileSize,
  getPlaylistFormat,
} from '@/utils/playlistParser';

export const FileUploader: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    status,
    progress,
    error,
    selectedFile,
    setStatus,
    setProgress,
    setError,
    setSelectedFile,
    setParsedPlaylist,
    resetUpload,
  } = useUploadStore();

  const handleFileSelect = useCallback(
    async (file: File) => {
      resetUpload();
      setSelectedFile(file);

      const validation = validatePlaylistFile(file);
      if (!validation.valid) {
        setStatus('error');
        setError(validation.error || '文件验证失败');
        return;
      }

      setStatus('uploading');

      try {
        const result = await parsePlaylist(file, (progressValue) => {
          setProgress(progressValue);
          if (progressValue < 100) {
            setStatus('uploading');
          } else {
            setStatus('parsing');
          }
        });

        setParsedPlaylist(result);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : '解析歌单文件时发生错误');
      }
    },
    [resetUpload, setSelectedFile, setStatus, setError, setProgress, setParsedPlaylist]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status !== 'uploading' && status !== 'parsing') {
      setStatus('selecting');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'selecting') {
      setStatus('idle');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === 'uploading' || status === 'parsing') {
      return;
    }

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    } else {
      setStatus('idle');
    }
  };

  const handleClick = () => {
    if (status !== 'uploading' && status !== 'parsing') {
      inputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetUpload();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const format = selectedFile ? getPlaylistFormat(selectedFile.name) : null;
  const formatLabel = format?.toUpperCase();

  const getStatusIcon = () => {
    if (status === 'error') return <AlertCircle className="w-8 h-8 text-red-400" />;
    if (status === 'success') return <CheckCircle2 className="w-8 h-8 text-green-400" />;
    if (status === 'uploading' || status === 'parsing')
      return <FileText className="w-8 h-8 text-neon-cyan animate-pulse" />;
    return <Upload className="w-8 h-8 text-neon-pink" />;
  };

  const getStatusText = () => {
    switch (status) {
      case 'selecting':
        return '释放鼠标上传文件';
      case 'uploading':
        return '读取文件中...';
      case 'parsing':
        return '解析歌单中...';
      case 'success':
        return '解析成功！';
      case 'error':
        return '上传失败';
      default:
        return '点击或拖拽文件到此处';
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative glass-card rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
          status === 'selecting' && 'border-neon-cyan bg-neon-cyan/10',
          status === 'uploading' && 'border-neon-cyan bg-neon-cyan/5',
          status === 'parsing' && 'border-neon-purple bg-neon-purple/5',
          status === 'success' && 'border-green-500/50 bg-green-500/5',
          status === 'error' && 'border-red-500/50 bg-red-500/5',
          status === 'idle' && 'border-white/20 hover:border-neon-pink/50 hover:bg-white/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".m3u,.m3u8,.pls,.xspf"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'p-4 rounded-2xl transition-all duration-300',
                status === 'selecting' && 'bg-neon-cyan/20 scale-110',
                status === 'success' && 'bg-green-500/20',
                status === 'error' && 'bg-red-500/20',
                (status === 'uploading' || status === 'parsing') && 'bg-neon-cyan/20',
                status === 'idle' && 'bg-white/5'
              )}
            >
              {getStatusIcon()}
            </div>

            <div>
              <p
                className={cn(
                  'text-lg font-medium transition-colors',
                  status === 'selecting' && 'text-neon-cyan',
                  status === 'success' && 'text-green-400',
                  status === 'error' && 'text-red-400',
                  (status === 'uploading' || status === 'parsing') && 'text-neon-cyan',
                  status === 'idle' && 'text-white'
                )}
              >
                {getStatusText()}
              </p>
              <p className="text-sm text-white/50 mt-1">
                支持 .m3u、.m3u8、.pls、.xspf 格式，最大 10MB
              </p>
            </div>

            {selectedFile && (
              <div className="w-full max-w-md">
                <div className="glass-card rounded-xl p-4 flex items-center gap-3 text-left">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{selectedFile.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {formatLabel && (
                        <span className="px-2 py-0.5 rounded-md bg-neon-purple/30 text-xs text-neon-purple font-medium">
                          {formatLabel}
                        </span>
                      )}
                      <span className="text-xs text-white/50">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  {status !== 'uploading' && status !== 'parsing' && (
                    <button
                      onClick={handleRemove}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4 text-white/50 hover:text-white" />
                    </button>
                  )}
                </div>

                {(status === 'uploading' || status === 'parsing') && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                      <span>{status === 'uploading' ? '读取进度' : '解析进度'}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="w-full max-w-md">
                <div className="glass-card rounded-xl p-4 bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">上传失败</p>
                      <p className="text-red-300/80 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {status === 'selecting' && (
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-pink/10 pointer-events-none">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neon-cyan/5 to-neon-pink/5" />
          </div>
        )}
      </div>

      {selectedFile && status !== 'uploading' && status !== 'parsing' && (
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={handleClick}
            className="px-6 py-2 rounded-xl glass-card text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            重新选择文件
          </button>
        </div>
      )}
    </div>
  );
};
