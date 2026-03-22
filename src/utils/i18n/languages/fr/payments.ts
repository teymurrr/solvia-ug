export const payments = {
  blackFriday: {
    label: 'Black Friday',
    title: '50% DE RÉDUCTION sur tous les forfaits!',
    subtitle: 'Utilisez le code',
    validUntil: 'Valable jusqu\'au 6 déc',
  },
  title: 'Paiement',
  pageTitle: 'Commencez Votre Carrière Médicale en {country}',
  pageDescription: 'Rejoignez plus de 500 professionnels médicaux qui ont obtenu avec succès leur licence grâce à notre accompagnement expert',
  popular: 'Plus Populaire',
  oneTime: 'paiement unique',
  selected: 'Sélectionné',
  select: 'Commencer Maintenant',
  secure: 'Paiement Sécurisé',
  support: 'Support 24h',
  trusted: 'Approuvé par 500+',
  packagesFor: 'Forfaits pour',
  emailLabel: 'Adresse E-mail',
  emailPlaceholder: 'votre.email@exemple.fr',
  emailHint: 'Nous enverrons votre reçu et vos informations d\'accès à cet e-mail',
  competitorAnchor: 'Les concurrents facturent 8 000–20 000 €',
  languageNames: {
    german: 'Allemand',
    spanish: 'Espagnol',
    italian: 'Italien',
    french: 'Français',
  },
  packages: {
    digitalStarter: {
      title: 'Digital',
      idealFor: 'Je sais ce qu\'il me faut — je veux juste les bons outils et conseils',
      features: [
        'Plateforme d\'homologation digitale en libre-service',
        'Modèles et listes de contrôle pour la préparation des documents',
        'Guide digital étape par étape pour tout le processus',
        'Support par email'
      ]
    },
    complete: {
      title: 'Assisté',
      titleBase: 'Assisté',
      idealFor: 'Je veux que quelqu\'un gère les démarches et parle aux autorités pour moi',
      includesPrefix: 'Tout de Digital, plus :',
      features: [
        'Gestionnaire de cas personnel dédié',
        'Représentation complète et communication avec les autorités',
        'Support prioritaire via WhatsApp & email',
        'Gestionnaire de cas dédié'
      ]
    },
    personalMentorship: {
      titleBase: 'Complet + Cours d\'Allemand',
      idealFor: 'Occupez-vous de tout — je veux juste arriver et travailler',
      includesPrefix: 'Tout de Assisté, plus :',
      zeroExtras: 'Zéro frais supplémentaires',
      features: [
        'Tous les frais de traduction et d\'apostille inclus',
        'Tous les frais et charges officiels couverts',
        'Cours d\'allemand médical de 12 mois inclus',
        'Zéro frais supplémentaires'
      ]
    }
  },
  discountCode: {
    label: 'Code de Réduction',
    placeholder: 'Entrez le code de réduction',
    apply: 'Appliquer',
    applied: 'Appliqué',
    remove: 'Supprimer',
    off: 'de réduction',
    invalid: 'Code de réduction invalide',
    expired: 'Le code de réduction a expiré',
    used: 'Le code de réduction a été entièrement utilisé',
    notApplicable: 'Non applicable à ce produit'
  },
  summary: {
    title: 'Résumé du Paiement',
    originalPrice: 'Prix Original',
    discount: 'Réduction',
    total: 'Total',
    proceedToPayment: 'Commencer Mon Parcours Maintenant',
    processing: 'Traitement...'
  },
  success: {
    title: 'Paiement Réussi!',
    message: 'Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu.',
    congratulations: 'Félicitations! Vous avez pris une excellente décision.',
    reassurance: "Vous êtes maintenant un pas plus près de réaliser votre rêve d'exercer la médecine en Allemagne. Notre équipe d'experts est là pour vous guider à chaque étape.",
    trustBadge1: '500+ Histoires de Réussite',
    trustBadge2: 'Accompagnement Expert',
    trustBadge3: 'Support Personnel',
    createAccountTitle: 'Créez Votre Compte',
    createAccountDesc: "Inscrivez-vous maintenant pour suivre votre progression et bénéficier d'un accompagnement personnalisé tout au long de votre parcours d'homologation.",
    signUpNow: "S'inscrire Maintenant",
    phoneTitle: 'Restez Connecté',
    phoneDesc: 'Laissez votre numéro de téléphone pour que notre équipe puisse vous contacter plus rapidement et vous fournir une assistance personnalisée via WhatsApp ou appel.',
    phoneLabel: 'Numéro de Téléphone (avec indicatif pays)',
    phonePlaceholder: '+33 6 12 34 56 78',
    submitPhone: 'Enregistrer le Numéro',
    submitting: 'Envoi en cours...',
    phoneSubmitted: 'Numéro de téléphone enregistré avec succès!',
    phoneThankYou: 'Merci! Nous vous contacterons bientôt.',
    verifying: 'Vérification du Paiement...',
    pleaseWait: 'Veuillez patienter pendant que nous confirmons votre paiement.',
    nextSteps: 'Prochaines Étapes',
    stepsList: [
      'Vérifiez votre email pour la confirmation de paiement',
      'Notre équipe vous contactera dans les 24 heures',
      "Commencez votre processus d'homologation"
    ],
    accessCodesNotice: "Vous recevrez vos codes d'accès à la plateforme d'homologation dans les 24 heures.",
    returnHome: "Retour à l'Accueil",
    viewDashboard: 'Voir le Tableau de Bord'
  },
  cancelled: {
    title: 'Paiement Annulé',
    message: 'Votre paiement a été annulé. Aucun frais n\'a été débité de votre compte.',
    tryAgain: 'Réessayer',
    returnHome: 'Retour à l\'Accueil'
  },
  errors: {
    general: 'Une erreur s\'est produite lors du traitement du paiement',
    sessionNotFound: 'Session de paiement non trouvée',
    verificationFailed: 'Vérification du paiement échouée',
    networkError: 'Erreur réseau. Veuillez réessayer.',
    selectPackage: 'Veuillez sélectionner un forfait',
    invalidEmail: 'Veuillez entrer une adresse e-mail valide'
  },
  popupBlocked: {
    title: 'Ouvrir la Page de Paiement',
    description: 'Votre navigateur a bloqué l\'ouverture automatique de la page de paiement. Cliquez sur le bouton ci-dessous pour continuer.',
    openPayment: 'Ouvrir la Page de Paiement',
    cancel: 'Annuler'
  },
  guarantee: 'Garantie de remboursement de 30 jours — sans condition',
  youSave: 'Économisez',
  notSure: 'Pas encore sûr(e) ?',
  bookConsultation: 'Réservez une consultation gratuite de 15 min',
  callCta: {
    title: 'Vous préférez parler à une vraie personne ?',
    subtitle: 'Nos experts en homologation médicale répondront à toutes vos questions et vous aideront à choisir le bon plan.',
    button: 'Planifier un Appel Gratuit',
    benefit1: 'Sans engagement',
    benefit2: 'Conseils personnalisés',
    benefit3: 'Disponible dans votre langue',
    or: 'ou',
  },
  socialProofQuotes: [
    { text: 'Solvia a rendu tout le processus facile — j\'ai obtenu mon Approbation en 7 mois !', author: 'Dr. María L.', country: 'Espagne' },
    { text: 'Ils ont tout géré avec les autorités. Je me suis juste concentré sur mon allemand.', author: 'Dr. Luis F.', country: 'Mexique' },
    { text: 'Le meilleur investissement pour ma carrière médicale en Allemagne.', author: 'Dr. Ana R.', country: 'Colombie' },
  ],
  whatHappensNext: {
    title: 'Que se passe-t-il ensuite',
    steps: [
      'Effectuez le paiement en toute sécurité via Stripe',
      'Recevez un accès instantané à votre tableau de bord',
      'Votre équipe dédiée vous contacte sous 24h',
    ]
  }
};
