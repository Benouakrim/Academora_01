import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { SEO } from '@/components/common/SEO';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const { t, i18n } = useTranslation();

  const { data, isLoading, error } = useQuery<{ status: string; data: StaticPage }>({
    queryKey: ['static-page', slug, i18n.language],
    queryFn: async () => {
      const response = await api.get(`/pages/${slug}`, {
        params: { lang: i18n.language }
      });
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

  if (error || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">{t('page_not_found_title')}</h1>
        <p className="text-gray-600">
          {t('page_not_found_message')}
        </p>
        <Button onClick={() => window.history.back()} className="mt-6">
            {t('button_go_back')}
        </Button>
      </div>
    );
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
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
          <div 
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </article>
        
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t('last_updated')}: {new Date(page.updatedAt).toLocaleDateString(i18n.language)}
          </p>
        </footer>
      </div>
    </>
  );
}
