import { useEffect, useRef, useState, useCallback } from 'react';

export const useAudioAnalyzer = (
  audioElement: HTMLAudioElement | null,
  isPlaying: boolean
) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(64).fill(0));
  const [useMockData, setUseMockData] = useState(false);
  const timeRef = useRef(0);

  const generateMockFrequencyData = useCallback((time: number) => {
    const bars = 64;
    const data: number[] = [];
    for (let i = 0; i < bars; i++) {
      const t = time * 0.002 + i * 0.15;
      const wave1 = Math.sin(t) * 0.3 + 0.5;
      const wave2 = Math.sin(t * 1.5 + i * 0.1) * 0.2;
      const wave3 = Math.sin(t * 0.7 + i * 0.2) * 0.15;
      const random = Math.random() * 0.1;
      let value = wave1 + wave2 + wave3 + random;
      value = Math.max(0.05, Math.min(1, value));
      const decay = Math.exp(-Math.pow(i - bars / 2, 2) / (bars * bars * 0.1));
      value = value * (0.3 + decay * 0.7);
      data.push(value);
    }
    return data;
  }, []);

  const initAudioContext = useCallback(() => {
    if (!audioElement) return;

    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      setUseMockData(false);
    } catch (error) {
      console.log('Falling back to mock visualization data');
      setUseMockData(true);
    }
  }, [audioElement]);

  const analyze = useCallback(() => {
    const updateFrequency = (timestamp: number) => {
      if (useMockData) {
        timeRef.current = timestamp;
        const mockData = generateMockFrequencyData(timestamp);
        setFrequencyData(mockData);
      } else if (analyserRef.current) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        const normalizedData = Array.from(dataArray).map((value) => value / 255);
        while (normalizedData.length < 64) {
          normalizedData.push(0);
        }
        setFrequencyData(normalizedData.slice(0, 64));
      } else {
        timeRef.current = timestamp;
        const mockData = generateMockFrequencyData(timestamp);
        setFrequencyData(mockData);
      }
      animationRef.current = requestAnimationFrame(updateFrequency);
    };

    animationRef.current = requestAnimationFrame(updateFrequency);
  }, [useMockData, generateMockFrequencyData]);

  useEffect(() => {
    if (isPlaying) {
      if (audioElement && !audioContextRef.current && !useMockData) {
        initAudioContext();
      }
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      analyze();
    } else if (!isPlaying) {
      const idleData = new Array(64).fill(0).map((_, i) => {
        return 0.05 + Math.sin(Date.now() * 0.001 + i * 0.2) * 0.02;
      });
      setFrequencyData(idleData);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioElement, initAudioContext, analyze, useMockData]);

  useEffect(() => {
    const handlePlay = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const handleError = () => {
      setUseMockData(true);
    };

    audioElement?.addEventListener('play', handlePlay);
    audioElement?.addEventListener('error', handleError);

    return () => {
      audioElement?.removeEventListener('play', handlePlay);
      audioElement?.removeEventListener('error', handleError);
    };
  }, [audioElement]);

  return {
    frequencyData,
    initAudioContext,
  };
};
