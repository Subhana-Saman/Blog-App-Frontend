import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import BlogCard from "./BlogCard";

export default function FeaturedBlogs({ blogs }) {
  if (!blogs?.length) return null;

  return (
   <div className="mb-16">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
  <div>
    <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full mb-3" />

    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">
      Featured Blogs
    </h2>

    <p className="text-gray-400 mt-2">
      Trending articles from top creators
    </p>
  </div>

  <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300">
    Top Picks
  </div>
</div>

      {/* FIX: swiper-wrapper ko equal height dena */}
      <style>{`
        .featured-swiper .swiper-wrapper {
          align-items: stretch !important;
        }
        .featured-swiper .swiper-slide {
          height: auto !important;
        }
      `}</style>

      <Swiper
        className="featured-swiper"
        grabCursor={true}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        spaceBetween={24}
        breakpoints={{
          0:    { slidesPerView: 1 },
          640:  { slidesPerView: 1 },
          768:  { slidesPerView: 2 },
          1280: { slidesPerView: 3 },
        }}
      >
        {blogs.map((blog) => (
          <SwiperSlide
            key={blog._id}
            className="pb-10 h-auto"  /* FIX: h-auto — swiper slide khud height lega */
          >
            {/* FIX: h-full — BlogCard parent ki poori height use kare */}
            <div className="h-full">
              <BlogCard blog={blog} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
}