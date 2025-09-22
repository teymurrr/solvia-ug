export const payments = {
  title: 'Zahlung',
  homologation: {
    title: 'Zahlung für Homologationsverfahren',
    description: 'Schließen Sie Ihre Zahlung für den Homologationsservice ab, um den Prozess zu beginnen',
    price: '759€',
    features: [
      'Vollständige Zeugnisanerkennung',
      'Unterstützung bei der Dokumentation',
      'Regulatorische Compliance-Unterstützung',
      'Expertenberatung während des gesamten Prozesses',
      'Personalisierte Unterstützung'
    ]
  },
  discountCode: {
    label: 'Rabattcode',
    placeholder: 'Rabattcode eingeben',
    apply: 'Anwenden',
    applied: 'Angewendet',
    invalid: 'Ungültiger Rabattcode',
    expired: 'Rabattcode ist abgelaufen',
    used: 'Rabattcode wurde vollständig verwendet',
    notApplicable: 'Nicht auf dieses Produkt anwendbar'
  },
  summary: {
    title: 'Zahlungsübersicht',
    originalPrice: 'Ursprünglicher Preis',
    discount: 'Rabatt',
    total: 'Gesamt',
    proceedToPayment: 'Zur Zahlung',
    processing: 'Verarbeitung...'
  },
  success: {
    title: 'Zahlung Erfolgreich!',
    message: 'Ihre Zahlung wurde erfolgreich verarbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.',
    nextSteps: 'Nächste Schritte',
    stepsList: [
      'Überprüfen Sie Ihre E-Mail für die Zahlungsbestätigung',
      'Unser Team wird Sie innerhalb von 24 Stunden kontaktieren',
      'Beginnen Sie Ihren Homologationsprozess'
    ],
    returnHome: 'Zurück zur Startseite',
    viewDashboard: 'Dashboard anzeigen'
  },
  cancelled: {
    title: 'Zahlung Abgebrochen',
    message: 'Ihre Zahlung wurde abgebrochen. Es wurden keine Gebühren von Ihrem Konto erhoben.',
    tryAgain: 'Erneut Versuchen',
    returnHome: 'Zurück zur Startseite'
  },
  errors: {
    general: 'Ein Fehler ist bei der Zahlungsverarbeitung aufgetreten',
    sessionNotFound: 'Zahlungssitzung nicht gefunden',
    verificationFailed: 'Zahlungsverifikation fehlgeschlagen',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.'
  }
};