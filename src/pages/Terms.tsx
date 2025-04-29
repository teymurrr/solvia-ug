
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Terms = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: 29.05.2025</p>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-6">
              Welcome to Solvia, a digital platform operated by Solvia UG, designed to connect healthcare professionals 
              with employers across Europe. By accessing or using our services, you agree to be bound by the 
              following Terms of Service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              These Terms govern your use of the website, services, and features offered by Solvia UG. 
              If you do not agree with these terms, please do not use our services.
            </p>
            <p className="mt-4">
              Solvia UG<br />
              Rudolfstraße 21, Apt 08<br />
              60327 Frankfurt am Main<br />
              Hessen, Germany
            </p>
            <p className="mt-4">
              📧 Email: teymur.mammadov@thesolvia.com
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
            <p>You may use Solvia only if:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You are at least 18 years old</li>
              <li>You have the legal capacity to enter into a binding agreement</li>
              <li>You comply with all applicable local, national, and international laws</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
            <p>To use certain features, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Keep your login credentials secure</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
            <p className="mt-4">
              Solvia reserves the right to suspend or terminate accounts that violate these terms or pose a security risk.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Services Offered</h2>
            <p>Solvia provides:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>A searchable database of healthcare professionals and employers</li>
              <li>Profile creation and CV uploads for job seekers</li>
              <li>Direct appointment scheduling tools</li>
              <li>Application and recruitment facilitation tools</li>
            </ul>
            <p className="mt-4">
              Solvia does not guarantee employment or hiring outcomes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Responsibilities</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Post false, misleading, or fraudulent information</li>
              <li>Impersonate another person or entity</li>
              <li>Upload harmful, illegal, or copyrighted materials</li>
              <li>Attempt to reverse-engineer or tamper with our platform</li>
              <li>Use the platform for unlawful or unethical recruitment practices</li>
            </ul>
            <p className="mt-4">
              You are responsible for your content and interactions on the platform.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Employer Responsibilities</h2>
            <p>Employers using Solvia must:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Use candidate information solely for recruitment purposes</li>
              <li>Treat candidate data in compliance with GDPR and privacy laws</li>
              <li>Avoid discrimination and adhere to fair hiring practices</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              All content, software, branding, and designs on Solvia are the property of Solvia UG or its licensors. 
              You may not copy, modify, or distribute any part of the platform without express written permission.
            </p>
            <p className="mt-4">
              You retain ownership of your uploaded CVs, documents, and profile content.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Data Privacy</h2>
            <p>
              Solvia handles your personal data in accordance with the Privacy Policy and GDPR. By using our services, 
              you consent to the collection and processing of your data as described therein.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Termination</h2>
            <p>You may delete your account at any time. Solvia may suspend or terminate your access if:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>You violate these Terms</li>
              <li>You misuse the platform</li>
              <li>We are required to do so by law or due to technical issues</li>
            </ul>
            <p className="mt-4">
              Upon termination, your access will be revoked, but your data may be retained in accordance with our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
            <p>Solvia is provided "as is." We do not guarantee uninterrupted service or error-free functionality.</p>
            <p className="mt-4">To the fullest extent permitted by law, Solvia UG is not liable for:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Loss of employment opportunities</li>
              <li>Employer or candidate behavior</li>
              <li>Technical issues, data loss, or platform downtime</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to These Terms</h2>
            <p>
              We may update these Terms periodically. We will notify users of material changes via email or through the platform. 
              Continued use after changes indicates your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Germany, without regard to conflict of law principles. 
              Any legal disputes shall be subject to the jurisdiction of the courts in Frankfurt am Main, Germany.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact</h2>
            <p>
              For questions about these Terms, contact:
            </p>
            <p className="mt-4">
              Solvia UG<br />
              📍 Rudolfstraße 21, Apt 08<br />
              60327 Frankfurt am Main<br />
              Hessen, Germany
            </p>
            <p className="mt-4">
              📧 teymur.mammadov@thesolvia.com
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Terms;
