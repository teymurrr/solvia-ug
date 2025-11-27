export const payments = {
  title: 'Paiement',
  pageTitle: 'Paiement du Processus d\'Homologation',
  pageDescription: 'Choisissez le forfait qui correspond le mieux à vos besoins',
  popular: 'Plus Populaire',
  oneTime: 'paiement unique',
  selected: 'Sélectionné',
  select: 'Sélectionner le Forfait',
  secure: 'Paiement Sécurisé',
  support: 'Support 24h',
  trusted: 'Confiance de 1000+',
  loginPrompt: 'Veuillez vous inscrire ou vous connecter pour continuer le processus de paiement.',
  packages: {
    homologation: {
      title: 'Forfait Basique',
      description: 'Support complet d\'homologation',
      features: [
        'Vérification complète des identifiants',
        'Assistance à la documentation',
        'Support de conformité réglementaire',
        'Support par email'
      ]
    },
    languagePrep: {
      title: 'Forfait Standard',
      description: 'Avec préparation à l\'examen de langue',
      features: [
        'Tout dans le forfait Basique',
        'Préparation en ligne à l\'examen de langue',
        'Matériels de pratique et examens blancs',
        'Suivi de progression'
      ]
    },
    premiumSupport: {
      title: 'Forfait Premium',
      description: 'Support personnalisé complet',
      features: [
        'Tout dans le forfait Standard',
        'Support personnel tout au long du processus',
        'Accès à un professeur d\'allemand',
        'Support de progression et retours'
      ]
    }
  },
  discountCode: {
    label: 'Code de Réduction',
    placeholder: 'Entrez le code de réduction',
    apply: 'Appliquer',
    applied: 'Appliqué',
    remove: 'Supprimer',
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
    proceedToPayment: 'Procéder au Paiement',
    processing: 'Traitement...'
  },
  success: {
    title: 'Paiement Réussi !',
    message: 'Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu.',
    nextSteps: 'Prochaines Étapes',
    stepsList: [
      'Vérifiez votre email pour la confirmation du paiement',
      'Notre équipe vous contactera dans les 24 heures',
      'Commencez votre processus d\'homologation'
    ],
    returnHome: 'Retourner à l\'Accueil',
    viewDashboard: 'Voir le Tableau de Bord'
  },
  cancelled: {
    title: 'Paiement Annulé',
    message: 'Votre paiement a été annulé. Aucun frais n\'a été prélevé sur votre compte.',
    tryAgain: 'Réessayer',
    returnHome: 'Retourner à l\'Accueil'
  },
  errors: {
    general: 'Une erreur s\'est produite lors du traitement du paiement',
    sessionNotFound: 'Session de paiement introuvable',
    verificationFailed: 'La vérification du paiement a échoué',
    networkError: 'Erreur réseau. Veuillez réessayer.',
    selectPackage: 'Veuillez sélectionner un forfait'
  }
};
