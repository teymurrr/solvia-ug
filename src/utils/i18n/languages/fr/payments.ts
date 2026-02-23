export const payments = {
  blackFriday: {
    label: 'Black Friday',
    title: '50% DE RÉDUCTION sur tous les forfaits!',
    subtitle: 'Utilisez le code',
    validUntil: 'Valable jusqu\'au 6 déc',
  },
  title: 'Paiement',
  pageTitle: 'Commencez Votre Carrière Médicale en Allemagne',
  pageDescription: 'Rejoignez plus de 500 professionnels médicaux qui ont obtenu avec succès leur licence allemande grâce à notre accompagnement expert',
  popular: 'Plus Populaire',
  oneTime: 'paiement unique',
  selected: 'Sélectionné',
  select: 'Choisir Ce Plan',
  secure: 'Paiement Sécurisé',
  support: 'Support 24h',
  trusted: 'Approuvé par 500+',
  packagesFor: 'Forfaits pour',
  emailLabel: 'Adresse E-mail',
  emailPlaceholder: 'votre.email@exemple.fr',
  emailHint: 'Nous enverrons votre reçu et vos informations d\'accès à cet e-mail',
  limitedOffer: 'Offre de lancement limitée',
  introEnds: 'Prix régulier',
  languageNames: {
    german: 'Allemand',
    spanish: 'Espagnol',
    italian: 'Italien',
    french: 'Français',
  },
  packages: {
    digitalStarter: {
      title: 'Homologation Digitale',
      description: 'Naviguez votre homologation de manière autonome avec notre kit numérique propulsé par l\'IA',
      features: [
        'Guide étape par étape pour chaque document',
        'Analyse et validation de documents par IA',
        'Checklist de documents spécifique au pays et modèles',
        'Instructions pour apostille et traduction',
        'Modèle de CV médical',
        'Support par email (réponse en 72h)',
        'Tableau de bord de suivi de progression'
      ]
    },
    complete: {
      titleBase: 'Homologation Personnelle Complète',
      descriptionBase: 'Homologation guidée par des experts avec révision personnelle des documents et',
      descriptionEnd: 'communication avec les autorités',
      features: [
        'Tout de l\'Homologation Digitale',
        'Révision experte personnelle de chaque document avant soumission',
        'Communication directe avec les autorités en votre nom',
        'Soumission de candidature pour vous',
        'Support prioritaire (réponse en 24h)',
        'Tableau de bord de suivi de progression'
      ]
    },
    personalMentorship: {
      titleBase: 'Homologation Complète +',
      descriptionBase: 'Homologation complète + formation linguistique avec gestionnaire de cas dédié et',
      descriptionEnd: 'accompagnement en personne',
      features: [
        'Tout de l\'Homologation Personnelle Complète',
        'Accès au cours de langue médicale pendant 12 mois',
        '4 sessions en direct 1:1 (60 min) : révision de documents, préparation d\'examen et coaching d\'entretien',
        'Gestionnaire de cas dédié du début à la fin',
        'Accompagnement en personne pour les rendez-vous clés (si disponible)',
        'Nous gérons toute la communication avec les autorités et la paperasse',
        'Support direct WhatsApp et téléphone'
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
  }
};
