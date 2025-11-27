export const payments = {
  title: 'Pago',
  pageTitle: 'Pago del Proceso de Homologación',
  pageDescription: 'Elige el paquete que mejor se adapte a tus necesidades',
  popular: 'Más Popular',
  oneTime: 'pago único',
  selected: 'Seleccionado',
  select: 'Seleccionar Paquete',
  secure: 'Pago Seguro',
  support: 'Soporte 24h',
  trusted: 'Confiado por 1000+',
  loginPrompt: 'Por favor regístrate o inicia sesión para continuar con el proceso de pago.',
  packages: {
    homologation: {
      title: 'Paquete Básico',
      description: 'Soporte completo de homologación',
      features: [
        'Verificación completa de credenciales',
        'Asistencia con documentación',
        'Soporte de cumplimiento regulatorio',
        'Soporte por email'
      ]
    },
    languagePrep: {
      title: 'Paquete Estándar',
      description: 'Con preparación de examen de idioma',
      features: [
        'Todo en el paquete Básico',
        'Preparación online para examen de idioma',
        'Materiales de práctica y exámenes simulados',
        'Seguimiento de progreso'
      ]
    },
    premiumSupport: {
      title: 'Paquete Premium',
      description: 'Soporte personalizado completo',
      features: [
        'Todo en el paquete Estándar',
        'Soporte personal durante todo el proceso',
        'Acceso a profesor de alemán',
        'Soporte de progresión y retroalimentación'
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
    proceedToPayment: 'Proceder al Pago',
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
