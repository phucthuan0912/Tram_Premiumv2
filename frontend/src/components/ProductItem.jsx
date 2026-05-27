import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePageTransition } from '../context/PageTransitionContext';
import { formatMoney } from '../lib/locale';

const copyByLanguage = {
    vi: {
        collection: 'BỘ SƯU TẬP FOREVER',
        view: 'XEM CHI TIẾT',
        sale: 'VỪA GIẢM',
    },
    en: {
        collection: 'FOREVER COLLECTION',
        view: 'QUICK VIEW',
        sale: 'MARKDOWN',
    },
};

const parsePrice = (p) => {
    if (typeof p === 'number') return p;
    if (!p) return 0;
    const numStr = String(p).replace(/\D/g, '');
    return parseInt(numStr, 10) || 0;
};

const ProductItem = ({ id, image, name, price, oldPrice }) => {
    const { language } = useLanguage();
    const t = copyByLanguage[language];
    const navigate = useNavigate();
    const { startTransition } = usePageTransition();
    const imageRef = useRef(null);

    const imageSrc = Array.isArray(image)
        ? image[0]
        : image || 'https://dummyimage.com/600x800/e5e7eb/6b7280&text=No+Image';

    const currentPrice = parsePrice(price);
    const originalPrice = parsePrice(oldPrice);
    let discountPercent = 0;
    
    if (originalPrice > currentPrice && originalPrice > 0) {
        discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }

    const handleClick = useCallback((e) => {
        e.preventDefault();

        const imgEl = imageRef.current;
        if (imgEl) {
            const rect = imgEl.getBoundingClientRect();
            startTransition({
                sourceRect: {
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                },
                imageSrc: imgEl.src || imageSrc,
                productId: id,
            });
        }

        // Navigate after a tiny delay so the overlay can paint first
        requestAnimationFrame(() => {
            navigate(`/product/${id}`);
        });
    }, [id, imageSrc, navigate, startTransition]);

    return (
        <div
            className="group block h-full cursor-pointer"
            onClick={handleClick}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') handleClick(e); }}
        >
            <article className="relative flex h-full flex-col overflow-hidden transition-all duration-700 hover:-translate-y-1">
                {/* Image Section - Editorial Style */}
                <div className="relative overflow-hidden bg-white border border-slate-100" style={{ paddingBottom: '133%' /* 3:4 aspect ratio */ }}>
                    {discountPercent > 0 && (
                        <div className="absolute left-2 top-2 z-10 bg-rose-600 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white tracking-widest shadow-md">
                            SALE {discountPercent}%
                        </div>
                    )}
                    <img
                        ref={imageRef}
                        className="absolute inset-0 h-full w-full object-contain p-2 sm:p-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                        src={imageSrc}
                        alt={name}
                    />
                    
                    {/* Ultra-premium slide-up bar overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-white/95 py-2 sm:py-3 text-center text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a] shadow-[0_-4px_24px_rgba(0,0,0,0.05)] backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                        {t.view}
                    </div>
                </div>

                {/* Text Details Section - Minimalist & Sleek */}
                <div className="flex flex-col pt-2 sm:pt-4 pb-1 sm:pb-2">
                    <p className="mb-0.5 sm:mb-1 text-[8px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b8d7a]">
                        {t.collection}
                    </p>

                    <h3 className="mb-1 sm:mb-2 line-clamp-2 text-[10px] sm:text-[13px] font-medium leading-[1.4] text-[#2d2620] transition-colors group-hover:text-black">
                        {name}
                    </h3>

                    <div className="mt-auto flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                        <p className="text-[11px] sm:text-[14px] font-bold text-[#1a1f25]">
                            {formatMoney(price, language)}
                        </p>
                        {oldPrice > price && (
                            <p className="text-[9px] sm:text-[11px] font-medium text-[#b0a698] line-through">
                                {formatMoney(oldPrice, language)}
                            </p>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default ProductItem;
