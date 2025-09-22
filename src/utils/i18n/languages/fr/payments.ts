export const payments = {
  title: 'Paiement',
  homologation: {
    title: 'Paiement du Processus d\'Homologation',
    description: 'Complétez votre paiement de service d\'homologation pour commencer le processus',
    price: '759€',
    features: [
      'Vérification complète des identifiants',
      'Assistance à la documentation',
      'Support de conformité réglementaire',
      'Orientation d\'expert tout au long du processus',
      'Support personnalisé'
    ]
  },
  discountCode: {
    label: 'Code de Réduction',
    placeholder: 'Entrez le code de réduction',
    apply: 'Appliquer',
    applied: 'Appliqué',
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
    networkError: 'Erreur réseau. Veuillez réessayer.'
  }
};