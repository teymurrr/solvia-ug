import React, { useState } from 'react';
import { MessageCircle, Phone, X, Calendar } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const WHATSAPP_NUMBER = '4915259018297';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola! Me interesa el servicio de homologación de Solvia.');
const CALENDLY_URL = 'https://calendly.com/david-rehrl-thesolvia/30min';

const contactLabels: Record<string, { title: string; whatsapp: string; bookCall: string }> = {
  en: { title: 'Contact Us', whatsapp: 'WhatsApp', bookCall: 'Book a Call' },
  es: { title: 'Contáctanos', whatsapp: 'WhatsApp', bookCall: 'Agendar una Llamada' },
  de: { title: 'Kontaktieren Sie uns', whatsapp: 'WhatsApp', bookCall: 'Anruf Buchen' },
  fr: { title: 'Contactez-nous', whatsapp: 'WhatsApp', bookCall: 'Réserver un Appel' },
  ru: { title: 'Свяжитесь с нами', whatsapp: 'WhatsApp', bookCall: 'Записаться на Звонок' },
};

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const labels = contactLabels[currentLanguage] || contactLabels.en;

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expanded options */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Book a Call */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{labels.bookCall}</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-card border shadow-lg rounded-full pl-4 pr-5 py-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
            onClick={() => setIsOpen(false)}
          >
            <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{labels.whatsapp}</span>
          </a>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={labels.title}
        className={`flex items-center justify-center h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 ${
          isOpen
            ? 'bg-muted text-muted-foreground'
            : 'bg-[#25D366] text-white'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Phone className="h-7 w-7" />}
      </button>
    </div>
  );
};

export default WhatsAppButton;
