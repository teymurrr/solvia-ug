
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useLanguage } from '@/hooks/useLanguage';

const Terms = () => {
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{t?.terms?.title || "Terms of Service"}</h1>
          <p className="text-sm text-muted-foreground mb-8">
            {t?.terms?.lastUpdated || "Last Updated"}: 29.05.2025
          </p>
          
          <div className="prose prose-slate max-w-none">
            {/* Introduction */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              1. {t?.terms?.introduction?.title || "Introduction"}
            </h2>
            <p>
              {t?.terms?.introduction?.description || "These terms of service govern your use of the Solvia platform, operated by Solvia GmbH."}
            </p>
            
            {/* Account Terms */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              2. {t?.terms?.accountTerms?.title || "Account Terms"}
            </h2>
            <p>
              {t?.terms?.accountTerms?.description || "You are responsible for the security of your account and all activities conducted through your account."}
            </p>
            
            {/* Privacy Policy */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              3. {t?.terms?.privacyPolicy?.title || "Privacy Policy"}
            </h2>
            <p>
              {t?.terms?.privacyPolicy?.description || "Our Privacy Policy describes how we collect, use, and protect your personal data."}
            </p>
            
            {/* Intellectual Property */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              4. {t?.terms?.intellectualProperty?.title || "Intellectual Property"}
            </h2>
            <p>
              {t?.terms?.intellectualProperty?.description || "All content on the platform is owned by Solvia and protected by intellectual property laws."}
            </p>
            
            {/* User Conduct */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              5. {t?.terms?.userConduct?.title || "User Conduct"}
            </h2>
            <p>
              {t?.terms?.userConduct?.description || "You agree not to use the platform for illegal or prohibited activities."}
            </p>
            
            {/* Termination */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              6. {t?.terms?.termination?.title || "Termination"}
            </h2>
            <p>
              {t?.terms?.termination?.description || "We reserve the right to suspend or terminate accounts that violate our terms."}
            </p>
            
            {/* Disclaimers */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              7. {t?.terms?.disclaimers?.title || "Disclaimers"}
            </h2>
            <p>
              {t?.terms?.disclaimers?.description || "The platform is provided 'as is' and 'as available', without any warranties."}
            </p>
            
            {/* Limitations of Liability */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              8. {t?.terms?.limitations?.title || "Limitations of Liability"}
            </h2>
            <p>
              {t?.terms?.limitations?.description || "Solvia will not be liable for indirect, incidental, special, or consequential damages."}
            </p>
            
            {/* Governing Law */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              9. {t?.terms?.governing?.title || "Governing Law"}
            </h2>
            <p>
              {t?.terms?.governing?.description || "These terms are governed by the laws of Germany."}
            </p>
            
            {/* Changes to Terms */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              10. {t?.terms?.changes?.title || "Changes to Terms"}
            </h2>
            <p>
              {t?.terms?.changes?.description || "We reserve the right to modify these terms from time to time."}
            </p>
            
            {/* Contact */}
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              11. {t?.terms?.contact?.title || "Contact"}
            </h2>
            <p>
              {t?.terms?.contact?.description || "If you have any questions about these terms, please contact us at:"}
            </p>
            <p className="mt-4">
              teymur.mammadov@thesolvia.com
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
