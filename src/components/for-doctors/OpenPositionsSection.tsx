
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const OpenPositionsSection = () => {
  const positions = [
    {
      id: 1,
      title: "Cardiólogo",
      hospital: "Hospital Universitario de Múnich",
      location: "Múnich, Baviera",
      type: "Tiempo completo",
      posted: "Hace 2 días",
      description: "Únete a nuestro equipo de cardiólogos expertos brindando atención cardíaca.",
      requirements: ["Alemán nivel C1", "Licencia médica europea", "3+ años de experiencia"]
    },
    {
      id: 2,
      title: "Médico de Urgencias",
      hospital: "Charité Berlín",
      location: "Berlín",
      type: "Tiempo completo",
      posted: "Hace 1 semana",
      description: "Trabaja en uno de los departamentos de emergencias más importantes de Alemania.",
      requirements: ["Alemán nivel B2+", "Formación en medicina de urgencias", "Flexibilidad"]
    },
    {
      id: 3,
      title: "Pediatra",
      hospital: "Centro Médico de Hamburgo",
      location: "Hamburgo",
      type: "Tiempo completo",
      posted: "Hace 3 días",
      description: "Brinda atención pediátrica integral en una instalación moderna.",
      requirements: ["Alemán nivel C1", "Especialización en pediatría", "Trabajo en equipo"]
    },
    {
      id: 4,
      title: "Anestesiólogo",
      hospital: "Hospital General de Frankfurt",
      location: "Frankfurt, Hesse",
      type: "Tiempo completo",
      posted: "Hace 5 días",
      description: "Únete a nuestro equipo de anestesiología en un hospital de alto volumen.",
      requirements: ["Alemán nivel B2+", "Certificación en anestesia", "Experiencia en cuidados críticos"]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Posiciones Abiertas
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Descubre oportunidades emocionantes en instituciones de salud líderes en toda Alemania
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {positions.map((position) => (
              <Card key={position.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{position.title}</CardTitle>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {position.posted}
                    </span>
                  </div>
                  <CardDescription className="font-medium text-primary">
                    {position.hospital}
                  </CardDescription>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {position.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requisitos Clave:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button variant="outline" asChild className="group border-primary text-primary hover:bg-primary/10">
              <Link to="/signup/professional" className="flex items-center">
                Ver Todas las Posiciones
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpenPositionsSection;
