import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';

export const VolumeControl: React.FC = () => {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore();
  const [showSlider, setShowSlider] = useState(false);

  const displayVolume = isMuted ? 0 : volume;

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        onClick={toggleMute}
        className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 btn-hover text-white/80 hover:text-white"
        title={isMuted ? '取消静音' : '静音'}
      >
        <VolumeIcon />
      </button>
      <div
        className={`flex items-center transition-all duration-300 overflow-hidden ${
          showSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={displayVolume}
          onChange={handleVolumeChange}
          className="w-full h-1 cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ff2a6d 0%, #05d9e8 ${displayVolume * 100}%, rgba(255,255,255,0.2) ${displayVolume * 100}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
      </div>
      <span className="text-xs text-white/60 w-8 text-right">
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
};
