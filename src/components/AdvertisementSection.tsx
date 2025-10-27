import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

interface Advertisement {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_url: string;
  background_type: 'color' | 'image';
  background_color: string;
  background_image?: string;
  text_color: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const AdvertisementSection: React.FC = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  // Auto-scroll advertisements every 5 seconds
  useEffect(() => {
    if (advertisements.length <= 2) return; // No need to auto-scroll if 2 or fewer ads
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Move by 2 to show next pair
        const next = prev + 2;
        return next >= advertisements.length ? 0 : next;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const fetchAdvertisements = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.fadsms.com/api';
      const url = `${apiUrl}/advertisements`;
      console.log('Fetching advertisements from:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Advertisement response:', data);
      
      if (data.success && data.data && data.data.length > 0) {
        console.log('Setting advertisements:', data.data.length);
        setAdvertisements(data.data);
      } else {
        console.log('No advertisements found');
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextAd = () => {
    setCurrentIndex((prev) => {
      const next = prev + 2;
      return next >= advertisements.length ? 0 : next;
    });
  };

  const prevAd = () => {
    setCurrentIndex((prev) => {
      const next = prev - 2;
      return next < 0 ? Math.max(0, advertisements.length - 2) : next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advertisements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (advertisements.length === 0) {
    return null;
  }

  // Get current pair of ads to display
  const currentAds = advertisements.slice(currentIndex, currentIndex + 2);
  const totalPairs = Math.ceil(advertisements.length / 2);
  const currentPairIndex = Math.floor(currentIndex / 2);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advertisements</h2>
        {advertisements.length > 2 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={prevAd}
              className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Previous ads"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentPairIndex + 1} / {totalPairs}
            </span>
            <button
              onClick={nextAd}
              className="p-1.5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="Next ads"
            >
              <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        )}
      </div>
      
      {/* Two column layout on all screen sizes */}
      <div className="grid grid-cols-2 gap-3 transition-all duration-500">
        {currentAds.map((ad) => (
          <AdCard key={ad.id} advertisement={ad} />
        ))}
        {/* Fill empty slot if odd number of ads */}
        {currentAds.length === 1 && (
          <div className="hidden" />
        )}
      </div>

      {/* Dots indicator */}
      {advertisements.length > 2 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPairs }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 2)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPairIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AdCardProps {
  advertisement: Advertisement;
}

const AdCard: React.FC<AdCardProps> = ({ advertisement }) => {
  const handleClick = () => {
    window.open(advertisement.button_url, '_blank', 'noopener,noreferrer');
  };

  const getBackgroundStyle = () => {
    if (advertisement.background_type === 'image' && advertisement.background_image) {
      return {
        backgroundImage: `url(${advertisement.background_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: advertisement.text_color
      };
    }
    return {
      backgroundColor: advertisement.background_color,
      color: advertisement.text_color
    };
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg p-4 cursor-pointer transition-transform hover:scale-105 min-h-[160px] flex flex-col"
      style={getBackgroundStyle()}
      onClick={handleClick}
    >
      {/* Featured badge */}
      {advertisement.is_featured && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-0.5 rounded-full text-xs font-semibold">
          ⭐
        </div>
      )}
      
      <div className="space-y-2 flex-1 flex flex-col">
        <h3 className="text-sm md:text-base font-bold leading-tight line-clamp-2">
          {advertisement.title}
        </h3>
        
        {advertisement.description && (
          <p className="text-xs md:text-sm opacity-90 leading-snug line-clamp-2 flex-1">
            {advertisement.description}
          </p>
        )}
        
        <button
          className="inline-flex items-center justify-center space-x-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-colors font-medium text-xs md:text-sm w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <span className="truncate">{advertisement.button_text}</span>
          <ExternalLink className="h-3 w-3 flex-shrink-0" />
        </button>
      </div>
      
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
};

export default AdvertisementSection;
