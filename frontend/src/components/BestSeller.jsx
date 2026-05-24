import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import RotatingBadge from './RotatingBadge';
import { useLanguage } from '../context/LanguageContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const { language } = useLanguage();
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 15));
    }, [products]);

    const copy = useMemo(
        () =>
            language === 'vi'
                ? {
                      title1: 'BÁN CHẠY',
                      title2: 'NHẤT',
                      hotTrendingBadge: 'ĐANG THỊNH HÀNH - ĐANG THỊNH HÀNH - ',
                  }
                : {
                      title1: 'BEST',
                      title2: 'SELLERS',
                      hotTrendingBadge: 'HOT TRENDING - HOT TRENDING - ',
                  },
        [language],
    );

    return (
        <section className='py-12 sm:py-16'>
            <div className='mb-10 sm:mb-12 relative flex justify-center'>
                <div className="relative inline-flex items-center justify-center">
                    <Title text1={copy.title1} text2={copy.title2} />
                    <div className="absolute -right-28 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                        <RotatingBadge text={copy.hotTrendingBadge} icon="🔥" className="scale-75" />
                    </div>
                </div>
            </div>

            <div className='relative group px-2 sm:px-4'>
                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        nextEl: '.best-next',
                        prevEl: '.best-prev',
                    }}
                    spaceBetween={16}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 4, spaceBetween: 24 },
                        1280: { slidesPerView: 5, spaceBetween: 24 }
                    }}
                    className="!pb-6"
                >
                    {bestSeller.map((item, index) => (
                        <SwiperSlide key={index} className="h-auto">
                            <ProductItem
                                id={item._id}
                                name={item.name}
                                image={item.image}
                                price={item.price}
                                oldPrice={item.oldPrice}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Buttons */}
                <button className="best-prev absolute -left-2 sm:-left-6 top-[35%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[#1a1a1a] transition-all hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed">
                    <ChevronLeft strokeWidth={1} className="h-8 w-8 sm:h-10 sm:w-10 opacity-70 hover:opacity-100" />
                </button>
                <button className="best-next absolute -right-2 sm:-right-6 top-[35%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-[#1a1a1a] transition-all hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed">
                    <ChevronRight strokeWidth={1} className="h-8 w-8 sm:h-10 sm:w-10 opacity-70 hover:opacity-100" />
                </button>
            </div>
        </section>
    );
};

export default BestSeller;
