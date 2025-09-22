export const payments = {
  title: 'Pago',
  homologation: {
    title: 'Pago del Proceso de Homologación',
    description: 'Complete el pago de su servicio de homologación para comenzar el proceso',
    price: '759€',
    features: [
      'Verificación completa de credenciales',
      'Asistencia con documentación',
      'Soporte de cumplimiento regulatorio', 
      'Orientación experta durante todo el proceso',
      'Soporte personalizado'
    ]
  },
  discountCode: {
    label: 'Código de Descuento',
    placeholder: 'Ingrese código de descuento',
    apply: 'Aplicar',
    applied: 'Aplicado',
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
    networkError: 'Error de red. Por favor intente de nuevo.'
  }
};