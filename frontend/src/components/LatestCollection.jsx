import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { useLanguage } from '../context/LanguageContext';
import Pagination from './Pagination';

const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const { language } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const sectionRef = useRef(null);
    
    const ITEMS_PER_PAGE = 15; // Tăng từ 8 lên 15 để mobile thấy nhiều hơn (5 hàng x 3 cột)
    const [currentPage, setCurrentPage] = useState(1);

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map((item) => item.category))];
        return ['All', ...uniqueCategories];
    }, [products]);

    useEffect(() => {
        setCurrentPage(1);
    }, [products, selectedCategory]);

    // Scroll đến đầu section khi chuyển trang
    useEffect(() => {
        if (sectionRef.current) {
            const yOffset = -100; // Offset để không bị che bởi header
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [currentPage]);

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'All') {
            return products;
        }
        return products.filter(item => item.category === selectedCategory);
    }, [products, selectedCategory]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const copy = useMemo(
        () =>
            language === 'vi'
                ? {
                      title1: 'Mới nhất',
                      title2: 'Bộ sưu tập',
                      description:
                          'Khám phá những sản phẩm mới nhất trong bộ sưu tập của chúng tôi. Những sản phẩm được yêu thích nhất, nổi bật về phong cách và chất lượng.',
                      allCategory: 'Tất cả',
                  }
                : {
                      title1: 'Latest',
                      title2: 'Collection',
                      description:
                          'Discover the newest arrivals in our collection. The most loved pieces, selected for standout style and dependable quality.',
                      allCategory: 'All',
                  },
        [language],
    );

    return (
        <section ref={sectionRef} className='pt-0 lg:pt-2 mb-4 md:mb-8'>
            <div className="mb-2 md:mb-6 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 px-2 md:px-0">
                <div className="text-center md:text-left">
                    <Title text1={copy.title1} text2={copy.title2} />
                </div>
                
                {/* Categories Filter */}
                <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    <div className="flex items-center md:justify-center gap-1.5 sm:gap-2 w-max px-2 md:px-0">
                        {categories.map((cat, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold transition-all duration-300 ${
                                    selectedCategory === cat 
                                        ? 'bg-slate-900 text-white shadow-md scale-105' 
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                            >
                                {cat === 'All' ? copy.allCategory : cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-2 md:mt-3 px-2 md:px-0'>
                <div className="grid grid-cols-3 gap-2 md:gap-4 lg:grid-cols-5 w-full">
                    {displayedProducts.map((item, index) => (
                        <ProductItem
                            key={item._id || index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                            oldPrice={item.oldPrice}
                        />
                    ))}
                </div>
                
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                />
            </div>
        </section>
    );
};

export default LatestCollection;
