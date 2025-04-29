
import React from 'react';
import MainLayout from '@/components/MainLayout';

const Privacy = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Effective Date: 29.05.2025</p>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-6">
              Welcome to Solvia! We value your trust and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, 
              in compliance with the General Data Protection Regulation (GDPR) and other applicable laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Who We Are</h2>
            <p>
              Solvia is a healthcare career platform that connects healthcare professionals (such as doctors and nurses) 
              with employers (such as hospitals and care institutions).
            </p>
            <p className="mt-4">
              Solvia GmbH<br />
              Rudolfstraße 21, Apt 08<br />
              60327 Frankfurt am Main<br />
              Hessen, Germany
            </p>
            <p className="mt-4">
              Email: teymur.mammadov@thesolvia.com
            </p>
            <p className="mt-4">
              We act as the Data Controller for your personal data under GDPR.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. What Data We Collect</h2>
            <p>We may collect and process the following categories of personal data:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Identification and Contact Details:</strong> Name, email address, phone number, nationality, residence.</li>
              <li><strong>Professional Information:</strong> Profession, qualifications, specialization (role), languages spoken, work experience, certifications (e.g., Approbation, FSP).</li>
              <li><strong>Uploaded Documents:</strong> CVs, diplomas, licenses, language certificates.</li>
              <li><strong>Platform Usage Data:</strong> Login data, preferences, search history.</li>
              <li><strong>Communication Data:</strong> Messages, scheduling information, interviews, and appointment preferences.</li>
            </ul>
            <p className="mt-4">
              We do not intentionally collect sensitive personal data (e.g., health data) unless required and with your explicit consent.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Data</h2>
            <p>We process your data for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To create and manage your user profile.</li>
              <li>To match you with suitable career opportunities.</li>
              <li>To allow employers to view your public professional profile.</li>
              <li>To facilitate appointment scheduling with prospective employers.</li>
              <li>To communicate with you regarding job opportunities, updates, and platform news.</li>
              <li>To improve and personalize our platform and services.</li>
              <li>To comply with legal obligations.</li>
            </ul>
            
            <p className="mt-4"><strong>Legal Bases for Processing (under GDPR):</strong></p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Your consent (Art. 6(1)(a))</li>
              <li>Contract performance (Art. 6(1)(b))</li>
              <li>Legal obligations (Art. 6(1)(c))</li>
              <li>Our legitimate interests (Art. 6(1)(f)) — e.g., platform improvement, fraud prevention</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Who We Share Your Data With</h2>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Employers/Clients:</strong> Hospitals, clinics, care institutions searching for professionals like you</li>
              <li><strong>Service Providers:</strong> IT systems, hosting, CRM, communication tools (all under strict confidentiality)</li>
              <li><strong>Authorities:</strong> When required by law or regulation</li>
            </ul>
            <p className="mt-4">
              All recipients are GDPR-compliant and subject to appropriate safeguards.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Storage and Security</h2>
            <p>
              Your personal data is stored securely on servers located within the European Economic Area (EEA).
            </p>
            <p className="mt-4">
              We use strong technical and organizational security measures, such as:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Encryption</li>
              <li>Access controls</li>
              <li>Routine backups</li>
              <li>Security monitoring and audits</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. How Long We Keep Your Data</h2>
            <p>We keep your data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>As long as your account remains active</li>
              <li>As needed to fulfill service and legal obligations</li>
              <li>Or until you request deletion (unless longer retention is legally required)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights Under GDPR</h2>
            <p>You can request at any time to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Erase your data ("Right to be Forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Port your data to another provider</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              You also have the right to lodge a complaint with your local data protection authority.
            </p>
            <p className="mt-4">
              To exercise your rights, contact us at:<br />
              📧 teymur.mammadov@thesolvia.com
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
            <p>If your data is transferred outside the EEA, we ensure adequate protection through:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>EU Standard Contractual Clauses (SCCs)</li>
              <li>Transfers only to countries deemed "adequate" by the European Commission</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Cookies and Tracking</h2>
            <p>We use cookies and tracking tools to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Analyze usage</li>
              <li>Improve performance</li>
              <li>Customize your experience</li>
            </ul>
            <p className="mt-4">
              See our separate [Cookie Policy] for full details.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may occasionally update this Privacy Policy. When we do, we will notify you through the platform or by email.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
            <p>For any questions, requests, or complaints, contact:</p>
            <p className="mt-4">
              Solvia GmbH<br />
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

export default Privacy;
