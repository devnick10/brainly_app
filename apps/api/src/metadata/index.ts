import { getYoutubeMetadata } from './youtube';
import { getArticleMetadata } from './article';

export interface Metadata {
  title: string;
  description?: string;
  searchableText: string;
  imageUrl?: string;
  siteName?: string;
  author?: string;
}

export async function getMetadata(url: string): Promise<Metadata> {
  const hostname = new URL(url).hostname.toLowerCase();

  if (
    hostname === 'youtube.com' ||
    hostname === 'www.youtube.com' ||
    hostname === 'youtu.be'
  ) {
    return getYoutubeMetadata(url);
  }

  // Everything else is treated as an article
  return getArticleMetadata(url);
}
