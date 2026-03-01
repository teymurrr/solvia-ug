export const payments = {
  blackFriday: {
    label: 'Black Friday',
    title: '50% OFF All Packages!',
    subtitle: 'Use code',
    validUntil: 'Valid until Dec 6',
  },
  title: 'Payment',
  pageTitle: 'Start Your Medical Career in {country}',
  pageDescription: 'Join 500+ medical professionals who successfully obtained their license with our expert guidance',
  popular: 'Most Popular',
  oneTime: 'one-time',
  selected: 'Selected',
  select: 'Choose This Plan',
  secure: 'Secure Payment',
  support: '24h Support',
  trusted: 'Trusted by 500+',
  packagesFor: 'Packages for',
  emailLabel: 'Email Address',
  emailPlaceholder: 'your.email@example.com',
  emailHint: 'We will send your receipt and access details to this email',
  competitorAnchor: 'Competitors charge €8,000–20,000',
  languageNames: {
    german: 'German',
    spanish: 'Spanish',
    italian: 'Italian',
    french: 'French',
  },
  packages: {
    digitalStarter: {
      title: 'Guided Homologation',
      description: 'Expert guidance through every step of your homologation',
      features: [
        'Personal document review before submission',
        'Direct communication with authorities on your behalf',
        'Application submission handled for you',
        'Priority support (24h response)',
        'Progress tracking dashboard'
      ]
    },
    complete: {
      titleBase: 'Homologation +',
      descriptionBase: 'Complete homologation support with medical',
      descriptionEnd: 'language training',
      features: [
        'Everything in Guided Homologation',
        '12-month medical language course',
        '4× live 1:1 coaching sessions (60 min)',
        'Dedicated case manager',
        'WhatsApp and phone support'
      ]
    },
    personalMentorship: {
      titleBase: 'Full All-Inclusive',
      descriptionBase: 'We handle everything — translations, fees, paperwork,',
      descriptionEnd: 'all included',
      features: [
        'All translation and apostille costs included',
        'All official fees and charges covered',
        'Complete authority communication and submissions',
        'Language course + dedicated case manager',
        'In-person support for appointments'
      ]
    }
  },
  discountCode: {
    label: 'Discount Code',
    placeholder: 'Enter discount code',
    apply: 'Apply',
    applied: 'Applied',
    remove: 'Remove',
    off: 'off',
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
    proceedToPayment: 'Start My Journey Now',
    processing: 'Processing...'
  },
  success: {
    title: 'Payment Successful!',
    message: 'Your payment has been processed successfully. You will receive a confirmation email shortly.',
    congratulations: "Congratulations! You've made an excellent decision.",
    reassurance: "You're now one step closer to achieving your dream of practicing medicine in Germany. Our expert team is here to guide you every step of the way.",
    trustBadge1: '500+ Success Stories',
    trustBadge2: 'Expert Guidance',
    trustBadge3: 'Personal Support',
    createAccountTitle: 'Create Your Account',
    createAccountDesc: 'Sign up now to track your progress and get personalized support throughout your homologation journey.',
    signUpNow: 'Sign Up Now',
    continueTitle: 'Continue Your Journey',
    continueDesc: "Your payment is complete! Now let's collect some information and start uploading your documents.",
    startOnboarding: 'Start Document Process',
    phoneTitle: 'Stay Connected',
    phoneDesc: 'Leave your phone number so our team can reach you faster and provide personalized assistance via WhatsApp or call.',
    phoneLabel: 'Phone Number (with country code)',
    phonePlaceholder: '+49 123 456 7890',
    submitPhone: 'Save Phone Number',
    submitting: 'Submitting...',
    phoneSubmitted: 'Phone number saved successfully!',
    phoneThankYou: 'Thank you! We will contact you shortly.',
    verifying: 'Verifying Payment...',
    pleaseWait: 'Please wait while we confirm your payment.',
    nextSteps: 'Next Steps',
    stepsList: [
      'Check your email for payment confirmation',
      'Our team will contact you within 24 hours',
      'Begin your homologation process'
    ],
    accessCodesNotice: 'You will receive your access codes to the homologation platform within 24 hours.',
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
    selectPackage: 'Please select a package',
    invalidEmail: 'Please enter a valid email address'
  },
  popupBlocked: {
    title: 'Open Payment Page',
    description: 'Your browser blocked the payment page from opening automatically. Click the button below to continue.',
    openPayment: 'Open Payment Page',
    cancel: 'Cancel'
  },
  guarantee: '30-day money-back guarantee — no questions asked',
  youSave: 'Save',
  notSure: 'Not sure yet?',
  bookConsultation: 'Book a free 15-min consultation',
  callCta: {
    title: 'Prefer to talk to a real person?',
    subtitle: 'Our medical homologation experts will answer all your questions and help you choose the right plan.',
    button: 'Schedule a Free Call',
    benefit1: 'No commitment required',
    benefit2: 'Get personalized advice',
    benefit3: 'Available in your language',
    or: 'or',
  },
  socialProofQuotes: [
    { text: 'Solvia made the whole process effortless — I got my Approbation in 7 months!', author: 'Dr. María L.', country: 'Spain' },
    { text: 'They handled everything with the authorities. I just focused on my German.', author: 'Dr. Luis F.', country: 'Mexico' },
    { text: 'The best investment I made for my medical career in Germany.', author: 'Dr. Ana R.', country: 'Colombia' },
  ],
  whatHappensNext: {
    title: 'What happens next',
    steps: [
      'Complete payment securely via Stripe',
      'Receive instant access to your dashboard',
      'Your dedicated team contacts you within 24h',
    ]
  }
};
