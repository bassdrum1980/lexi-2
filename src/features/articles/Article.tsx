import { useGetArticleQuery } from '../../services/lexiApiSlice';

function Article({ id }: { id: string }) {
  const { data, error, isLoading } = useGetArticleQuery(id);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading article</div>;
  if (!data) return <div>No article found</div>;

  return (
    <div data-testid="article-component">
      <h1>Article Component</h1>
      <h2>Title: {data.data.title}</h2>
      <p>Content: {data.data.content}</p>
      <p>Id: {data.data.id}</p>
    </div>
  );
}

export default Article;
