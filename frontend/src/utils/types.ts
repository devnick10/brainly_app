interface ContentData {
    title: string;
    link: string;
}

interface UserData {
  email: string;
  password: string;
}
interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}
interface Content {
  _id: string;
  link: string;
  title: string;
  type: "twitter" | 'youtube';
  tags: []
  userId: {
    _id: string;
    email: string
  }
}
export type {
    ContentData,
    UserData,
    AuthLayoutProps,
    Content

}