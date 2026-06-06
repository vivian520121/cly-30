export const getAudioUrl = (originalUrl: string): string => {
  if (import.meta.env.DEV) {
    try {
      const url = new URL(originalUrl);
      if (url.hostname === 'files.khinsider.com' || url.hostname === 'www.soundhelix.com') {
        return `/audio-proxy${url.pathname}${url.search}`;
      }
    } catch {
      return originalUrl;
    }
  }
  return originalUrl;
};
