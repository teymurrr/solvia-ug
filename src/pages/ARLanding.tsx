import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Clock, FileText, Award } from 'lucide-react';

const ARLanding = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate('/homologation-wizard');
  };

  return (
    <MainLayout>
      <SEO
        title="Médicos argentinos en Alemania: Homologá tu título médico en 2026 | Solvia"
        description="Guía completa para médicos argentinos que quieren homologar su título en Alemania. Conocé los requisitos, plazos y costos. Empezá con nuestro Wizard gratuito."
        path="/ar"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🇦🇷 Para médicos argentinos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ejercé medicina en Alemania.<br />
            <span className="text-blue-600">Nosotros te guiamos en todo el proceso.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            El proceso de homologación para médicos argentinos tiene más pasos de los que parece. 
            Un expediente mal armado puede costarte 6 meses de demora. 
            Con Solvia, lo hacés bien desde el principio.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Evaluá tu situación gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">5 minutos · Sin compromiso · Resultados personalizados</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Lo que nadie te cuenta sobre homologar desde Argentina
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            La mayoría de los médicos argentinos llega a Alemania sin saber esto:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <Clock className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">El proceso dura 12–24 meses</h3>
              <p className="text-gray-600 text-sm">Sin la documentación correcta desde el inicio, cada error reinicia los plazos. Algunos casos se extienden más de 2 años.</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <FileText className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Apostillar no es suficiente</h3>
              <p className="text-gray-600 text-sm">El documento apostillado necesita traducción oficial al alemán. Son dos trámites distintos. El orden importa. El Bundesland elegido también.</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
              <Award className="h-8 w-8 text-yellow-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">El alemán es obligatorio</h3>
              <p className="text-gray-600 text-sm">Sin nivel B2/C1 no hay Approbation. Y sin Approbation, no hay trabajo. Empezar el idioma tarde es el error más común y más caro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Nuestros planes de acompañamiento
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Elegí el nivel de ayuda que necesitás según tu situación y experiencia con trámites en el exterior.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* DIY */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Esencial</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">€789</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pago único</p>
              </div>
              <p className="text-gray-600 text-sm mb-6">Para médicos que prefieren gestionar solos con la hoja de ruta correcta.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Evaluación completa de documentación
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Checklist personalizado por Bundesland
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Acceso al Wizard de homologación
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Guías paso a paso descargables
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full">
                Empezar evaluación
              </Button>
            </div>

            {/* Assisted */}
            <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 shadow-lg relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">MÁS ELEGIDO</span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-blue-200 uppercase tracking-wide">Profesional</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-white">€1.490</span>
                </div>
                <p className="text-sm text-blue-200 mt-1">Pago único</p>
              </div>
              <p className="text-blue-100 text-sm mb-6">Gestionamos el expediente junto con vos y coordinamos con las autoridades alemanas.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Todo lo del plan Esencial
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Gestión activa de tu expediente
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Coordinación con el Bundesland
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-50">
                  <CheckCircle2 className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                  Soporte por WhatsApp y email
                </li>
              </ul>
              <Button onClick={handleCTA} className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Empezar ahora
              </Button>
            </div>

            {/* Full */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Premium</span>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">€2.990</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Pago único</p>
              </div>
              <p className="text-gray-600 text-sm mb-6">Gestión integral hasta obtener la Approbation, incluyendo clases de alemán.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Todo lo del plan Profesional
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Acompañamiento hasta la Approbation
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Clases de alemán incluidas
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  Apoyo para búsqueda laboral
                </li>
              </ul>
              <Button onClick={handleCTA} variant="outline" className="w-full">
                Ver plan completo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para empezar tu camino a Alemania?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Usá nuestro Wizard gratuito. En 5 minutos sabés exactamente dónde estás parado y cuál es tu próximo paso.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg"
          >
            Evaluá tu situación gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default ARLanding;
