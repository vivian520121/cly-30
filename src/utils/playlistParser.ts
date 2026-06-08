import { PlaylistFormat, ParsedPlaylist, ParsedPlaylistTrack } from '@/types';

const SUPPORTED_FORMATS: Record<string, PlaylistFormat> = {
  '.m3u': 'm3u',
  '.m3u8': 'm3u',
  '.pls': 'pls',
  '.xspf': 'xspf',
};

export const getPlaylistFormat = (fileName: string): PlaylistFormat | null => {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  return SUPPORTED_FORMATS[ext] || null;
};

export const validatePlaylistFile = (file: File): { valid: boolean; error?: string } => {
  const format = getPlaylistFormat(file.name);
  if (!format) {
    return {
      valid: false,
      error: `不支持的文件格式。请上传 .m3u、.m3u8、.pls 或 .xspf 格式的歌单文件。`,
    };
  }

  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `文件过大。最大支持 10MB，当前文件大小为 ${(file.size / 1024 / 1024).toFixed(2)}MB。`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: '文件为空，请选择有效的歌单文件。',
    };
  }

  return { valid: true };
};

const parseM3U = (content: string): ParsedPlaylistTrack[] => {
  const lines = content.split(/\r?\n/);
  const tracks: ParsedPlaylistTrack[] = [];
  let currentTrack: Partial<ParsedPlaylistTrack> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('#')) {
      if (line.startsWith('#EXTINF:')) {
        const match = line.match(/#EXTINF:(-?\d+),\s*(.+)\s*-\s*(.+)/);
        if (match) {
          const [, durationStr, artist, title] = match;
          currentTrack = {
            title: title.trim(),
            artist: artist.trim(),
            duration: parseInt(durationStr, 10) > 0 ? parseInt(durationStr, 10) : undefined,
          };
        } else {
          const simpleMatch = line.match(/#EXTINF:(-?\d+),\s*(.+)/);
          if (simpleMatch) {
            const [, durationStr, fullTitle] = simpleMatch;
            currentTrack = {
              title: fullTitle.trim(),
              artist: '未知艺术家',
              duration: parseInt(durationStr, 10) > 0 ? parseInt(durationStr, 10) : undefined,
            };
          }
        }
      }
      continue;
    }

    if (line.length > 0) {
      if (!currentTrack.title) {
        const fileName = line.split(/[/\\]/).pop() || line;
        const cleanName = fileName.replace(/\.[^/.]+$/, '');
        const parts = cleanName.split(/\s*-\s*/);
        if (parts.length >= 2) {
          currentTrack = {
            artist: parts[0].trim(),
            title: parts.slice(1).join(' - ').trim(),
          };
        } else {
          currentTrack = {
            title: cleanName,
            artist: '未知艺术家',
          };
        }
      }
      currentTrack.filePath = line;
      tracks.push(currentTrack as ParsedPlaylistTrack);
      currentTrack = {};
    }
  }

  return tracks;
};

