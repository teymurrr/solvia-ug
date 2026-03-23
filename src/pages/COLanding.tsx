import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Clock, FileText, Award } from 'lucide-react';

const COLanding = () => {
  const navigate = useNavigate();

  const handleCTA = () => {
    navigate('/homologation-wizard');
  };

  return (
    <MainLayout>
      <SEO
        title="Médicos colombianos en Alemania: Homologa tu título médico en 2026 | Solvia"
        description="Guía completa para médicos colombianos que quieren homologar su título en Alemania. Conoce los requisitos, plazos y costos. Empieza con nuestro Wizard gratuito."
        path="/co"
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-yellow-50 via-white to-red-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            🇨🇴 Para médicos colombianos
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ejerce medicina en Alemania.<br />
            <span className="text-blue-600">Te guiamos en cada paso del proceso.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cada año más médicos colombianos construyen su carrera en Alemania. 
            El camino existe, pero requiere preparación. 
            Con Solvia, tienes un equipo experto que te acompaña desde Colombia hasta la Approbation.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Evalúa tu situación gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-gray-500 mt-4">5 minutos · Sin compromiso · Resultados personalizados</p>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Lo que nadie te cuenta sobre homologar desde Colombia
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Los médicos colombianos que intentan el proceso solos enfrentan estos obstáculos:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <Clock className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Tiempos que se extienden</h3>
              <p className="text-gray-600 text-sm">Sin la documentación correcta desde el inicio, el proceso puede durar 18 a 24 meses. Cada error en el expediente reinicia los plazos de revisión.</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <FileText className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">El trámite en Colombia es complejo</h3>
              <p className="text-gray-600 text-sm">Apostilla en la Cancillería, traducciones certificadas, verificación ante la Tribunal Superior — cada paso tiene sus propias exigencias y tiempos.</p>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
              <Award className="h-8 w-8 text-yellow-500 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">El alemán define todo</h3>
              <p className="text-gray-600 text-sm">Sin nivel B2 no hay Approbation. Sin nivel C1 es difícil conseguir trabajo clínico. El idioma es la barrera más subestimada por los médicos colombianos.</p>
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
            Elige el nivel de apoyo que se adapte a tu situación y disponibilidad de tiempo.
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
              <p className="text-gray-600 text-sm mb-6">Para médicos que prefieren gestionar solos con la ruta correcta trazada.</p>
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
                Comenzar evaluación
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
              <p className="text-blue-100 text-sm mb-6">Gestionamos el expediente contigo y coordinamos directamente con las autoridades alemanas.</p>
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
                  <CheckCircle2 className="h-4 w-4 text-green-200 mt-0.5 shrink-0" />
                  Soporte por WhatsApp y email
                </li>
              </ul>
              <Button onClick={handleCTA} className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Comenzar ahora
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
            ¿Listo para construir tu carrera en Alemania?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Usa nuestro Wizard gratuito. En 5 minutos sabes exactamente cuál es tu punto de partida y qué debes hacer primero.
          </p>
          <Button
            onClick={handleCTA}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg"
          >
            Evalúa tu situación gratis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default COLanding;
