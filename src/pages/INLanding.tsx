import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Clock, FileText, TrendingUp } from 'lucide-react';

const INLanding = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate('/homologation-wizard');
  };

  return (
    <MainLayout>
      <SEO
        title="Indian Doctors in Germany: Get Your Medical License Recognized in 2026 | Solvia"
        description="Complete guide for Indian MBBS/MD doctors who want to work in Germany. Learn about the Approbation process, requirements, timeline and costs. Start with our free Wizard."
        path="/in"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🇮🇳 For Indian Medical Professionals
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            10x your medical income.<br />
            <span className="text-blue-600">Practice medicine in Germany.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            German doctors earn €4,500–€8,000+ per month. India has thousands of highly qualified MBBS/MD doctors 
            ready to make the move. The path exists — you just need the right guidance to navigate it.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>€4,500–€8,000/month starting salary</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full border border-gray-200">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <span>MBBS recognized as equivalent</span>
            </div>
          </div>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Check your eligibility — free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">5 minutes · No commitment · Personalized results</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            What Indian doctors face when applying alone
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            The Approbation process for Indian doctors has unique challenges most people don't anticipate:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <Clock className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">MBBS equivalency assessment</h3>
              <p className="text-gray-600 text-sm">German authorities evaluate your MBBS against their medical curriculum. Gaps in specific subjects (mandatory in German training) may require a Kenntnisprüfung (knowledge exam).</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <FileText className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Document attestation is complex</h3>
              <p className="text-gray-600 text-sm">Documents need apostille from MEA India, certified German translations, and verification by the right German state authority. Getting the sequence wrong causes months of delay.</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <TrendingUp className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">German language is the gateway</h3>
              <p className="text-gray-600 text-sm">B2 minimum for Approbation. C1 required for clinical work. Most Indian doctors underestimate the preparation time needed — 12–18 months is realistic starting from zero.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your path from India to Germany
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Eligibility Check', desc: 'Complete our Wizard to assess your documents, German level, and timeline.' },
              { step: '02', title: 'Document Prep', desc: 'Apostille from MEA, certified German translations, and Bundesland-specific checklist.' },
              { step: '03', title: 'Approbation Filing', desc: 'Submit your application to the right German state authority with a complete, error-free file.' },
              { step: '04', title: 'Start Working', desc: 'With Approbation approved, you can practice medicine anywhere in Germany.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Our support packages
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choose the level of guidance that matches your situation.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Essential */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Essential</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">€789</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">One-time payment</p>
              </div>
              <p className="text-gray-600 text-sm mb-6">For doctors who prefer to manage independently with a clear roadmap.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Full document assessment
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Personalized Bundesland checklist
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Access to Homologation Wizard
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Step-by-step downloadable guides
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full">
                Start assessment
              </Button>
            </div>

            {/* Assisted */}
            <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-200 uppercase tracking-wide">Professional</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">€1,490</span>
                </div>
                <p className="text-sm text-blue-200 mt-1">One-time payment</p>
              </div>
              <p className="text-blue-100 text-sm mb-6">We manage your application file with you and coordinate directly with German authorities.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Everything in Essential
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Active application file management
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Bundesland coordination
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  WhatsApp & email support
                </li>
              </ul>
              <Button onClick={handleCTA} className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Get started now
              </Button>
            </div>

            {/* Full */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Premium</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">€2,990</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">One-time payment</p>
              </div>
              <p className="text-gray-600 text-sm mb-6">Full management through Approbation approval, including German language classes.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Everything in Professional
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Support until Approbation issued
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  German language classes included
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Job placement assistance
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full">
                View full package
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start your Germany journey?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Use our free Wizard. In 5 minutes, you'll know exactly where you stand and what your next concrete step is.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg"
          >
            Check your eligibility — free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default INLanding;
