// Image configuration for replaceable images across the landing page
export const imageConfig = {
  // Header logo
  logo: {
    icon: '/images/faddedsms-logo.png', // FaddedSMS logo with chat bubble icon
    text: '/images/faddedsms-logo.png', // Same logo file (contains both icon and text)
  },
  
  // Hero section images
  hero: {
    background: '/images/hero-background.jpg', // Hero background with blue sky and clouds
    handHoldingPhone: '/images/hero-hand-phone.png', // Hand holding phone with FaddedSMS app - right side of hero
    phoneMockup: '/images/hero-phone-mockup.png', // Replace with phone mockup image
    cloud1: '/images/hero-cloud-1.png', // Replace with cloud decoration 1
    cloud2: '/images/hero-cloud-2.png', // Replace with cloud decoration 2
    cloud3: '/images/hero-cloud-3.png', // Replace with cloud decoration 3
  },
  
  // Feature section icons
  features: {
    privacy: '/images/feature-privacy-icon.png', // Replace with privacy icon
    speed: '/images/feature-speed-icon.png', // Replace with speed icon
    services: '/images/feature-services-icon.png', // Replace with services icon
  },
  
  // Feature cards background images
  featureCards: {
    virtualNumber: '/images/feature-sim-card.png', // SIM card - bottom right of "Get Virtual Number" card
    buyData: '/images/feature-wifi.png', // Wi-Fi symbol - bottom right of "Buy Data" card
  },
  
  // Real numbers section
  realNumbers: {
    ladyWithPhone: '/images/real-numbers-lady.png', // Lady with phone - "Real Numbers for OTP" section
  },
  
  // Service logos
  services: {
    whatsapp: '/images/service-whatsapp.png',
    telegram: '/images/service-telegram.png',
    instagram: '/images/service-instagram.png',
    facebook: '/images/service-facebook.png',
    twitter: '/images/service-twitter.png',
    discord: '/images/service-discord.png',
    tiktok: '/images/service-tiktok.png',
    snapchat: '/images/service-snapchat.png',
    linkedin: '/images/service-linkedin.png',
    pinterest: '/images/service-pinterest.png',
    reddit: '/images/service-reddit.png',
    twitch: '/images/service-twitch.png',
  },
  
  // Background images
  backgrounds: {
    heroGradient: '/images/bg-hero-gradient.png', // Replace with hero background
    featuresBg: '/images/bg-features.png', // Replace with features background
    ctaGradient: '/images/bg-cta-gradient.png', // Replace with CTA background
  },
  
  // Decorative elements
  decorations: {
    notificationBadge1: '/images/decoration-notification-1.png',
    notificationBadge2: '/images/decoration-notification-2.png',
    stepNumber1: '/images/decoration-step-1.png',
    stepNumber2: '/images/decoration-step-2.png',
    stepNumber3: '/images/decoration-step-3.png',
  }
};

// Helper function to get image URL with fallback
export const getImageUrl = (path: string, _fallback?: string): string => {
  // In production, you might want to check if the image exists
  // For now, we'll return the path as-is
  return path;
};

// Helper function to get service logo
export const getServiceLogo = (serviceName: string): string => {
  const serviceKey = serviceName.toLowerCase().replace(/\s+/g, '');
  return imageConfig.services[serviceKey as keyof typeof imageConfig.services] || '/images/service-default.png';
};
