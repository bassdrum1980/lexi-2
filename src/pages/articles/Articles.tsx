import {
  useCreateArticleMutation,
  useGetArticleQuery,
} from '../../services/lexiApiSlice';
import CreateArticleForm from '../../features/articles/CreateArticleForm';
import type { IArticle } from '../../types/articles';

export type handleSubmitType = (
  event: React.FormEvent<HTMLFormElement>,
  article: IArticle
) => void;

function ArticlesPage() {
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const { data, error, isLoading: isArticleLoading } = useGetArticleQuery('1');

  console.log('Article Data:', data);

  const handleSubmit: handleSubmitType = (event, article) => {
    event.preventDefault();
    createArticle({ article });
  };

  if (isArticleLoading || isCreating) {
    return (
      <div data-testid="articles-page">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div data-testid="articles-page">
      <CreateArticleForm handleSubmit={handleSubmit} />
      <hr />
      <br />
      {error && <div>Error loading article</div>}
      {data && (
        <div>
          <h2>Title: {data.data.title}</h2>
          <p>Content: {data.data.content}</p>
          <p>Tags: {data.data.tags?.join(', ')}</p>
          <p>Id: {data.data.id}</p>
        </div>
      )}
      {!data && !error && <div>No article found.</div>}
    </div>
  );
}

export default ArticlesPage;
