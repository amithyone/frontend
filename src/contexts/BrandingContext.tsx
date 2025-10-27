import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BrandingData {
  is_reseller: boolean;
  panel_id?: number;
  brand_name: string;
  primary_color: string;
  secondary_color: string;
  logo_url: string | null;
  favicon_url: string | null;
  footer_text: string;
  subdomain?: string;
  custom_domain?: string | null;
}

interface BrandingContextType {
  branding: BrandingData | null;
  loading: boolean;
  error: string | null;
  refreshBranding: () => Promise<void>;
  isResellerPanel: () => boolean;
  getPanelId: () => number | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

const defaultBranding: BrandingData = {
  is_reseller: false,
  brand_name: 'FaddedSMS',
  primary_color: '#0f172a',
  secondary_color: '#1c64f2',
  logo_url: null,
  favicon_url: null,
  footer_text: '© 2025 FaddedSMS. All rights reserved.'
};

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/branding`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (data.status === 'success') {
        setBranding(data.data);
        
        // Apply branding to document
        applyBranding(data.data);
      } else {
        setBranding(defaultBranding);
        applyBranding(defaultBranding);
      }
    } catch (err) {
      console.error('Failed to fetch branding:', err);
      setError('Failed to load branding');
      setBranding(defaultBranding);
      applyBranding(defaultBranding);
    } finally {
      setLoading(false);
    }
  };

  const applyBranding = (brandingData: BrandingData) => {
    // Update document title
    document.title = `${brandingData.brand_name} - SMS Verification & VTU Services`;

    // Update favicon
    if (brandingData.favicon_url) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = brandingData.favicon_url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Update theme color meta tag
    let metaThemeColor: HTMLMetaElement | null = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
    }
    metaThemeColor.content = brandingData.primary_color;

    // Apply CSS variables for theming
    document.documentElement.style.setProperty('--brand-primary', brandingData.primary_color);
    document.documentElement.style.setProperty('--brand-secondary', brandingData.secondary_color);
  };

  useEffect(() => {
    fetchBranding();
  }, []);

  const refreshBranding = async () => {
    await fetchBranding();
  };

  const isResellerPanel = (): boolean => {
    return branding?.is_reseller || false;
  };

  const getPanelId = (): number | null => {
    return branding?.panel_id || null;
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, error, refreshBranding, isResellerPanel, getPanelId }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}

