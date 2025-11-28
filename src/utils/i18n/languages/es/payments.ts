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
  loginPrompt: 'Por favor regístrate o inicia sesión para continuar con el proceso de pago.',
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
      title: 'Paquete Homologación & Alemán',
      description: 'Homologación + Preparación de idioma alemán',
      features: [
        'Todo lo del Paquete Homologación',
        'Preparación FSP y Fachsprachenprüfung',
        'Materiales de alemán médico',
        'Seguimiento semanal de progreso'
      ]
    },
    premiumSupport: {
      title: 'Paquete Premium',
      description: 'Asistencia personal y clases 1:1 de alemán',
      features: [
        'Todo lo del Paquete Homologación & Alemán',
        'Mentor personal durante todo el proceso',
        'Clases 1:1 de alemán con profesor nativo',
        'Asistencia para encontrar trabajo en Alemania'
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
    selectPackage: 'Por favor seleccione un paquete'
  }
};
