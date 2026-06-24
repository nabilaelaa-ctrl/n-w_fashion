"use client";

import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade, Parallax } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

// Import CSS
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

interface Banner {
  id: string;
  title: string | null;
  imageUrl: string;
  link: string | null;
}

export default function HomeSlider({ banners }: { banners: Banner[] }) {
  const[activeIndex, setActiveIndex] = useState(0);
  const progressCircle = useRef<SVGSVGElement>(null);

  if (banners.length === 0) return null;

  // Sinkronisasi Timer Lingkaran
  const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
    }
  };

  return (
    // TINGGI DIUBAH DI SINI: h-[280px] untuk HP, h-[400px] tablet, h-[450px] Desktop
    <div className="relative w-full h-[280px] md:h-[400px] lg:h-[450px] overflow-hidden bg-gray-900">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true}
        speed={800} // Sedikit dipercepat agar terasa lebih responsif
        parallax={true}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.custom-next-sm',
          prevEl: '.custom-prev-sm',
        }}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        modules={[Autoplay, Navigation, EffectFade, Parallax]}
        className="h-full w-full group"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id} className="relative overflow-hidden swiper-slide-compact">
            
            {/* --- BACKGROUND DENGAN NEXT IMAGE --- */}
            <div 
              className="absolute inset-0 bg-image-container"
              data-swiper-parallax="-15%"
            >
              <Image 
                src={banner.imageUrl} 
                alt={banner.title || 'Banner Promo'} 
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
              />
              {/* Overlay agar teks tetap terbaca tanpa membuat gambar terlalu gelap */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            </div>

            {/* --- KONTEN TEKS (Lebih kecil & proporsional) --- */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 max-w-6xl mx-auto">
              <div className="max-w-md md:max-w-lg">
                
                {/* 1. Kategori / Tag */}
                <div className="overflow-hidden mb-2 md:mb-3">
                  <span 
                    className="inline-block text-rose-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase stagger-compact-1"
                    data-swiper-parallax="-100"
                  >
                    ✦ Penawaran Spesial
                  </span>
                </div>

                {/* 2. Judul Utama */}
                <div className="overflow-hidden mb-5 md:mb-6">
                  <h2 
                    className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md stagger-compact-2"
                    data-swiper-parallax="-200"
                  >
                    {banner.title || 'Promo Menarik Hari Ini'}
                  </h2>
                </div>

                {/* 3. Tombol CTA */}
                {banner.link && (
                  <div className="stagger-compact-3" data-swiper-parallax="-300">
                    <Link href={banner.link} className="group/btn relative inline-flex items-center justify-center overflow-hidden rounded-full py-2.5 px-6 md:px-8 font-semibold text-rose-600 bg-white shadow-lg hover:shadow-rose-500/40 transition-all duration-300 text-xs md:text-sm">
                      <span className="absolute inset-0 flex h-full w-full justify-center[transform:skew(-12deg)_translateX(-150%)] group-hover/btn:duration-1000 group-hover/btn:[transform:skew(-12deg)_translateX(150%)] bg-rose-100/50" />
                      <span className="relative flex items-center gap-2">
                        Beli Sekarang
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* --- KONTROL NAVIGASI (Dikecilkan ukurannya) --- */}
        <div className="absolute bottom-4 md:bottom-6 right-4 md:right-8 z-50 flex items-center gap-3 md:gap-4">
          
          {/* Fraction Pagination (Hanya muncul di Desktop) */}
          <div className="hidden md:flex items-baseline text-white font-mono tracking-widest mr-2">
            <span className="text-lg font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className="text-xs opacity-60 mx-1">/</span>
            <span className="text-xs opacity-60">{String(banners.length).padStart(2, '0')}</span>
          </div>

          {/* Tombol Prev */}
          <button className="custom-prev-sm w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-105 backdrop-blur-sm bg-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          {/* Tombol Next + Circular Timer yang Disesuaikan */}
          <button className="custom-next-sm relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover:scale-105 bg-black/20 backdrop-blur-sm">
            {/* SVG Lingkaran Timer (Ukuran radius disesuaikan untuk tombol 40px) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" className="stroke-white/20 fill-none" strokeWidth="2" />
              <circle 
                cx="20" cy="20" r="18" 
                ref={progressCircle}
                className="stroke-rose-500 fill-none transition-all duration-100 ease-linear" 
                strokeWidth="2"
                strokeDasharray="113" /* 2 * pi * r (r=18) = ~113 */
                strokeDashoffset="calc(113 * var(--progress))"
              />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </Swiper>

      {/* --- GLOBAL STYLES --- */}
      <style jsx global>{`
        /* Efek Zoom in yang lebih halus (tidak terlalu ekstrem) */
        .swiper-slide .bg-image-container img {
          transform: scale(1);
          transition: transform 8s ease-out;
        }
        .swiper-slide-active .bg-image-container img {
          transform: scale(1.08); /* Hanya zoom 8% agar tidak pecah di banner kecil */
        }

        /* Animasi Stagger Teks */
        .stagger-compact-1, 
        .stagger-compact-2, 
        .stagger-compact-3 {
          opacity: 0;
          transform: translateY(20px); /* Jarak turun dikecilkan */
        }

        .swiper-slide-active .stagger-compact-1 {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s;
        }
        
        .swiper-slide-active .stagger-compact-2 {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s;
        }

        .swiper-slide-active .stagger-compact-3 {
          opacity: 1;
          transform: translateY(0);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s;
        }
      `}</style>
    </div>
  );
}