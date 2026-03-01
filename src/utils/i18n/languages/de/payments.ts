export const payments = {
  blackFriday: {
    label: 'Black Friday',
    title: '50% RABATT auf alle Pakete!',
    subtitle: 'Code verwenden',
    validUntil: 'Gültig bis 6. Dez',
  },
  title: 'Zahlung',
  pageTitle: 'Starten Sie Ihre Medizinische Karriere in {country}',
  pageDescription: 'Schließen Sie sich über 500 medizinischen Fachkräften an, die mit unserer Expertenbegleitung erfolgreich ihre Approbation erhalten haben',
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
  competitorAnchor: 'Wettbewerber verlangen €8.000–20.000',
  languageNames: {
    german: 'Deutsch',
    spanish: 'Spanisch',
    italian: 'Italienisch',
    french: 'Französisch',
  },
  packages: {
    digitalStarter: {
      title: 'Begleitete Homologation',
      description: 'Expertenbegleitung bei jedem Schritt Ihrer Approbation',
      features: [
        'Persönliche Dokumentenprüfung vor jeder Einreichung',
        'Direkte Kommunikation mit Behörden in Ihrem Namen',
        'Antragstellung wird für Sie übernommen',
        'Prioritäts-Support (Antwort in 24h)',
        'Fortschritts-Dashboard'
      ]
    },
    complete: {
      titleBase: 'Homologation +',
      descriptionBase: 'Komplette Homologationsunterstützung mit medizinischem',
      descriptionEnd: 'Sprachtraining',
      features: [
        'Alles aus Begleitete Homologation',
        '12 Monate medizinischer Sprachkurs',
        '4× Live-1:1-Coaching-Sitzungen (60 Min)',
        'Persönlicher Fallmanager',
        'WhatsApp- und Telefon-Support'
      ]
    },
    personalMentorship: {
      titleBase: 'Komplett All-Inclusive',
      descriptionBase: 'Wir kümmern uns um alles — Übersetzungen, Gebühren, Papierkram,',
      descriptionEnd: 'alles inklusive',
      features: [
        'Alle Übersetzungs- und Apostillekosten inklusive',
        'Alle offiziellen Gebühren und Abgaben abgedeckt',
        'Komplette Behördenkommunikation und Anträge',
        'Sprachkurs + persönlicher Fallmanager',
        'Vor-Ort-Unterstützung bei Terminen'
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
  },
  guarantee: '30 Tage Geld-zurück-Garantie — ohne Rückfragen',
  youSave: 'Sparen Sie',
  notSure: 'Noch unsicher?',
  bookConsultation: 'Kostenlose 15-Min-Beratung buchen',
  callCta: {
    title: 'Lieber mit einem echten Menschen sprechen?',
    subtitle: 'Unsere Experten für medizinische Homologation beantworten alle Ihre Fragen und helfen Ihnen, den richtigen Plan zu wählen.',
    button: 'Kostenloses Gespräch Vereinbaren',
    benefit1: 'Unverbindlich',
    benefit2: 'Persönliche Beratung',
    benefit3: 'In Ihrer Sprache verfügbar',
    or: 'oder',
  },
  socialProofQuotes: [
    { text: 'Solvia hat den gesamten Prozess mühelos gemacht — ich habe meine Approbation in 7 Monaten erhalten!', author: 'Dr. María L.', country: 'Spanien' },
    { text: 'Sie haben alles mit den Behörden erledigt. Ich habe mich nur auf mein Deutsch konzentriert.', author: 'Dr. Luis F.', country: 'Mexiko' },
    { text: 'Die beste Investition für meine medizinische Karriere in Deutschland.', author: 'Dr. Ana R.', country: 'Kolumbien' },
  ],
  whatHappensNext: {
    title: 'Was passiert als Nächstes',
    steps: [
      'Sichere Zahlung über Stripe abschließen',
      'Sofortigen Zugang zu Ihrem Dashboard erhalten',
      'Ihr persönliches Team kontaktiert Sie innerhalb von 24h',
    ]
  }
};
