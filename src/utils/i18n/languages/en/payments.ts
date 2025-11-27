export const payments = {
  title: 'Payment',
  pageTitle: 'Homologation Process Payment',
  pageDescription: 'Choose the package that best fits your needs',
  popular: 'Most Popular',
  oneTime: 'one-time',
  selected: 'Selected',
  select: 'Select Package',
  secure: 'Secure Payment',
  support: '24h Support',
  trusted: 'Trusted by 1000+',
  loginPrompt: 'Please sign up or log in to continue with the payment process.',
  packages: {
    homologation: {
      title: 'Basic Package',
      description: 'Full homologation support',
      features: [
        'Complete credential verification',
        'Documentation assistance',
        'Regulatory compliance support',
        'Email support'
      ]
    },
    languagePrep: {
      title: 'Standard Package',
      description: 'With language exam preparation',
      features: [
        'Everything in Basic package',
        'Online language exam preparation',
        'Practice materials & mock exams',
        'Progress tracking'
      ]
    },
    premiumSupport: {
      title: 'Premium Package',
      description: 'Complete personalized support',
      features: [
        'Everything in Standard package',
        'Personal support throughout process',
        'Access to German teacher',
        'Progression support & feedback'
      ]
    }
  },
  discountCode: {
    label: 'Discount Code',
    placeholder: 'Enter discount code',
    apply: 'Apply',
    applied: 'Applied',
    remove: 'Remove',
    invalid: 'Invalid discount code',
    expired: 'Discount code has expired',
    used: 'Discount code has been fully used',
    notApplicable: 'Not applicable to this product'
  },
  summary: {
    title: 'Payment Summary',
    originalPrice: 'Original Price',
    discount: 'Discount',
    total: 'Total',
    proceedToPayment: 'Proceed to Payment',
    processing: 'Processing...'
  },
  success: {
    title: 'Payment Successful!',
    message: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
    nextSteps: 'Next Steps',
    stepsList: [
      'Check your email for payment confirmation',
      'Our team will contact you within 24 hours',
      'Begin your homologation process'
    ],
    returnHome: 'Return to Home',
    viewDashboard: 'View Dashboard'
  },
  cancelled: {
    title: 'Payment Cancelled',
    message: 'Your payment was cancelled. No charges have been made to your account.',
    tryAgain: 'Try Again',
    returnHome: 'Return to Home'
  },
  errors: {
    general: 'An error occurred during payment processing',
    sessionNotFound: 'Payment session not found',
    verificationFailed: 'Payment verification failed',
    networkError: 'Network error. Please try again.',
    selectPackage: 'Please select a package'
  }
};
