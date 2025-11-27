export const payments = {
  title: 'Zahlung',
  pageTitle: 'Zahlung für Homologationsverfahren',
  pageDescription: 'Wählen Sie das Paket, das am besten zu Ihren Bedürfnissen passt',
  popular: 'Beliebteste',
  oneTime: 'einmalig',
  selected: 'Ausgewählt',
  select: 'Paket Auswählen',
  secure: 'Sichere Zahlung',
  support: '24h Support',
  trusted: 'Vertraut von 1000+',
  loginPrompt: 'Bitte registrieren Sie sich oder melden Sie sich an, um mit dem Zahlungsprozess fortzufahren.',
  packages: {
    homologation: {
      title: 'Basis-Paket',
      description: 'Vollständige Homologationsunterstützung',
      features: [
        'Vollständige Zeugnisanerkennung',
        'Unterstützung bei der Dokumentation',
        'Regulatorische Compliance-Unterstützung',
        'E-Mail-Support'
      ]
    },
    languagePrep: {
      title: 'Standard-Paket',
      description: 'Mit Sprachprüfungsvorbereitung',
      features: [
        'Alles im Basis-Paket',
        'Online-Sprachprüfungsvorbereitung',
        'Übungsmaterialien & Probeprüfungen',
        'Fortschrittsverfolgung'
      ]
    },
    premiumSupport: {
      title: 'Premium-Paket',
      description: 'Vollständige personalisierte Unterstützung',
      features: [
        'Alles im Standard-Paket',
        'Persönliche Unterstützung während des gesamten Prozesses',
        'Zugang zu Deutschlehrer',
        'Progressionsunterstützung & Feedback'
      ]
    }
  },
  discountCode: {
    label: 'Rabattcode',
    placeholder: 'Rabattcode eingeben',
    apply: 'Anwenden',
    applied: 'Angewendet',
    remove: 'Entfernen',
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
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
    selectPackage: 'Bitte wählen Sie ein Paket'
  }
};
