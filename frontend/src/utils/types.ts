interface ContentData {
  title: string;
  link: string;
  type: string;
}

interface UserData {
  email: string;
  password: string;
}

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

interface Content {
  id: string;
  link: string;
  title: string;
  type: "youtube" | "twitter";
  tags: { id: string; title: string }[];
  userId: string;
  user?: { email: string };
}

export type { ContentData, UserData, AuthLayoutProps, Content }