const parsePLS = (content: string): ParsedPlaylistTrack[] => {
  const tracks: ParsedPlaylistTrack[] = [];
  const trackMap: Record<number, Partial<ParsedPlaylistTrack>> = {};

  const lines = content.split(/\r?\n/);
  let numberOfEntries = 0;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('[') || trimmedLine.startsWith('#')) {
      continue;
    }

    const fileMatch = trimmedLine.match(/^File(\d+)=(.+)$/i);
    const titleMatch = trimmedLine.match(/^Title(\d+)=(.+)$/i);
    const lengthMatch = trimmedLine.match(/^Length(\d+)=(-?\d+)$/i);
    const numberOfEntriesMatch = trimmedLine.match(/^NumberOfEntries=(\d+)$/i);

    if (numberOfEntriesMatch) {
      numberOfEntries = parseInt(numberOfEntriesMatch[1], 10);
    }

    if (fileMatch) {
      const index = parseInt(fileMatch[1], 10);
      if (!trackMap[index]) trackMap[index] = {};
      trackMap[index].filePath = fileMatch[2];

      const fileName = fileMatch[2].split(/[/\\]/).pop() || fileMatch[2];
      const cleanName = fileName.replace(/\.[^/.]+$/, '');
      if (!trackMap[index].title) {
        const parts = cleanName.split(/\s*-\s*/);
        if (parts.length >= 2) {
          trackMap[index].artist = parts[0].trim();
          trackMap[index].title = parts.slice(1).join(' - ').trim();
        } else {
          trackMap[index].title = cleanName;
          trackMap[index].artist = '未知艺术家';
        }
      }
    }

    if (titleMatch) {
      const index = parseInt(titleMatch[1], 10);
      if (!trackMap[index]) trackMap[index] = {};
      const fullTitle = titleMatch[2];
      const parts = fullTitle.split(/\s*-\s*/);
      if (parts.length >= 2) {
        trackMap[index].artist = parts[0].trim();
        trackMap[index].title = parts.slice(1).join(' - ').trim();
      } else {
        trackMap[index].title = fullTitle;
        if (!trackMap[index].artist) {
          trackMap[index].artist = '未知艺术家';
        }
      }
    }

    if (lengthMatch) {
      const index = parseInt(lengthMatch[1], 10);
      if (!trackMap[index]) trackMap[index] = {};
      const duration = parseInt(lengthMatch[2], 10);
      if (duration > 0) {
        trackMap[index].duration = duration;
      }
    }
  }

  const maxIndex = numberOfEntries || Object.keys(trackMap).length;
  for (let i = 1; i <= maxIndex; i++) {
    if (trackMap[i] && trackMap[i].title) {
      tracks.push(trackMap[i] as ParsedPlaylistTrack);
    }
  }

  return tracks;
};

const parseXSPF = (content: string): ParsedPlaylistTrack[] => {
  const tracks: ParsedPlaylistTrack[] = [];
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');

  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('XSPF 文件格式错误，无法解析。');
  }

  const trackElements = xmlDoc.querySelectorAll('trackList > track');

  trackElements.forEach((track) => {
    const getText = (selector: string): string | undefined => {
      const element = track.querySelector(selector);
      return element?.textContent?.trim() || undefined;
    };

    const getNumber = (selector: string): number | undefined => {
      const text = getText(selector);
      if (text) {
        const num = parseInt(text, 10);
        return num > 0 ? num : undefined;
      }
      return undefined;
    };

    const title = getText('title') || '未知标题';
    const artist = getText('creator') || getText('artist') || '未知艺术家';
    const album = getText('album');
    const duration = getNumber('duration');
    const filePath = getText('location');

    tracks.push({
      title,
      artist,
      album,
      duration: duration ? Math.floor(duration / 1000) : undefined,
      filePath,
    });
  });

  return tracks;
};

export const parsePlaylist = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<ParsedPlaylist> => {
  const format = getPlaylistFormat(file.name);
  if (!format) {
    throw new Error('不支持的文件格式。');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (!content || content.trim().length === 0) {
          reject(new Error('文件内容为空，请选择有效的歌单文件。'));
          return;
        }

        let tracks: ParsedPlaylistTrack[];

        switch (format) {
          case 'm3u':
            tracks = parseM3U(content);
            break;
          case 'pls':
            tracks = parsePLS(content);
            break;
          case 'xspf':
            tracks = parseXSPF(content);
            break;
          default:
            reject(new Error('不支持的文件格式。'));
            return;
        }

        if (tracks.length === 0) {
          reject(new Error('未解析到任何歌曲信息，请检查歌单文件内容。'));
          return;
        }

        const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);

        const playlistName = file.name.replace(/\.[^/.]+$/, '');

        if (onProgress) {
          onProgress(100);
        }

        resolve({
          name: playlistName,
          format,
          tracks,
          totalDuration,
        });
      } catch (error) {
        reject(error instanceof Error ? error : new Error('解析歌单文件时发生错误。'));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件失败，请重试。'));
    };

    reader.readAsText(file, 'UTF-8');
  });
};

export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
