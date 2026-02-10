import React from 'react';
import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '4915510781160';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola! Me interesa el servicio de homologación de Solvia.');

const WhatsAppButton: React.FC = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
