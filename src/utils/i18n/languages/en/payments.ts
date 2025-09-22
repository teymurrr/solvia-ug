export const payments = {
  title: 'Payment',
  homologation: {
    title: 'Homologation Process Payment',
    description: 'Complete your homologation service payment to begin the process',
    price: '€759',
    features: [
      'Complete credential verification',
      'Documentation assistance', 
      'Regulatory compliance support',
      'Expert guidance throughout the process',
      'Personalized support'
    ]
  },
  discountCode: {
    label: 'Discount Code',
    placeholder: 'Enter discount code',
    apply: 'Apply',
    applied: 'Applied',
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
    networkError: 'Network error. Please try again.'
  }
};