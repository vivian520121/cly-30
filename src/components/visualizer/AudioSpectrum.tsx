import React, { useRef, useEffect, useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';

interface AudioSpectrumProps {
  frequencyData: number[];
}

export const AudioSpectrum: React.FC<AudioSpectrumProps> = ({ frequencyData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isPlaying, currentSong } = usePlayerStore();
  const [dimensions, setDimensions] = useState({ width: 800, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.min(250, container.clientWidth / 4),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    const barCount = Math.min(frequencyData.length, 64);
    const barWidth = (dimensions.width - 40) / barCount - 2;
    const barGap = 2;

    const draw = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const gradient = ctx.createLinearGradient(
        0,
        dimensions.height,
        0,
        0
      );
      gradient.addColorStop(0, '#ff2a6d');
      gradient.addColorStop(0.5, '#d300c5');
      gradient.addColorStop(1, '#05d9e8');

      const startX = 20;
      const maxBarHeight = dimensions.height - 20;

      for (let i = 0; i < barCount; i++) {
        const value = frequencyData[i] || 0;
        const barHeight = Math.max(4, value * maxBarHeight);
        const x = startX + i * (barWidth + barGap);
        const y = dimensions.height - barHeight - 10;

        ctx.fillStyle = gradient;
        ctx.shadowColor = i % 2 === 0 ? '#ff2a6d' : '#05d9e8';
        ctx.shadowBlur = isPlaying ? 15 : 5;

        const radius = Math.min(barWidth / 2, 4);
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        ctx.shadowBlur = 0;

        if (isPlaying && value > 0.3) {
          const reflectionGradient = ctx.createLinearGradient(
            x,
            dimensions.height - 10,
            x,
            dimensions.height
          );
          reflectionGradient.addColorStop(0, `rgba(255, 42, 109, ${value * 0.3})`);
          reflectionGradient.addColorStop(1, 'rgba(255, 42, 109, 0)');
          ctx.fillStyle = reflectionGradient;
          ctx.fillRect(x, dimensions.height - 10, barWidth, barHeight * 0.3);
        }
      }

      if (currentSong && isPlaying) {
        ctx.font = '12px Orbitron, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'left';
        ctx.fillText('LIVE', 10, 20);

        ctx.beginPath();
        ctx.arc(28, 16, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ff2a6d';
        ctx.shadowColor = '#ff2a6d';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    draw();

    const animationId = requestAnimationFrame(function loop() {
      draw();
      requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationId);
  }, [frequencyData, dimensions, isPlaying, currentSong]);

  return (
    <div className="w-full relative">
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent pointer-events-none z-10" />
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
        }}
      />
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white/30 text-xs">
        <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
        <span className="font-display">AUDIO VISUALIZER</span>
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
      </div>
    </div>
  );
};
