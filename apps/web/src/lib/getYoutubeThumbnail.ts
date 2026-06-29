export const getYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);

  if (!match) return null;

  const videoId = match[1];

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};
