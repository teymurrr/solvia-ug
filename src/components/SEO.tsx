import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/hooks/useLanguage';

const BASE_URL = 'https://solvia-flexkapg.lovable.app';
const SUPPORTED_LANGS = ['en', 'de', 'fr', 'es', 'ru'] as const;
const DEFAULT_OG_IMAGE = '/lovable-uploads/eb689b9e-7e70-4fb2-8ffb-50d9ef2c373a.png';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

const SEO = ({ title, description, path = '/', ogImage, ogType = 'website', noindex = false, children }: SEOProps) => {
  const { currentLanguage } = useLanguage();
  
  const canonical = `${BASE_URL}${path}`;
  const fullTitle = title.includes('Solvia') ? title : `${title} | Solvia`;
  const image = ogImage ? (ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`) : `${BASE_URL}${DEFAULT_OG_IMAGE}`;

  return (
    <Helmet>
      <html lang={currentLanguage} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Solvia" />
      <meta property="og:locale" content={currentLanguage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Hreflang */}
      {SUPPORTED_LANGS.map(lang => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={`${BASE_URL}${path}${path.includes('?') ? '&' : '?'}lang=${lang}`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={canonical} />

      {children}
    </Helmet>
  );
};

export default SEO;
