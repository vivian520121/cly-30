import { useMemo } from 'react';
import { Playlist } from '@/types';
import { mockPlaylists } from '@/data/playlists';
import { useUploadStore } from '@/store/useUploadStore';

export const useAllPlaylists = () => {
  const { uploadedPlaylists } = useUploadStore();

  const allPlaylists = useMemo<Playlist[]>(() => {
    return [...uploadedPlaylists, ...mockPlaylists];
  }, [uploadedPlaylists]);

  const getPlaylistById = (id: string): Playlist | undefined => {
    const uploaded = uploadedPlaylists.find((p) => p.id === id);
    if (uploaded) return uploaded;
    return mockPlaylists.find((p) => p.id === id);
  };

  return {
    allPlaylists,
    uploadedPlaylists,
    mockPlaylists,
    getPlaylistById,
  };
};
