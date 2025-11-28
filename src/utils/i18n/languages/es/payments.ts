export const payments = {
  title: 'Pago',
  pageTitle: 'Inicia Tu Carrera Médica en Alemania',
  pageDescription: 'Únete a más de 500 profesionales médicos que obtuvieron exitosamente su licencia alemana con nuestra guía experta',
  popular: 'Más Popular',
  oneTime: 'pago único',
  selected: 'Seleccionado',
  select: 'Elegir Este Plan',
  secure: 'Pago Seguro',
  support: 'Soporte 24h',
  trusted: 'Confiado por 500+',
  packagesFor: 'Paquetes para',
  emailLabel: 'Correo Electrónico',
  emailPlaceholder: 'tu.correo@ejemplo.com',
  emailHint: 'Enviaremos tu recibo y detalles de acceso a este correo',
  languageNames: {
    german: 'Alemán',
    spanish: 'Español',
    italian: 'Italiano',
    french: 'Francés',
  },
  packages: {
    homologation: {
      title: 'Paquete Homologación',
      description: 'Apoyo completo para tu reconocimiento de licencia',
      features: [
        'Revisión y verificación completa de documentos',
        'Guía paso a paso para la solicitud',
        'Apoyo en comunicación con autoridades',
        'Soporte por email en 48h'
      ]
    },
    languagePrep: {
      titleBase: 'Paquete Homologación &',
      descriptionBase: 'Homologación + preparación de',
      descriptionEnd: '',
      features: [
        'Todo lo del Paquete Homologación',
        'Preparación del examen de idioma',
        'Materiales de idioma médico',
        'Seguimiento semanal de progreso'
      ]
    },
    premiumSupport: {
      title: 'Paquete Premium',
      descriptionBase: 'Asistencia personal y clases 1:1 de',
      descriptionEnd: '',
      features: [
        'Todo lo del Paquete Homologación & Idioma',
        'Mentor personal durante todo el proceso',
        'Clases 1:1 de idioma con profesor nativo',
        'Asistencia para encontrar trabajo'
      ]
    }
  },
  discountCode: {
    label: 'Código de Descuento',
    placeholder: 'Ingrese código de descuento',
    apply: 'Aplicar',
    applied: 'Aplicado',
    remove: 'Eliminar',
    invalid: 'Código de descuento inválido',
    expired: 'El código de descuento ha expirado',
    used: 'El código de descuento ha sido completamente utilizado',
    notApplicable: 'No aplicable a este producto'
  },
  summary: {
    title: 'Resumen del Pago',
    originalPrice: 'Precio Original',
    discount: 'Descuento',
    total: 'Total',
    proceedToPayment: 'Comenzar Mi Camino Ahora',
    processing: 'Procesando...'
  },
  success: {
    title: '¡Pago Exitoso!',
    message: 'Su pago ha sido procesado exitosamente. Recibirá un email de confirmación en breve.',
    nextSteps: 'Próximos Pasos',
    stepsList: [
      'Revise su email para la confirmación del pago',
      'Nuestro equipo se pondrá en contacto con usted en 24 horas',
      'Comience su proceso de homologación'
    ],
    returnHome: 'Volver al Inicio',
    viewDashboard: 'Ver Panel'
  },
  cancelled: {
    title: 'Pago Cancelado',
    message: 'Su pago fue cancelado. No se han realizado cargos a su cuenta.',
    tryAgain: 'Intentar de Nuevo',
    returnHome: 'Volver al Inicio'
  },
  errors: {
    general: 'Ocurrió un error durante el procesamiento del pago',
    sessionNotFound: 'Sesión de pago no encontrada',
    verificationFailed: 'Falló la verificación del pago',
    networkError: 'Error de red. Por favor intente de nuevo.',
    selectPackage: 'Por favor seleccione un paquete',
    invalidEmail: 'Por favor ingrese un correo electrónico válido'
  }
};
