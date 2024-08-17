export interface IContent {
  id: string;
  categoryId: string;
  content: string;
  coverImage: string;
  created: string;
  metadata: { [key: string]: string };
  modified: string;
  slug: string;
  status: string;
  tags: string[];
  title: string;
  userId: string;
}

export interface IContentFilter {}

export interface IContentUpdate {}

export interface IContentCreate {}
