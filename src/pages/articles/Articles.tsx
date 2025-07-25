import CreateArticle from '../../features/articles/CreateArticle';
import Article from '../../features/articles/Article';

function ArticlesPage() {
  return (
    <div data-testid="articles-page">
      <CreateArticle />
      <Article id="1" />
    </div>
  );
}

export default ArticlesPage;
