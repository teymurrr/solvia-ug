import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

const StructuredData = ({ data }: StructuredDataProps) => {
  const items = Array.isArray(data) ? data : [data];
  
  return (
    <Helmet>
      {items.map((item, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;

// Reusable schema generators
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Solvia',
  url: 'https://solvia-flexkapg.lovable.app',
  logo: 'https://solvia-flexkapg.lovable.app/favicon-512.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'David.rehrl@thesolvia.com',
    contactType: 'customer service',
    availableLanguage: ['English', 'German', 'French', 'Spanish', 'Russian'],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Schmiedingerstraße 16',
    addressLocality: 'Salzburg',
    postalCode: '5020',
    addressCountry: 'AT',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Solvia',
  url: 'https://solvia-flexkapg.lovable.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://solvia-flexkapg.lovable.app/vacancies?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const createJobPostingSchema = (job: {
  title: string;
  description: string;
  institution: string;
  location: string;
  salary?: string;
  posted: string;
  type: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  hiringOrganization: {
    '@type': 'Organization',
    name: job.institution,
  },
  jobLocation: {
    '@type': 'Place',
    address: job.location,
  },
  datePosted: job.posted,
  employmentType: job.type === 'Full-time' ? 'FULL_TIME' : job.type === 'Part-time' ? 'PART_TIME' : 'OTHER',
  ...(job.salary && { baseSalary: { '@type': 'MonetaryAmount', currency: 'EUR', value: job.salary } }),
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Organization',
    name: article.authorName || 'Solvia',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Solvia',
    logo: {
      '@type': 'ImageObject',
      url: 'https://solvia-flexkapg.lovable.app/favicon-512.png',
    },
  },
});

export const createCourseSchema = (course: {
  name: string;
  description: string;
  provider?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.name,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: course.provider || 'Solvia',
  },
});
