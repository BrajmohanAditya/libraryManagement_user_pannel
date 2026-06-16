import React, { useState, useEffect, useCallback } from "react";
import { useGetHeroSectionHook } from "../../hooks/hero.banner.hook";
import { ChevronLeft, ChevronRight, MapPin, Search, Loader2 } from "lucide-react";

const HeroBanner = ({ searchVal, setSearchVal, onSearch }) => {
  const { data, isLoading } = useGetHeroSectionHook();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = data?.data || [];

  // Auto-slide every 4 seconds
  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  const prevSlideHandler = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Placeholder banners when no data
  const placeholderGradients = [
    "from-blue-600 via-blue-700 to-indigo-800",
    "from-indigo-600 via-purple-700 to-blue-800",
    "from-slate-700 via-blue-800 to-indigo-900",
  ];

  const showBanners = banners.length > 0;
  const totalSlides = showBanners ? banners.length : placeholderGradients.length;

  return (
    <div className="relative w-full h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden rounded-2xl mx-auto">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {showBanners
          ? banners.map((banner, index) => (
              <div key={banner.id || index} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={banner.image}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
            ))
          : placeholderGradients.map((gradient, index) => (
              <div
                key={index}
                className={`w-full h-full flex-shrink-0 bg-gradient-to-br ${gradient} relative`}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
                </div>
              </div>
            ))}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
        <div className="text-center max-w-3xl">



          {/* Search Bar */}
          <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-2xl max-w-xl mx-auto overflow-hidden border border-white/20">
            <div className="flex items-center gap-2 px-5 flex-1">
              <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search libraries near you..."
                value={searchVal || ""}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch && onSearch()}
                className="w-full py-4 text-gray-700 placeholder-gray-400 bg-transparent outline-none text-sm md:text-base"
              />
            </div>
            <button
              onClick={onSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-4 flex items-center gap-2 transition-colors duration-200 font-semibold text-sm md:text-base cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlideHandler}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === index
                  ? "w-8 h-2.5 bg-white"
                  : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-slate-900/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
