export interface CreateArticleParams {
  article: IArticle;
}

export interface CreateArticleResponse {
  article: IArticle;
}

export interface GetArticleResponse {
  data: IArticle;
}

export interface IArticle {
  id?: string;
  title: string;
  content: string;
  slug?: string;
  tags?: string[];
}
