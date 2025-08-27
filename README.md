# FaddedSMS - Multi-Service Phone Verification Platform

A comprehensive SMS verification and Nigerian VTU services platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📱 SMS Verification Services
- **Virtual Numbers**: Get virtual numbers for verification from 200+ services
- **Multiple Countries**: Support for Nigeria, US, UK, Canada, and more
- **Popular Services**: WhatsApp, Telegram, Instagram, Facebook, Twitter, etc.
- **Real-time SMS**: Instant SMS reception and code display

### 💳 Nigerian VTU Services
- **Airtime Purchase**: All Nigerian networks (MTN, Airtel, Glo, 9mobile)
- **Data Bundles**: Network-specific data plans with competitive pricing
- **Cable TV**: DStv, GOtv, StarTimes subscriptions
- **Electricity Bills**: All major Nigerian power distribution companies
- **Betting Wallet**: Fund popular betting platforms
- **Recharge Cards**: Generate and download recharge cards

### 💰 Wallet Management
- **Auto Top-up**: Generate account numbers for instant funding
- **Transaction History**: Complete transaction tracking
- **Balance Management**: Real-time balance updates
- **Expense Tracking**: Detailed spending analytics

### ⚙️ Advanced Features
- **Dark/Light Mode**: Complete theme switching
- **Multi-language**: English, Yoruba, Igbo, Hausa support
- **Security**: 2FA, biometric login, secure transactions
- **Mobile Optimized**: Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks
- **Theme**: Custom Oxford Blue with Orange accents

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd faddedsms

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

### Colors
- **Primary**: Oxford Blue (#14213d)
- **Accent**: Orange (#f97316)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#f59e0b)

### Typography
- **Font**: System fonts with fallbacks
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

## 📱 Mobile Features

- **Bottom Navigation**: Easy thumb navigation
- **Sidebar Menu**: Comprehensive menu system
- **Touch Optimized**: Large touch targets
- **Swipe Gestures**: Intuitive interactions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=FaddedSMS
VITE_API_URL=your-api-url
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

## 📂 Project Structure

```
src/
├── components/           # React components
│   ├── modals/          # Service modals
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── types/               # TypeScript types
├── utils/               # Utility functions
└── styles/              # Global styles
```

## 🚀 Deployment

### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: support@faddedsms.com
- Website: https://faddedsms.com
- Documentation: https://docs.faddedsms.com

---

Built with ❤️ for the Nigerian fintech ecosystem