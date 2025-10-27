# Image Replacement Guide for Landing Page

This guide explains how to replace all images in the landing page with your own custom images.

## Image Configuration

All images are configured in `/src/config/images.ts`. You can modify the paths to point to your own images.

## Directory Structure

Create the following directory structure in your public folder:

```
public/
└── images/
    ├── faddedsms-logo.png           # FaddedSMS logo with chat bubble icon and text
    ├── hero-hand-phone.png          # Hand holding phone (right side of hero)
    ├── feature-sim-card.png         # SIM card (bottom right of "Get Virtual Number" card)
    ├── feature-wifi.png             # Wi-Fi symbol (bottom right of "Buy Data" card)
    ├── real-numbers-lady.png        # Lady with phone ("Real Numbers for OTP" section)
    ├── app-interface-1.png          # FaddedSMS app interface (additional mockup)
    ├── app-interface-2.png          # Inbox interface (additional mockup)
    ├── hero/
    │   ├── phone-mockup.png
    │   ├── cloud-1.png
    │   ├── cloud-2.png
    │   └── cloud-3.png
    ├── features/
    │   ├── privacy-icon.png
    │   ├── speed-icon.png
    │   └── services-icon.png
    ├── services/
    │   ├── whatsapp.png
    │   ├── telegram.png
    │   ├── instagram.png
    │   ├── facebook.png
    │   ├── twitter.png
    │   ├── discord.png
    │   ├── tiktok.png
    │   ├── snapchat.png
    │   ├── linkedin.png
    │   ├── pinterest.png
    │   ├── reddit.png
    │   └── twitch.png
    ├── backgrounds/
    │   ├── hero-gradient.png
    │   ├── features.png
    │   └── cta-gradient.png
    └── decorations/
        ├── notification-1.png
        ├── notification-2.png
        ├── step-1.png
        ├── step-2.png
        └── step-3.png
```

## Your 6 Specific Images

Based on your requirements, here are the exact image placements:

1. **FaddedSMS Logo** → `faddedsms-logo.png` (Header and footer - chat bubble icon with "faddedsms" text)
2. **Hand holding phone with FaddedSMS app** → `hero-hand-phone.png` (Right side of hero section - shows the actual app interface)
3. **SIM card** → `feature-sim-card.png` (Bottom right of "Get Virtual Number" card as background)
4. **Wi-Fi symbol** → `feature-wifi.png` (Bottom right of "Buy Data" card as background)
5. **Lady with phone** → `real-numbers-lady.png` ("Real Numbers for OTP" section)
6. **App interfaces** → `app-interface-1.png` and `app-interface-2.png` (Additional mockups)

## Image Specifications

### Logo Images
- **faddedsms-logo.png**: 200x40px, PNG format, transparent background (contains chat bubble icon + "faddedsms" text)

### Hero Section Images
- **phone-mockup.png**: 480x800px, PNG format, phone mockup image
- **hand-phone.png**: 320x384px, PNG format, hand holding phone illustration
- **cloud-1.png**: 128x80px, PNG format, cloud decoration
- **cloud-2.png**: 96x64px, PNG format, cloud decoration
- **cloud-3.png**: 160x96px, PNG format, cloud decoration

### Feature Icons
- **privacy-icon.png**: 32x32px, PNG format, privacy/security icon
- **speed-icon.png**: 32x32px, PNG format, speed/lightning icon
- **services-icon.png**: 32x32px, PNG format, services/checkmark icon

### Service Logos
- **All service logos**: 32x32px, PNG format, transparent background
- Use official brand colors and logos where possible

### Background Images
- **hero-gradient.png**: 1920x1080px, PNG format, hero background
- **features.png**: 1920x1080px, PNG format, features section background
- **cta-gradient.png**: 1920x1080px, PNG format, CTA section background

### Decorative Elements
- **notification-1.png**: 100x40px, PNG format, notification badge
- **notification-2.png**: 100x40px, PNG format, notification badge
- **step-1.png**: 80x80px, PNG format, step number decoration
- **step-2.png**: 80x80px, PNG format, step number decoration
- **step-3.png**: 80x80px, PNG format, step number decoration

## How to Replace Images

1. **Prepare your images** according to the specifications above
2. **Upload images** to the appropriate directories in your `public/images/` folder
3. **Update image paths** in `/src/config/images.ts` if needed
4. **Test the landing page** to ensure all images load correctly

## Fallback Behavior

The landing page includes fallback behavior:
- If an image fails to load, it will fall back to CSS-based alternatives
- For service logos, it will show the first letter of the service name
- For decorative elements, it will show text alternatives

## Using the Landing Page

To use the landing page with replaceable images, import and use `LandingPageWithImages` instead of the regular `LandingPage`:

```tsx
import LandingPageWithImages from './components/LandingPageWithImages';

// In your component
<LandingPageWithImages onNavigate={handleNavigate} />
```

## Customization

You can further customize the landing page by:
1. Modifying the image configuration in `images.ts`
2. Adding new image categories
3. Changing the fallback behavior
4. Updating the styling and layout

## Notes

- All images should be optimized for web use
- Use WebP format for better performance (with PNG fallbacks)
- Ensure images are properly compressed
- Test on different screen sizes and devices
- Consider using a CDN for better performance
