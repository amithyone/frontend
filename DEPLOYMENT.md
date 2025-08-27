# FaddedSMS Deployment Guide

## 🚀 Deployment Options

### 1. Netlify (Recommended)

#### Quick Deploy
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Drag and drop the `dist/` folder to Netlify
   - Or connect your GitHub repository for automatic deployments

#### Environment Variables
Set these in Netlify dashboard:
```
VITE_APP_NAME=FaddedSMS
VITE_API_URL=https://api.faddedsms.com
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

### 2. Vercel

#### Quick Deploy
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

#### Configuration
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 3. GitHub Pages

#### Setup
1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to package.json:
   ```json
   {
     "homepage": "https://yourusername.github.io/faddedsms",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

#### Setup
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase:
   ```bash
   firebase init hosting
   ```

3. Configure `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Production Optimizations

### 1. Environment Setup
Create production `.env`:
```env
VITE_APP_NAME=FaddedSMS
VITE_API_URL=https://api.faddedsms.com
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=error
```

### 2. Build Optimizations
Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react'],
        },
      },
    },
  },
});
```

### 3. Performance Monitoring
Add analytics and monitoring:
- Google Analytics
- Sentry for error tracking
- Web Vitals monitoring

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use different keys for development/production
- Rotate API keys regularly

### 2. Content Security Policy
Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
```

### 3. HTTPS
- Always use HTTPS in production
- Set up SSL certificates
- Enable HSTS headers

## 📊 Monitoring & Analytics

### 1. Performance Monitoring
- Lighthouse CI
- Web Vitals tracking
- Bundle size monitoring

### 2. Error Tracking
- Sentry integration
- Console error monitoring
- User feedback collection

### 3. Usage Analytics
- Google Analytics 4
- User behavior tracking
- Conversion funnel analysis

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📱 Mobile App Deployment

### PWA Configuration
The app is already configured as a PWA. To deploy:

1. Ensure service worker is registered
2. Add to home screen functionality
3. Offline support implementation
4. Push notification setup

### App Store Deployment
For native mobile apps:
1. Use Capacitor or React Native
2. Build for iOS/Android
3. Submit to app stores
4. Handle app store guidelines

---

For support with deployment, contact: deploy@faddedsms.com