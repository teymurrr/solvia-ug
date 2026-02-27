
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useLanguage } from '@/hooks/useLanguage';
import SEO from '@/components/SEO';

const Terms = () => {
  const { t } = useLanguage();
  
  const seoData = (t as any)?.seo?.terms;
  
  return (
    <MainLayout>
      <SEO
        title={seoData?.title || 'Terms of Service'}
        description={seoData?.description || 'Read the terms and conditions for using the Solvia platform.'}
        path="/terms"
        noindex
      />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t?.terms?.title || t?.footer?.termsOfService || "Terms of Service"}</h1>
          <p className="text-sm text-muted-foreground mb-8">{t?.terms?.effectiveDate || "Effective Date: 29.05.2025"}</p>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-6">
              {t?.terms?.introduction?.content || "Welcome to Solvia, a digital platform operated by Solvia FlexKapG, designed to connect healthcare professionals with employers across Europe. By accessing or using our services, you agree to be bound by the following Terms of Service."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.introduction?.title || "1. Introduction"}</h2>
            <p>
              {t?.terms?.introduction?.paragraph || "These Terms govern your use of the website, services, and features offered by Solvia FlexKapG. If you do not agree with these terms, please do not use our services."}
            </p>
            <p className="mt-4">
              {t?.terms?.introduction?.company || "Solvia FlexKapG"}<br />
              {t?.terms?.introduction?.registrationNumber || "FN 646976k"}<br />
              {t?.terms?.introduction?.address || "Schmiedingerstraße 16\n5020, Salzburg\nAustria"}
            </p>
            <p className="mt-4">
              {t?.terms?.introduction?.email || "📧 Email: David.rehrl@thesolvia.com"}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.eligibility?.title || "2. Eligibility"}</h2>
            <p>{t?.terms?.eligibility?.intro || "You may use Solvia only if:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.eligibility?.conditions?.map((condition: string, index: number) => (
                <li key={index}>{condition}</li>
              )) || (
                <>
                  <li>You are at least 18 years old</li>
                  <li>You have the legal capacity to enter into a binding agreement</li>
                  <li>You comply with all applicable local, national, and international laws</li>
                </>
              )}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.userAccounts?.title || "3. User Accounts"}</h2>
            <p>{t?.terms?.userAccounts?.intro || "To use certain features, you must create an account. You agree to:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.userAccounts?.conditions?.map((condition: string, index: number) => (
                <li key={index}>{condition}</li>
              )) || (
                <>
                  <li>Provide accurate and complete information</li>
                  <li>Keep your login credentials secure</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </>
              )}
            </ul>
            <p className="mt-4">
              {t?.terms?.userAccounts?.termination || "Solvia reserves the right to suspend or terminate accounts that violate these terms or pose a security risk."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.servicesOffered?.title || "4. Services Offered"}</h2>
            <p>{t?.terms?.servicesOffered?.intro || "Solvia provides:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.servicesOffered?.services?.map((service: string, index: number) => (
                <li key={index}>{service}</li>
              )) || (
                <>
                  <li>A searchable database of healthcare professionals and employers</li>
                  <li>Profile creation and CV uploads for job seekers</li>
                  <li>Direct appointment scheduling tools</li>
                  <li>Application and recruitment facilitation tools</li>
                </>
              )}
            </ul>
            <p className="mt-4">
              {t?.terms?.servicesOffered?.disclaimer || "Solvia does not guarantee employment or hiring outcomes."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.userResponsibilities?.title || "5. User Responsibilities"}</h2>
            <p>{t?.terms?.userResponsibilities?.intro || "You agree not to:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.userResponsibilities?.prohibited?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || (
                <>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate another person or entity</li>
                  <li>Upload harmful, illegal, or copyrighted materials</li>
                  <li>Attempt to reverse-engineer or tamper with our platform</li>
                  <li>Use the platform for unlawful or unethical recruitment practices</li>
                </>
              )}
            </ul>
            <p className="mt-4">
              {t?.terms?.userResponsibilities?.responsibility || "You are responsible for your content and interactions on the platform."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.employerResponsibilities?.title || "6. Employer Responsibilities"}</h2>
            <p>{t?.terms?.employerResponsibilities?.intro || "Employers using Solvia must:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.employerResponsibilities?.requirements?.map((requirement: string, index: number) => (
                <li key={index}>{requirement}</li>
              )) || (
                <>
                  <li>Use candidate information solely for recruitment purposes</li>
                  <li>Treat candidate data in compliance with GDPR and privacy laws</li>
                  <li>Avoid discrimination and adhere to fair hiring practices</li>
                </>
              )}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.intellectualProperty?.title || "7. Intellectual Property"}</h2>
            <p>
              {t?.terms?.intellectualProperty?.content || "All content, software, branding, and designs on Solvia are the property of Solvia FlexKapG or its licensors. You may not copy, modify, or distribute any part of the platform without express written permission."}
            </p>
            <p className="mt-4">
              {t?.terms?.intellectualProperty?.userContent || "You retain ownership of your uploaded CVs, documents, and profile content."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.dataPrivacy?.title || "8. Data Privacy"}</h2>
            <p>
              {t?.terms?.dataPrivacy?.content || "Solvia handles your personal data in accordance with the Privacy Policy and GDPR. By using our services, you consent to the collection and processing of your data as described therein."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.termination?.title || "9. Termination"}</h2>
            <p>{t?.terms?.termination?.intro || "You may delete your account at any time. Solvia may suspend or terminate your access if:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.termination?.conditions?.map((condition: string, index: number) => (
                <li key={index}>{condition}</li>
              )) || (
                <>
                  <li>You violate these Terms</li>
                  <li>You misuse the platform</li>
                  <li>We are required to do so by law or due to technical issues</li>
                </>
              )}
            </ul>
            <p className="mt-4">
              {t?.terms?.termination?.consequences || "Upon termination, your access will be revoked, but your data may be retained in accordance with our Privacy Policy."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.limitationOfLiability?.title || "10. Limitation of Liability"}</h2>
            <p>{t?.terms?.limitationOfLiability?.intro || "Solvia is provided \"as is.\" We do not guarantee uninterrupted service or error-free functionality."}</p>
            <p className="mt-4">{t?.terms?.limitationOfLiability?.disclaimer || "To the fullest extent permitted by law, Solvia FlexKapG is not liable for:"}</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              {t?.terms?.limitationOfLiability?.limitations?.map((limitation: string, index: number) => (
                <li key={index}>{limitation}</li>
              )) || (
                <>
                  <li>Loss of employment opportunities</li>
                  <li>Employer or candidate behavior</li>
                  <li>Technical issues, data loss, or platform downtime</li>
                  <li>Any indirect, incidental, or consequential damages</li>
                </>
              )}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.changesToTerms?.title || "11. Changes to These Terms"}</h2>
            <p>
              {t?.terms?.changesToTerms?.content || "We may update these Terms periodically. We will notify users of material changes via email or through the platform. Continued use after changes indicates your acceptance of the new Terms."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.governingLaw?.title || "12. Governing Law"}</h2>
            <p>
              {t?.terms?.governingLaw?.content || "These Terms are governed by the laws of Austria, without regard to conflict of law principles. Any legal disputes shall be subject to the jurisdiction of the courts in Salzburg, Austria."}
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t?.terms?.contact?.title || "13. Contact"}</h2>
            <p>
              {t?.terms?.contact?.intro || "For questions about these Terms, contact:"}
            </p>
            <p className="mt-4">
              {t?.terms?.contact?.company || "Solvia FlexKapG"}<br />
              {t?.terms?.contact?.registrationNumber || "FN 646976k"}<br />
              {t?.terms?.contact?.address || "📍 Schmiedingerstraße 16\n5020, Salzburg\nAustria"}
            </p>
            <p className="mt-4">
              {t?.terms?.contact?.email || "📧 David.rehrl@thesolvia.com"}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
