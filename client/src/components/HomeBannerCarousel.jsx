import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import img1 from "@/assets/images/img1.jpg";
import img2 from "@/assets/images/img2.png";
import img3 from "@/assets/images/img3.jpg";
import img4 from "@/assets/images/img4.jpg";

const banners = [
  { id: 1, img: img4, alt: "Big Deals" },
  { id: 2, img: img2, alt: "Electronics Sale" },
  { id: 3, img: img3, alt: "Top Picks" },
  { id: 4, img: img1, alt: "Weekly Offers" },
];

const HomeBannerCarousel = () => {
 return (
    <div className="relative w-full max-w-[1400px] mx-auto rounded overflow-hidden shadow-sm ">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        loop
        className="home-banner-carousel"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <img
              src={banner.img}
              alt={banner.alt || `banner-${banner.id}`}
              className="w-full h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] object-cover select-none"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default HomeBannerCarousel;
