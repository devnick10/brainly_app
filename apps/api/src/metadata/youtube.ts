import type { Metadata } from './index';

export async function getYoutubeMetadata(
  url: string,
): Promise<Metadata | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        url,
      )}&format=json`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch YouTube metadata');
    }

    const data = await response.json<{
      title: string;
      description: string;
      author_name: string;
      provider_name: string;
      thumbnail_url: string;
    }>();

    return {
      title: data.title,
      description: data.description,
      imageUrl: data.thumbnail_url,
      siteName: data.provider_name,
      author: data.author_name,
      searchableText: `${data.title} ${data.description} ${data.author_name} ${data.provider_name}`,
    };
  } catch (error) {
    console.error('Error fetching YouTube metadata:', error);
    return null;
  }
}
