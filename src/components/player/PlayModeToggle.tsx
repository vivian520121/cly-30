import React from 'react';
import { Repeat, Repeat1, Shuffle } from 'lucide-react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { PlayMode } from '@/types';
import { getPlayModeText, cyclePlayMode } from '@/utils/playMode';

const modeIcons: Record<PlayMode, React.ReactNode> = {
  loop: <Repeat className="w-5 h-5" />,
  single: <Repeat1 className="w-5 h-5" />,
  shuffle: <Shuffle className="w-5 h-5" />,
};

export const PlayModeToggle: React.FC = () => {
  const { playMode, setPlayMode } = usePlayerStore();

  const handleToggle = () => {
    const nextMode = cyclePlayMode(playMode);
    setPlayMode(nextMode);
  };

  const isActive = playMode !== 'loop';

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-all duration-200 btn-hover relative group ${
        isActive
          ? 'text-neon-cyan neon-glow-cyan bg-white/10'
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
      title={getPlayModeText(playMode)}
    >
      {modeIcons[playMode]}
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {getPlayModeText(playMode)}
      </span>
    </button>
  );
};
