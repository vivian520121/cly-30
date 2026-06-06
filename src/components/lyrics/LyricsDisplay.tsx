import React, { useRef, useEffect, useMemo, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { findCurrentLyricIndex } from '@/utils/lyricParser';
import { formatTime } from '@/utils/formatTime';
import { Music } from 'lucide-react';

export const LyricsDisplay: React.FC = () => {
  const { currentSong, currentTime, seek } = usePlayerStore();
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const lyricLineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const lyrics = currentSong?.lyrics || [];

  const currentLyricIndex = useMemo(() => {
    return findCurrentLyricIndex(lyrics, currentTime);
  }, [lyrics, currentTime]);

  useEffect(() => {
    if (currentLyricIndex >= 0 && lyricLineRefs.current[currentLyricIndex]) {
      const container = lyricsContainerRef.current;
      const activeLine = lyricLineRefs.current[currentLyricIndex];
      if (container && activeLine) {
        const containerRect = container.getBoundingClientRect();
        const lineRect = activeLine.getBoundingClientRect();
        const scrollTop =
          activeLine.offsetTop - container.clientHeight / 2 + lineRect.height / 2;
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [currentLyricIndex]);

  useEffect(() => {
    lyricLineRefs.current = lyricLineRefs.current.slice(0, lyrics.length);
  }, [lyrics]);

  const handleLyricClick = (index: number) => {
    const lyric = lyrics[index];
    if (lyric) {
      seek(lyric.time);
    }
  };

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <Music className="w-16 h-16 mb-4" />
        <p className="text-lg">暂无歌曲</p>
        <p className="text-sm">请从歌单选择一首歌曲</p>
      </div>
    );
  }

  if (lyrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white/40">
        <Music className="w-16 h-16 mb-4" />
        <p className="text-lg">暂无歌词</p>
        <p className="text-sm">享受纯音乐的美好</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 text-center">
        <h3 className="text-2xl font-display font-bold gradient-text mb-1">
          {currentSong.title}
        </h3>
        <p className="text-white/60">{currentSong.artist}</p>
      </div>
      <div
        ref={lyricsContainerRef}
        className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth"
      >
        <div className="space-y-4">
          {lyrics.map((lyric, index) => {
            const isActive = index === currentLyricIndex;
            const isNearby = Math.abs(index - currentLyricIndex) <= 2;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                ref={(el) => (lyricLineRefs.current[index] = el)}
                className={`lyric-line text-center py-3 px-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'active scale-105'
                    : isNearby
                    ? 'text-white/60 hover:text-white/90'
                    : 'text-white/30 hover:text-white/50'
                } ${isHovered ? 'bg-white/5' : ''}`}
                onClick={() => handleLyricClick(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="block">{lyric.text}</span>
                {isHovered && (
                  <span className="text-xs text-white/40 mt-1 block">
                    {formatTime(lyric.time)} - 点击跳转
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="h-32" />
      </div>
    </div>
  );
};
