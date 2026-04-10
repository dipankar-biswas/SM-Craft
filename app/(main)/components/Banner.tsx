'use client'

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Banner data
const banners = [
  {
    id: 1,
    title: "Shop Best Offers On Sofa Set",
    subtitle: "Tracking Items",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    bgImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2200&auto=format&fit=crop",
    textColor: "text-white",
    highlightColor: "text-lime-300",
    gradient: "from-black/30 via-black/15 to-transparent",
  },
  {
    id: 2,
    title: "Modern Chair Collection",
    subtitle: "Limited Time Offer",
    buttonText: "Explore Now",
    buttonLink: "/shop",
    bgImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=2200&auto=format&fit=crop",
    textColor: "text-white",
    highlightColor: "text-yellow-300",
    gradient: "from-black/40 via-black/20 to-transparent",
  },
  {
    id: 3,
    title: "Luxury Bedroom Sets",
    subtitle: "Up to 50% Off",
    buttonText: "View Deals",
    buttonLink: "/shop",
    bgImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=2200&auto=format&fit=crop",
    textColor: "text-white",
    highlightColor: "text-orange-300",
    gradient: "from-black/30 via-black/15 to-transparent",
  },
  {
    id: 4,
    title: "Dining Table Essentials",
    subtitle: "Free Shipping",
    buttonText: "Shop Collection",
    buttonLink: "/shop",
    bgImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=2200&auto=format&fit=crop",
    textColor: "text-white",
    highlightColor: "text-purple-300",
    gradient: "from-black/30 via-black/15 to-transparent",
  },
];

export const Banner = () => {
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
          <SwiperSlide key={banner.id}>
            <div
              className="relative w-full h-[300px] sm:h-[390px] md:h-[470px]"
              style={{
                backgroundImage: `url('${banner.bgImage}')`,
                backgroundPosition: "right center",
                backgroundSize: "cover",
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient}`} />
              <div className="container mx-auto h-full w-full flex items-center px-4">
                <div className="relative z-10 max-w-[420px] text-white">
                  <p className={`text-sm font-semibold ${banner.highlightColor}`}>
                    {banner.subtitle}
                  </p>
                  <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-[48px]">
                    {banner.title}
                  </h1>
                  <Link
                    href={banner.buttonLink}
                    className="mt-5 inline-block rounded-full bg-[#095059] hover:bg-[#0e6e78] px-8 py-3 text-sm font-semibold transition-colors duration-300"
                  >
                    {banner.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons (Optional) */}
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

      {/* Custom Pagination Styles */}
      <style jsx>{`
        :global(.banner-swiper .swiper-pagination-bullet) {
          background: white;
          // opacity: 0.5;
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