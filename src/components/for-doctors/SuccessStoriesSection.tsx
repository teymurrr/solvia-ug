
import React from 'react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Button } from '@/components/ui/button';
import { Quote } from 'lucide-react';

const SuccessStoriesSection = () => {
  const stories = [
    {
      name: "María Fernanda",
      country: "Colombia",
      specialty: "Pediatra en Berlín",
      quote: "Ni siquiera sabía por dónde empezar, pero Solvia me guió paso a paso.",
      story: "María Fernanda, pediatra de Medellín, soñaba con trabajar en Europa pero se sentía abrumada por el proceso. A través de Solvia, aprendió exactamente qué documentos necesitaba, cómo hacer reconocer su título y dónde inscribirse en cursos de alemán. Gracias a la preparación para el examen FSP y coaching para entrevistas, recibió una oferta de trabajo en una clínica pediátrica de Berlín. Hoy trabaja en un hospital moderno, vive con su esposo y está iniciando la reunificación familiar.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Luis Felipe",
      country: "México",
      specialty: "Neurólogo en Baviera",
      quote: "Gracias a Solvia, conseguí una oferta de trabajo antes de llegar a Alemania.",
      story: "Luis Felipe tenía años de experiencia como neurólogo en Monterrey y buscaba un ambiente de trabajo más tecnológico. Solvia le ayudó a traducir sus documentos, encontrar un empleador que valorara su especialidad y gestionar su visa desde México. También se unió a clases intensivas de alemán médico y a un grupo de WhatsApp con compañeros médicos latinos. Hoy trabaja en un hospital universitario en Baviera y ya está involucrado en proyectos de investigación.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Camila",
      country: "Argentina",
      specialty: "Médica General en Renania del Norte",
      quote: "Sin Solvia, no habría aprobado el examen de alemán médico.",
      story: "Camila trabajaba como médica general en Córdoba pero siempre soñó con mudarse a Europa. Después de meses de confusión y sin respuestas claras, encontró Solvia—y todo cambió. Recibió asesoría personalizada, un plan paso a paso para el reconocimiento y lecciones específicas para aprobar el examen FSP. Lo logró en su primer intento y ahora atiende pacientes en un centro de salud en Düsseldorf.",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Diego",
      country: "Chile",
      specialty: "Cirujano Cardiovascular en Hamburgo",
      quote: "Solvia me ayudó no solo a encontrar trabajo, sino también a establecerme con mi familia.",
      story: "Diego, cirujano cardiovascular de Santiago, tenía una carrera establecida pero buscaba nuevos desafíos. Con Solvia, consiguió el reconocimiento de su título, aprobó el examen FSP y recibió una oferta de un hospital en Hamburgo. El equipo también lo apoyó con la búsqueda de vivienda, registro en la ciudad e inscripción de sus hijos en el colegio. Hoy Diego trabaja en uno de los centros quirúrgicos más importantes de Alemania, y su familia está completamente integrada.",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Historias Reales de Éxito
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Conoce a médicos que transformaron sus carreras con Solvia y ahora prosperan en Alemania
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <div 
                key={index} 
                className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20 relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative">
                      <OptimizedImage
                        src={story.image}
                        alt={`${story.name} - Historia de Éxito`}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                        useAspectRatio={false}
                      />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-1">
                        {story.name}
                      </h3>
                      <p className="text-primary font-semibold mb-1">
                        {story.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Originalmente de {story.country}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-primary/30 mb-3" />
                    <blockquote className="text-lg font-medium text-foreground italic leading-relaxed">
                      "{story.quote}"
                    </blockquote>
                  </div>

                  <div className="relative">
                    <p className="text-muted-foreground leading-relaxed">
                      {story.story}
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>

          {/* Call to action button */}
          <div className="text-center mt-16">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/signup/professional" className="flex items-center gap-3">
                Únete a miles de médicos que eligieron Solvia
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                    +
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStoriesSection;
