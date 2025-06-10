
import React from 'react';
import { Check, MapPin, Heart, Users, Building } from 'lucide-react';

const USPSection = () => {
  const usps = [
    {
      icon: Check,
      title: "Te acompañamos en cada paso",
      description: "Desde el reconocimiento de tu título y el examen FSP hasta la búsqueda de trabajo, visa y vivienda—te guiamos paso a paso en una sola plataforma."
    },
    {
      icon: Check,
      title: "Plataforma inteligente con toque humano",
      description: "Sigue tu progreso, sube documentos y recibe recordatorios. Y si necesitas ayuda, nuestro equipo está a solo un mensaje de distancia."
    },
    {
      icon: Check,
      title: "Especialistas en médicos internacionales",
      description: "Entendemos los desafíos únicos que enfrentan los profesionales de América Latina, Asia, África o Europa del Este. Sabemos qué funciona—y te ayudamos a evitar errores comunes."
    },
    {
      icon: Check,
      title: "Acceso directo a empleadores de confianza",
      description: "Trabajamos con hospitales verificados que valoran el talento internacional. Tú te enfocas en prepararte—nosotros te conectamos con las oportunidades correctas."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Esto es lo que nos hace diferentes:
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Miles de médicos enfrentan un proceso complejo al mudarse a Alemania. En Solvia, lo hacemos simple. Esto es lo que nos diferencia:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {usps.map((usp, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <usp.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">{usp.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{usp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
