// components/Banner.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { useApp } from "../context/AppContext";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface BannerType {
  _id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  buttonText: string;
  buttonTextBn: string;
  buttonLink: string;
  bgImage: string;
  bgVideo: string;
  textColor: string;
  highlightColor: string;
  gradient: string;
  order: number;
}

export const Banner = () => {
  const { isBn } = useApp();
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banner?active=true");
      const data = await response.json();
      
      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[300px] sm:h-[390px] md:h-[470px] bg-gray-200 animate-pulse"></div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#d9d0cb]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={1000}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          nextEl: ".banner-button-nxt",
          prevEl: ".banner-button-prv",
        }}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="relative w-full h-[300px] sm:h-[390px] md:h-[470px] overflow-hidden">
              {/* Video Background (if video exists) */}
              {banner.bgVideo ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  poster={banner.bgImage || undefined}
                >
                  <source src={banner.bgVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                /* Image Background (fallback) */
                <div
                  className="absolute inset-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('${banner.bgImage}')`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                  }}
                />
              )}
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              
              {/* Content */}
              <div className="container mx-auto h-full w-full flex items-center px-4 relative z-10">
                <div className="max-w-[420px]">
                  <p className={`text-sm font-semibold ${banner.highlightColor}`}>
                    {isBn ? banner.subtitleBn : banner.subtitle}
                  </p>
                  <h1 className={`mt-2 text-4xl font-semibold leading-tight md:text-[48px] ${banner.textColor}`}>
                    {isBn ? banner.titleBn : banner.title}
                  </h1>
                  <Link
                    href={banner.buttonLink}
                    className="mt-5 inline-block rounded-full bg-[#095059] hover:bg-[#0e6e78] px-8 py-3 text-sm font-semibold text-white transition-colors duration-300"
                  >
                    {isBn ? banner.buttonTextBn : banner.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button className="banner-button-prv absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button className="banner-button-nxt absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style jsx>{`
        :global(.banner-swiper .swiper-pagination-bullet) {
          background: white;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        :global(.banner-swiper .swiper-pagination-bullet-active) {
          opacity: 1;
          width: 20px;
          border-radius: 4px;
          background: #ef553f;
        }
        :global(.banner-swiper .swiper-pagination) {
          bottom: 20px !important;
        }
      `}</style>
    </section>
  );
};