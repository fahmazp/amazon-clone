import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import img1 from "@/assets/images/img1.png";
import img2 from "@/assets/images/img2.png";
import img3 from "@/assets/images/img3.png";
import img4 from "@/assets/images/img4.png";
import img5 from "@/assets/images/img5.png";
import img6 from "@/assets/images/img6.png";

const banners = [
  { id: 1, img: img1, alt: "Latest Electronics Sale" },
  { id: 2, img: img2, alt: "Big Deals Week" },
  { id: 3, img: img6, alt: "Shop Festival Collections" },
  { id: 4, img: img4, alt: "All Your Needs" },
  { id: 5, img: img3, alt: "Weekly Discounts" },
  { id: 6, img: img5, alt: "Grab Festive Offers" }
];

export default function HomeBannerCarousel() {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto overflow-hidden rounded-b-lg shadow-md mt-0">

      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="home-banner"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full">
              <img
                src={banner.img}
                alt={banner.alt}
                className="w-full h-[250px] sm:h-[300px] md:h-[360px] lg:h-[430px] object-cover transform transition-transform duration-2000 scale-100 hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-b from-black/10 to-black/40" />

              <div className="absolute left-6 bottom-4 md:bottom-10 text-gray-300 drop-shadow-3xl">
                <h2 className="text-lg md:text-2xl font-semibold">{banner.alt}</h2>
                <button className="mt-0.5 md:mt-2 px-2.5 md:px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded shadow">
                  Shop Now
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-linear-to-t from-white to-transparent pointer-events-none" />

    </div>
  );
}
