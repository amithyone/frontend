import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Plus, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface WalletCarouselProps {
  onFund?: () => void;
}

interface Advertisement {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  background_type: 'color' | 'image';
  background_color: string;
  background_image: string | null;
  text_color: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const WalletCarousel: React.FC<WalletCarouselProps> = ({ onFund }) => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  const balance = user?.balance || 0;

  // Fetch advertisements
  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.fadsms.com/api';
      const url = `${apiUrl}/advertisements`;
      console.log('WalletCarousel: Fetching ads from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('WalletCarousel: API response:', data);
      
      if ((data.status === 'success' || data.success === true) && Array.isArray(data.data)) {
        // Filter featured ads for carousel
        const featuredAds = data.data.filter((ad: Advertisement) => ad.is_featured && ad.is_active);
        console.log('WalletCarousel: Featured ads:', featuredAds.length, featuredAds);
        setAdvertisements(featuredAds);
      } else {
        console.error('WalletCarousel: Invalid API response format:', data);
      }
    } catch (error) {
      console.error('WalletCarousel: Failed to fetch advertisements:', error);
    }
  };

  // Total slides = 1 wallet card + ads
  const totalSlides = 1 + advertisements.length;

  useEffect(() => {
    console.log('WalletCarousel: Total slides:', totalSlides, 'Ads:', advertisements.length);
  }, [totalSlides, advertisements]);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    console.log('WalletCarousel: Setting up auto-scroll, totalSlides:', totalSlides);
    
    if (totalSlides <= 1) {
      console.log('WalletCarousel: Not enough slides for auto-scroll');
      return;
    }

    autoScrollInterval.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % totalSlides;
        console.log('WalletCarousel: Auto-scrolling to slide:', next);
        return next;
      });
    }, 5000);

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [totalSlides]);

  // Scroll to current slide
  useEffect(() => {
    console.log('WalletCarousel: Scrolling to slide:', currentSlide);
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.offsetWidth;
      console.log('WalletCarousel: Container width:', slideWidth, 'Scroll to:', currentSlide * slideWidth);
      scrollContainerRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const handleAdClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getAdBackgroundStyle = (ad: Advertisement) => {
    if (ad.background_type === 'image' && ad.background_image) {
      return {
        backgroundImage: `url(${ad.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: ad.text_color
      };
    }
    return {
      backgroundColor: ad.background_color,
      color: ad.text_color
    };
  };

  return (
    <div className="relative mb-6">
      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Wallet Card */}
        <div className="min-w-full snap-center px-1">
          <div className={`rounded-2xl p-6 text-white shadow-xl transition-all duration-200 ${
            isDark 
              ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
              : 'bg-gradient-to-r from-oxford-blue to-oxford-blue-dark'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-blue-200'
                }`}>Wallet Balance</p>
                <h2 className="text-3xl font-bold">
                  ₦{balance.toLocaleString()}
                </h2>
                <p className={`text-sm mt-1 ${
                  isDark ? 'text-gray-300' : 'text-blue-200'
                }`}>Available for VTU services</p>
              </div>
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-gray-700' : 'bg-white bg-opacity-20'
              }`}>
                <Wallet className="h-8 w-8" />
              </div>
            </div>
            
            <button 
              onClick={onFund} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Fund Wallet</span>
            </button>
          </div>
        </div>

        {/* Advertisement Cards */}
        {advertisements.map((ad) => (
          <div key={ad.id} className="min-w-full snap-center px-1">
            <div
              className="rounded-2xl p-6 shadow-xl transition-all duration-200 cursor-pointer hover:scale-105 relative overflow-hidden min-h-[180px]"
              style={getAdBackgroundStyle(ad)}
              onClick={() => handleAdClick(ad.button_url)}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{ad.title}</h3>
                <p className="text-sm mb-4 opacity-90 line-clamp-2">{ad.description}</p>
                
                <button 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdClick(ad.button_url);
                  }}
                >
                  <span>{ad.button_text}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator (only show if more than 1 slide) */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-3 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-orange-500 w-6' 
                  : isDark ? 'bg-gray-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletCarousel;

