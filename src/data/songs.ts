import { Song } from '@/types';
import { generateLyrics } from './lyrics';

const cacheBuster = Date.now();

export const mockSongs: Song[] = [
  {
    id: '1',
    title: '夜空中最亮的星',
    artist: '逃跑计划',
    album: '世界',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20night%20starry%20sky%20neon%20galaxy&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster}`,
    duration: 372,
    lyrics: generateLyrics('夜空中最亮的星'),
  },
  {
    id: '2',
    title: '海阔天空',
    artist: 'Beyond',
    album: '乐与怒',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20ocean%20sky%20horizon%20sunset&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster + 1}`,
    duration: 366,
    lyrics: generateLyrics('海阔天空'),
  },
  {
    id: '3',
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20sunny%20day%20blue%20sky%20white%20clouds&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster + 2}`,
    duration: 348,
    lyrics: generateLyrics('晴天'),
  },
  {
    id: '4',
    title: '平凡之路',
    artist: '朴树',
    album: '猎户星座',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20country%20road%20sunset&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster + 3}`,
    duration: 333,
    lyrics: generateLyrics('平凡之路'),
  },
  {
    id: '5',
    title: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20rice%20field%20golden%20sunshine&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster + 4}`,
    duration: 318,
    lyrics: generateLyrics('稻香'),
  },
  {
    id: '6',
    title: '光辉岁月',
    artist: 'Beyond',
    album: '命运派对',
    coverUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=music%20album%20cover%20glowing%20years%20neon%20light&image_size=square_hd',
    audioUrl: `/audio-proxy/html/horse.mp3?t=${cacheBuster + 5}`,
    duration: 345,
    lyrics: generateLyrics('光辉岁月'),
  },
];
