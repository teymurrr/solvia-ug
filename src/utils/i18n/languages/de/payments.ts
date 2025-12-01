export const payments = {
  blackFriday: {
    label: 'Black Friday',
    title: '50% RABATT auf alle Pakete!',
    subtitle: 'Code verwenden',
    validUntil: 'Gültig bis 6. Dez',
  },
  title: 'Zahlung',
  pageTitle: 'Starten Sie Ihre Medizinische Karriere in Deutschland',
  pageDescription: 'Schließen Sie sich über 500 medizinischen Fachkräften an, die mit unserer Expertenbegleitung erfolgreich ihre deutsche Approbation erhalten haben',
  popular: 'Beliebteste',
  oneTime: 'einmalig',
  selected: 'Ausgewählt',
  select: 'Diesen Plan Wählen',
  secure: 'Sichere Zahlung',
  support: '24h Support',
  trusted: 'Vertraut von 500+',
  packagesFor: 'Pakete für',
  emailLabel: 'E-Mail-Adresse',
  emailPlaceholder: 'ihre.email@beispiel.de',
  emailHint: 'Wir senden Ihre Quittung und Zugangsdaten an diese E-Mail',
  languageNames: {
    german: 'Deutsch',
    spanish: 'Spanisch',
    italian: 'Italienisch',
    french: 'Französisch',
  },
  packages: {
    homologation: {
      title: 'Homologations-Paket',
      description: 'Komplette Unterstützung für Ihre Approbation',
      features: [
        'Vollständige Dokumentenprüfung & Verifizierung',
        'Schritt-für-Schritt Antragsbegleitung',
        'Behördenkommunikation Unterstützung',
        'E-Mail-Support innerhalb von 48h'
      ]
    },
    languagePrep: {
      titleBase: 'Homologation &',
      descriptionBase: 'Homologation +',
      descriptionEnd: 'Sprachvorbereitung',
      features: [
        'Alles aus dem Homologations-Paket',
        'Fachsprachenprüfung Vorbereitung',
        'Medizinische Sprachkursmaterialien',
        'Wöchentliche Fortschritts-Check-ins'
      ]
    },
    premiumSupport: {
      title: 'Premium-Paket',
      descriptionBase: 'Persönliche Betreuung & 1:1',
      descriptionEnd: 'Unterricht',
      features: [
        'Alles aus dem Homologation & Sprach Paket',
        'Persönlicher Mentor während des gesamten Prozesses',
        '1:1 Sprachunterricht mit Muttersprachler',
        'Unterstützung bei der Jobsuche'
      ]
    }
  },
  discountCode: {
    label: 'Rabattcode',
    placeholder: 'Rabattcode eingeben',
    apply: 'Anwenden',
    applied: 'Angewendet',
    remove: 'Entfernen',
    off: 'Rabatt',
    invalid: 'Ungültiger Rabattcode',
    expired: 'Rabattcode ist abgelaufen',
    used: 'Rabattcode wurde vollständig verwendet',
    notApplicable: 'Nicht anwendbar auf dieses Produkt'
  },
  summary: {
    title: 'Zahlungsübersicht',
    originalPrice: 'Originalpreis',
    discount: 'Rabatt',
    total: 'Gesamt',
    proceedToPayment: 'Jetzt Meinen Weg Starten',
    processing: 'Verarbeitung...'
  },
  success: {
    title: 'Zahlung Erfolgreich!',
    message: 'Ihre Zahlung wurde erfolgreich verarbeitet. Sie erhalten in Kürze eine Bestätigungs-E-Mail.',
    congratulations: 'Herzlichen Glückwunsch! Sie haben eine ausgezeichnete Entscheidung getroffen.',
    reassurance: 'Sie sind jetzt einen Schritt näher daran, Ihren Traum zu verwirklichen, in Deutschland als Arzt zu praktizieren. Unser Expertenteam begleitet Sie bei jedem Schritt.',
    trustBadge1: '500+ Erfolgsgeschichten',
    trustBadge2: 'Expertenbegleitung',
    trustBadge3: 'Persönliche Betreuung',
    createAccountTitle: 'Erstellen Sie Ihr Konto',
    createAccountDesc: 'Registrieren Sie sich jetzt, um Ihren Fortschritt zu verfolgen und während Ihres gesamten Approbationsprozesses persönliche Unterstützung zu erhalten.',
    signUpNow: 'Jetzt Registrieren',
    phoneTitle: 'Bleiben Sie in Kontakt',
    phoneDesc: 'Hinterlassen Sie Ihre Telefonnummer, damit unser Team Sie schneller erreichen und Ihnen persönliche Unterstützung per WhatsApp oder Anruf bieten kann.',
    phoneLabel: 'Telefonnummer (mit Landesvorwahl)',
    phonePlaceholder: '+49 123 456 7890',
    submitPhone: 'Nummer Speichern',
    submitting: 'Wird gesendet...',
    phoneSubmitted: 'Telefonnummer erfolgreich gespeichert!',
    phoneThankYou: 'Vielen Dank! Wir werden Sie in Kürze kontaktieren.',
    verifying: 'Zahlung wird überprüft...',
    pleaseWait: 'Bitte warten Sie, während wir Ihre Zahlung bestätigen.',
    nextSteps: 'Nächste Schritte',
    stepsList: [
      'Überprüfen Sie Ihre E-Mail für die Zahlungsbestätigung',
      'Unser Team wird Sie innerhalb von 24 Stunden kontaktieren',
      'Beginnen Sie Ihren Approbationsprozess'
    ],
    accessCodesNotice: 'Sie erhalten Ihre Zugangscodes zur Homologationsplattform innerhalb von 24 Stunden.',
    returnHome: 'Zurück zur Startseite',
    viewDashboard: 'Dashboard Ansehen'
  },
  cancelled: {
    title: 'Zahlung Abgebrochen',
    message: 'Ihre Zahlung wurde abgebrochen. Es wurden keine Gebühren von Ihrem Konto abgebucht.',
    tryAgain: 'Erneut Versuchen',
    returnHome: 'Zurück zur Startseite'
  },
  errors: {
    general: 'Bei der Zahlungsverarbeitung ist ein Fehler aufgetreten',
    sessionNotFound: 'Zahlungssitzung nicht gefunden',
    verificationFailed: 'Zahlungsverifizierung fehlgeschlagen',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
    selectPackage: 'Bitte wählen Sie ein Paket',
    invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
  },
  popupBlocked: {
    title: 'Zahlungsseite Öffnen',
    description: 'Ihr Browser hat das automatische Öffnen der Zahlungsseite blockiert. Klicken Sie auf die Schaltfläche unten, um fortzufahren.',
    openPayment: 'Zahlungsseite Öffnen',
    cancel: 'Abbrechen'
  }
};
