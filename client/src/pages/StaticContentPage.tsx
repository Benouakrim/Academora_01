import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import { SEO } from '@/components/common/SEO';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface StaticPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StaticContentPageProps {
  slug?: string;
}

export default function StaticContentPage({ slug: propSlug }: StaticContentPageProps) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;

  const { data, isLoading, error } = useQuery<{ status: string; data: StaticPage }>({
    queryKey: ['static-page', slug],
    queryFn: async () => {
      const response = await api.get(`/pages/${slug}`);
      return response.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600">
          The page you're looking for doesn't exist or hasn't been published yet.
        </p>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const page = data.data;

  return (
    <>
      <SEO
        title={page.metaTitle || page.title}
        description={page.metaDescription || undefined}
        type="article"
      />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{page.title}</h1>
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </article>
        
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(page.updatedAt).toLocaleDateString()}
          </p>
        </footer>
      </div>
    </>
  );
}
