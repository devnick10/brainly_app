export type ContentType = 'YOUTUBE' | 'TWITTER' | 'ARTICLE' | 'DOCUMENT';

export interface ContentPayload {
  title: string;
  description?: string;
  type: ContentType;
  link: string;
}

export interface UserData {
  email: string;
  password: string;
}

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export interface Content {
  id: string;
  link: string;
  title: string;
  description?: string;
  type: ContentType;
  searchableText: string;
  imageUrl?: string;
  siteName?: string;
  author?: string;
  tags: { id: string; title: string }[];
  userId: string;
  user?: { email: string };
}
