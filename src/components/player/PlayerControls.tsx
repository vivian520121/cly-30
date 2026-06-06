import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Heart } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { PlayModeToggle } from './PlayModeToggle';
import { AlbumCover } from '@/components/common/AlbumCover';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';

export const PlayerControls: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [useDemoMode, setUseDemoMode] = useState(false);
  const demoTimeIntervalRef = useRef<number | null>(null);
  const loadTimeoutRef = useRef<number | null>(null);
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playMode,
    play,
    pause,
    togglePlay,
    next,
    prev,
    seek,
    setCurrentTime,
    setDuration,
    playSong,
    setFrequencyData,
  } = usePlayerStore();

  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { frequencyData } = useAudioAnalyzer(audioRef.current, isPlaying);

  React.useEffect(() => {
    setFrequencyData(frequencyData);
  }, [frequencyData, setFrequencyData]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.readyState < 2 && !useDemoMode) {
      loadTimeoutRef.current = window.setTimeout(() => {
        if (audio.readyState < 2) {
          console.log('Audio load timeout, using demo mode');
          setUseDemoMode(true);
          if (currentSong?.duration) {
            setDuration(currentSong.duration);
          }
        }
      }, 2000);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [currentSong, useDemoMode, setDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (playMode === 'single') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };

    const handlePlay = () => {
      play();
    };

    const handlePause = () => {
      if (!useDemoMode) {
        pause();
      }
    };

    const handleError = () => {
      setUseDemoMode(true);
      console.log('External audio failed, using demo mode');
      if (currentSong && currentSong.duration) {
        setDuration(currentSong.duration);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [playMode, next, play, pause, setCurrentTime, setDuration, useDemoMode, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.volume = isMuted ? 0 : volume;

    if (audio.error) {
      setUseDemoMode(true);
    }

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error('Playback error:', err);
        setUseDemoMode(true);
      });
    } else {
      audio.pause();
    }

    if (useDemoMode) {
      if (demoTimeIntervalRef.current) {
        clearInterval(demoTimeIntervalRef.current);
        demoTimeIntervalRef.current = null;
      }

      if (isPlaying) {
        demoTimeIntervalRef.current = window.setInterval(() => {
          const nextTime = currentTime + 0.1;
          if (nextTime >= duration) {
            if (playMode === 'single') {
              setCurrentTime(0);
            } else {
              next();
            }
          } else {
            setCurrentTime(nextTime);
          }
        }, 100);
      }
    }

    return () => {
      if (demoTimeIntervalRef.current) {
        clearInterval(demoTimeIntervalRef.current);
        demoTimeIntervalRef.current = null;
      }
    };
  }, [currentSong, isPlaying, volume, isMuted, duration, playMode, next, setCurrentTime, currentTime, useDemoMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = currentTime;
  }, [currentTime]);

  const handleSeek = (time: number) => {
    seek(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handlePrev = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      seek(0);
    } else {
      prev();
    }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  if (!currentSong) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="glass-card border-t border-white/10 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-1/4 min-w-0">
              <AlbumCover
                coverUrl={currentSong.coverUrl}
                title={currentSong.title}
                isPlaying={isPlaying}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-white truncate">
                  {currentSong.title}
                </h4>
                <p className="text-sm text-white/60 truncate">
                  {currentSong.artist}
                </p>
              </div>
              <button
                onClick={() => toggleFavorite(currentSong.id)}
                className={`p-2 rounded-full transition-all duration-300 btn-hover ${
                  isFavorite(currentSong.id)
                    ? 'text-neon-pink'
                    : 'text-white/40 hover:text-white'
                }`}
                title={isFavorite(currentSong.id) ? '取消收藏' : '收藏'}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isFavorite(currentSong.id) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <PlayModeToggle />
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 btn-hover text-white/80 hover:text-white"
                  title="上一首"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    handleRipple(e);
                    togglePlay();
                  }}
                  className="relative overflow-hidden p-4 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan text-white shadow-lg hover:shadow-neon-pink/50 transition-all duration-300 btn-hover hover:scale-105 active:scale-95"
                  title={isPlaying ? '暂停' : '播放'}
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 ml-0.5" />
                  )}
                </button>
                <button
                  onClick={next}
                  className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 btn-hover text-white/80 hover:text-white"
                  title="下一首"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
                <div className="hidden md:flex items-center gap-2">
                  {frequencyData.slice(0, 4).map((value, index) => (
                    <div
                      key={index}
                      className="w-1 bg-gradient-to-t from-neon-pink to-neon-cyan rounded-full spectrum-bar"
                      style={{
                        height: `${Math.max(4, value * 24)}px`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full max-w-xl">
                <ProgressBar
                  currentTime={currentTime}
                  duration={duration || currentSong.duration}
                  onSeek={handleSeek}
                />
              </div>
            </div>

            <div className="hidden md:flex items-center w-1/4 justify-end">
              <VolumeControl />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
