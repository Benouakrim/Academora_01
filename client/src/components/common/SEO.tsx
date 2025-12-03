import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

const defaults = {
  title: 'AcademOra - Find Your Dream University',
  description: 'Data-driven university discovery, financial aid prediction, and comparisons for students worldwide.',
  image: '/og-image.png', // Ensure this exists in public/
  url: 'https://academora.com',
  type: 'website'
}

export const SEO = ({ 
  title = defaults.title, 
  description = defaults.description, 
  image = defaults.image,
  url = defaults.url,
  type = 'website'
}: SEOProps) => {
  const siteTitle = title === defaults.title ? title : `${title} | AcademOra`

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* OpenGraph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}
