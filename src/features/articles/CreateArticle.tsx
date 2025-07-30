import { useRef } from 'react';
import { useCreateArticleMutation } from '../../services/lexiApiSlice';
import { IArticle } from '../../types/articles';

// IMPORTANT: this is a simplified version of the CreateArticleForm component.
// for dev purposes only, no validation, no error handling, no accessibility.

function CreateArticle() {
  const [createArticle, { isLoading, error }] = useCreateArticleMutation();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formRef.current) return;

    const form = formRef.current;
    const data = new FormData(form);
    const tagsValue = data.get('tags');

    const article: IArticle = {
      title: String(data.get('title')),
      content: String(data.get('content')),
      tags: tagsValue // Handles empty and null (if 'tags' field doesn't exist) input
        ? String(tagsValue)
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean) // Removes empty strings
        : [],
      slug: String(data.get('slug')),
    };

    createArticle({ article });

    form.reset();
  };

  if (isLoading) {
    return <div data-testid="create-article-form">Creating article...</div>;
  }
  if (error) {
    return <div data-testid="create-article-form">Error creating article</div>;
  }

  return (
    <div data-testid="create-article-form">
      <h1>Create Article</h1>
      <form
        onSubmit={onSubmit}
        ref={formRef}
      >
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            data-testid="create-article-title"
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            id="content"
            data-testid="create-article-content"
          />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            data-testid="create-article-tags"
          />
        </div>
        <div>
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            name="slug"
            id="slug"
            data-testid="create-article-slug"
          />
        </div>
        <button
          type="submit"
          data-testid="create-article-submit"
        >
          Create Article
        </button>
      </form>
    </div>
  );
}

export default CreateArticle;
