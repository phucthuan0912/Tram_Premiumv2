import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import RotatingBadge from './RotatingBadge';
import { useLanguage } from '../context/LanguageContext';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const { language } = useLanguage();
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 30));
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
        <section className='py-2 lg:py-6'>
            <div className='mb-3 md:mb-12 relative flex justify-center'>
                <div className="relative inline-flex items-center justify-center">
                    <Title text1={copy.title1} text2={copy.title2} />
                    <div className="absolute -right-28 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                        <RotatingBadge text={copy.hotTrendingBadge} icon="🔥" className="scale-75" />
                    </div>
                </div>
            </div>

            <div className='px-2 md:px-0'>
                <div className="grid grid-cols-3 gap-2 md:gap-4 lg:grid-cols-5 w-full">
                    {bestSeller.slice(0, 15).map((item, index) => (
                        <ProductItem
                            key={item._id || index}
                            id={item._id}
                            name={item.name}
                            image={item.image}
                            price={item.price}
                            oldPrice={item.oldPrice}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BestSeller;
