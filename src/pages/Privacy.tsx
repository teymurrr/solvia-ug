
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useLanguage } from '@/hooks/useLanguage';

const Privacy = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Spanish content
  const spanishContent = {
    title: "Política de Privacidad",
    effectiveDate: "Fecha de vigencia: 29.05.2025",
    intro: "¡Bienvenido a Solvia! Valoramos su confianza y estamos comprometidos a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos su información cuando utiliza nuestra plataforma, en cumplimiento del Reglamento General de Protección de Datos (RGPD) y otras leyes aplicables.",
    sections: {
      whoWeAre: {
        title: "1. Quiénes Somos",
        content: [
          "Solvia es una plataforma de carreras sanitarias que conecta a profesionales de la salud (como médicos y enfermeras) con empleadores (como hospitales e instituciones de atención).",
          "Solvia GmbH\nRudolfstraße 21, Apt 08\n60327 Frankfurt am Main\nHessen, Alemania",
          "Email: teymur.mammadov@thesolvia.com",
          "Actuamos como Responsable del Tratamiento de sus datos personales bajo el RGPD."
        ]
      },
      dataCollection: {
        title: "2. Qué Datos Recopilamos",
        content: [
          "Podemos recopilar y procesar las siguientes categorías de datos personales:",
          "• Detalles de Identificación y Contacto: Nombre, dirección de correo electrónico, número de teléfono, nacionalidad, residencia.",
          "• Información Profesional: Profesión, calificaciones, especialización (rol), idiomas hablados, experiencia laboral, certificaciones (p. ej., Approbation, FSP).",
          "• Documentos Subidos: CVs, diplomas, licencias, certificados de idiomas.",
          "• Datos de Uso de la Plataforma: Datos de inicio de sesión, preferencias, historial de búsqueda.",
          "• Datos de Comunicación: Mensajes, información de programación, entrevistas y preferencias de citas.",
          "No recopilamos intencionalmente datos personales sensibles (p. ej., datos de salud) a menos que sea requerido y con su consentimiento explícito."
        ]
      },
      dataUsage: {
        title: "3. Cómo Usamos Sus Datos",
        content: [
          "Procesamos sus datos para los siguientes propósitos:",
          "• Para crear y gestionar su perfil de usuario.",
          "• Para emparejarlo con oportunidades profesionales adecuadas.",
          "• Para permitir que los empleadores vean su perfil profesional público.",
          "• Para facilitar la programación de citas con posibles empleadores.",
          "• Para comunicarnos con usted sobre oportunidades laborales, actualizaciones y noticias de la plataforma.",
          "• Para mejorar y personalizar nuestra plataforma y servicios.",
          "• Para cumplir con obligaciones legales.",
          "Bases Legales para el Procesamiento (bajo RGPD):",
          "• Su consentimiento (Art. 6(1)(a))",
          "• Ejecución del contrato (Art. 6(1)(b))",
          "• Obligaciones legales (Art. 6(1)(c))",
          "• Nuestros intereses legítimos (Art. 6(1)(f)) — p. ej., mejora de la plataforma, prevención de fraudes"
        ]
      },
      dataSharing: {
        title: "4. Con Quién Compartimos Sus Datos",
        content: [
          "• Empleadores/Clientes: Hospitales, clínicas, instituciones de atención que buscan profesionales como usted",
          "• Proveedores de Servicios: Sistemas de TI, alojamiento, CRM, herramientas de comunicación (todos bajo estricta confidencialidad)",
          "• Autoridades: Cuando sea requerido por ley o regulación",
          "Todos los destinatarios cumplen con el RGPD y están sujetos a las salvaguardas apropiadas."
        ]
      },
      dataSecurity: {
        title: "5. Almacenamiento y Seguridad de Datos",
        content: [
          "Sus datos personales se almacenan de forma segura en servidores ubicados dentro del Espacio Económico Europeo (EEE).",
          "Utilizamos medidas de seguridad técnicas y organizativas sólidas, tales como:",
          "• Cifrado",
          "• Controles de acceso",
          "• Copias de seguridad rutinarias",
          "• Monitoreo de seguridad y auditorías"
        ]
      },
      dataRetention: {
        title: "6. Cuánto Tiempo Conservamos Sus Datos",
        content: [
          "Conservamos sus datos:",
          "• Mientras su cuenta permanezca activa",
          "• Según sea necesario para cumplir con las obligaciones de servicio y legales",
          "• O hasta que solicite la eliminación (a menos que se requiera una retención más larga legalmente)"
        ]
      },
      rights: {
        title: "7. Sus Derechos Bajo el RGPD",
        content: [
          "Puede solicitar en cualquier momento:",
          "• Acceder a sus datos personales",
          "• Rectificar información inexacta o incompleta",
          "• Borrar sus datos (\"Derecho al Olvido\")",
          "• Restringir u oponerse al procesamiento",
          "• Portar sus datos a otro proveedor",
          "• Retirar el consentimiento en cualquier momento",
          "También tiene derecho a presentar una queja ante su autoridad local de protección de datos.",
          "Para ejercer sus derechos, contáctenos en:\n📧 teymur.mammadov@thesolvia.com"
        ]
      },
      transfers: {
        title: "8. Transferencias Internacionales de Datos",
        content: [
          "Si sus datos se transfieren fuera del EEE, aseguramos una protección adecuada a través de:",
          "• Cláusulas Contractuales Estándar de la UE (CCE)",
          "• Transferencias solo a países considerados \"adecuados\" por la Comisión Europea"
        ]
      },
      cookies: {
        title: "9. Cookies y Seguimiento",
        content: [
          "Utilizamos cookies y herramientas de seguimiento para:",
          "• Analizar el uso",
          "• Mejorar el rendimiento",
          "• Personalizar su experiencia",
          "Consulte nuestra [Política de Cookies] separada para obtener detalles completos."
        ]
      },
      changes: {
        title: "10. Cambios a Esta Política de Privacidad",
        content: [
          "Podemos actualizar ocasionalmente esta Política de Privacidad. Cuando lo hagamos, le notificaremos a través de la plataforma o por correo electrónico."
        ]
      },
      contact: {
        title: "11. Contáctenos",
        content: [
          "Para cualquier pregunta, solicitud o queja, contacte:",
          "Solvia GmbH\n📍 Rudolfstraße 21, Apt 08\n60327 Frankfurt am Main\nHessen, Alemania",
          "📧 teymur.mammadov@thesolvia.com"
        ]
      }
    }
  };

  // English content (existing)
  const englishContent = {
    title: "Privacy Policy",
    effectiveDate: "Effective Date: 29.05.2025",
    intro: "Welcome to Solvia! We value your trust and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, in compliance with the General Data Protection Regulation (GDPR) and other applicable laws.",
    sections: {
      whoWeAre: {
        title: "1. Who We Are",
        content: [
          "Solvia is a healthcare career platform that connects healthcare professionals (such as doctors and nurses) with employers (such as hospitals and care institutions).",
          "Solvia GmbH\nRudolfstraße 21, Apt 08\n60327 Frankfurt am Main\nHessen, Germany",
          "Email: teymur.mammadov@thesolvia.com",
          "We act as the Data Controller for your personal data under GDPR."
        ]
      },
      dataCollection: {
        title: "2. What Data We Collect",
        content: [
          "We may collect and process the following categories of personal data:",
          "• Identification and Contact Details: Name, email address, phone number, nationality, residence.",
          "• Professional Information: Profession, qualifications, specialization (role), languages spoken, work experience, certifications (e.g., Approbation, FSP).",
          "• Uploaded Documents: CVs, diplomas, licenses, language certificates.",
          "• Platform Usage Data: Login data, preferences, search history.",
          "• Communication Data: Messages, scheduling information, interviews, and appointment preferences.",
          "We do not intentionally collect sensitive personal data (e.g., health data) unless required and with your explicit consent."
        ]
      },
      dataUsage: {
        title: "3. How We Use Your Data",
        content: [
          "We process your data for the following purposes:",
          "• To create and manage your user profile.",
          "• To match you with suitable career opportunities.",
          "• To allow employers to view your public professional profile.",
          "• To facilitate appointment scheduling with prospective employers.",
          "• To communicate with you regarding job opportunities, updates, and platform news.",
          "• To improve and personalize our platform and services.",
          "• To comply with legal obligations.",
          "Legal Bases for Processing (under GDPR):",
          "• Your consent (Art. 6(1)(a))",
          "• Contract performance (Art. 6(1)(b))",
          "• Legal obligations (Art. 6(1)(c))",
          "• Our legitimate interests (Art. 6(1)(f)) — e.g., platform improvement, fraud prevention"
        ]
      },
      dataSharing: {
        title: "4. Who We Share Your Data With",
        content: [
          "• Employers/Clients: Hospitals, clinics, care institutions searching for professionals like you",
          "• Service Providers: IT systems, hosting, CRM, communication tools (all under strict confidentiality)",
          "• Authorities: When required by law or regulation",
          "All recipients are GDPR-compliant and subject to appropriate safeguards."
        ]
      },
      dataSecurity: {
        title: "5. Data Storage and Security",
        content: [
          "Your personal data is stored securely on servers located within the European Economic Area (EEA).",
          "We use strong technical and organizational security measures, such as:",
          "• Encryption",
          "• Access controls",
          "• Routine backups",
          "• Security monitoring and audits"
        ]
      },
      dataRetention: {
        title: "6. How Long We Keep Your Data",
        content: [
          "We keep your data:",
          "• As long as your account remains active",
          "• As needed to fulfill service and legal obligations",
          "• Or until you request deletion (unless longer retention is legally required)"
        ]
      },
      rights: {
        title: "7. Your Rights Under GDPR",
        content: [
          "You can request at any time to:",
          "• Access your personal data",
          "• Rectify inaccurate or incomplete information",
          "• Erase your data (\"Right to be Forgotten\")",
          "• Restrict or object to processing",
          "• Port your data to another provider",
          "• Withdraw consent at any time",
          "You also have the right to lodge a complaint with your local data protection authority.",
          "To exercise your rights, contact us at:\n📧 teymur.mammadov@thesolvia.com"
        ]
      },
      transfers: {
        title: "8. International Data Transfers",
        content: [
          "If your data is transferred outside the EEA, we ensure adequate protection through:",
          "• EU Standard Contractual Clauses (SCCs)",
          "• Transfers only to countries deemed \"adequate\" by the European Commission"
        ]
      },
      cookies: {
        title: "9. Cookies and Tracking",
        content: [
          "We use cookies and tracking tools to:",
          "• Analyze usage",
          "• Improve performance",
          "• Customize your experience",
          "See our separate [Cookie Policy] for full details."
        ]
      },
      changes: {
        title: "10. Changes to This Privacy Policy",
        content: [
          "We may occasionally update this Privacy Policy. When we do, we will notify you through the platform or by email."
        ]
      },
      contact: {
        title: "11. Contact Us",
        content: [
          "For any questions, requests, or complaints, contact:",
          "Solvia GmbH\n📍 Rudolfstraße 21, Apt 08\n60327 Frankfurt am Main\nHessen, Germany",
          "📧 teymur.mammadov@thesolvia.com"
        ]
      }
    }
  };

  const content = currentLanguage === 'es' ? spanishContent : englishContent;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{content.effectiveDate}</p>
          
          <div className="prose prose-slate max-w-none">
            <p className="mb-6">
              {content.intro}
            </p>
            
            {Object.entries(content.sections).map(([key, section]) => (
              <div key={key}>
                <h2 className="text-2xl font-semibold mt-8 mb-4">{section.title}</h2>
                {section.content.map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "mt-4" : ""} style={{ whiteSpace: 'pre-line' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Privacy;
