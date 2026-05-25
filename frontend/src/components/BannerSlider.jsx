import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';

const BannerSlider = () => {
    const { banners, navigate } = useContext(ShopContext);

    if (!banners || banners.length === 0) {
        return null;
    }

    // Sắp xếp banner theo order
    const sortedBanners = [...banners].sort(
        (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)
    );

    return (
        <div className="relative w-full overflow-hidden py-0 lg:py-4"> 
            <Swiper
                slidesPerView={'auto'}
                spaceBetween={0}
                speed={3000}
                loop={true}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    reverseDirection: true, // Chạy từ trái sang phải
                }}
                freeMode={true}
                modules={[Autoplay]}
                className="banner-swiper"
            >
                {sortedBanners.map((item, index) => (
                    <SwiperSlide 
                        key={item._id || index}
                        style={{ width: 'auto' }}
                    >
                        <div 
                            className="relative w-[240px] sm:w-[320px] lg:w-[400px] aspect-[16/9] cursor-pointer overflow-hidden bg-white transition-all duration-300 hover:scale-[1.02]"
                            onClick={() => item.link && navigate(item.link)}
                        >
                            <img 
                                src={item.image} 
                                alt={item.title || 'Banner'} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            {item.title && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-2 sm:p-3">
                                    <h3 className="text-white text-[10px] sm:text-xs font-bold mb-1 tracking-tight drop-shadow-md line-clamp-1 leading-tight">
                                        {item.title}
                                    </h3>
                                    {item.link && (
                                        <button className="w-fit bg-white/95 text-slate-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold text-[9px] sm:text-[10px] hover:bg-slate-900 hover:text-white transition-all duration-200 shadow-sm">
                                            Xem ngay
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BannerSlider;