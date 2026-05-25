import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import ReviewSystem from '../components/ReviewSystem';
// REMOVED: VideoReview - Giảm tải trang
// import VideoReview from '../components/VideoReview';
import VirtualTryOn from '../components/VirtualTryOn';
import { formatMoney } from '../lib/locale';

const copyByLanguage = {
    vi: {
        pageTitleSuffix: 'ForeverVN - Th\u1eddi trang cao c\u1ea5p',
        metaDescription: (name) =>
            `Mua ${name} v\u1edbi ch\u1ea5t l\u01b0\u1ee3ng \u0111\u01b0\u1ee3c ch\u1ecdn l\u1ecdc, size r\u00f5 r\u00e0ng v\u00e0 h\u1ed7 tr\u1ee3 giao h\u00e0ng nhanh t\u1eeb ForeverVN.`,
        productDetails: 'Chi ti\u1ebft s\u1ea3n ph\u1ea9m',
        checkingAvailability: '\u0110ang ki\u1ec3m tra t\u1ed3n kho',
        inStock: (count) => `C\u00f2n h\u00e0ng (${count} c\u00e1i)`,
        selectedVariantOutOfStock: 'Phi\u00ean b\u1ea3n \u0111ang ch\u1ecdn \u0111\u00e3 h\u1ebft h\u00e0ng',
        outOfStock: 'H\u1ebft h\u00e0ng',
        inCart: (count) => `Trong gi\u1ecf: ${count}`,
        reviews: '\u0111\u00e1nh gi\u00e1',
        selectSize: 'Ch\u1ecdn size',
        selectColor: 'Ch\u1ecdn m\u00e0u',
        chooseSizeToast: 'Vui l\u00f2ng ch\u1ecdn size',
        chooseColorToast: 'Vui l\u00f2ng ch\u1ecdn m\u00e0u',
        checkingStockToast: '\u0110ang ki\u1ec3m tra t\u1ed3n kho, vui l\u00f2ng ch\u1edd m\u1ed9t ch\u00fat',
        variantOutOfStockToast: 'Phi\u00ean b\u1ea3n n\u00e0y \u0111\u00e3 h\u1ebft h\u00e0ng',
        limitToast: (count) => `B\u1ea1n \u0111ang \u0111\u1eb7t qu\u00e1 s\u1ed1 l\u01b0\u1ee3ng. Ch\u1ec9 c\u00f2n ${count} s\u1ea3n ph\u1ea9m.`,
        unableToAdd: 'Kh\u00f4ng th\u1ec3 th\u00eam s\u1ea3n ph\u1ea9m n\u00e0y',
        addedToCart: '\u0110\u00e3 th\u00eam v\u00e0o gi\u1ecf',
        addToCart: 'Th\u00eam v\u00e0o gi\u1ecf',
        buyNow: 'Mua ngay',
        virtualTryOn: 'Th\u1eed \u0111\u1ed3 \u1ea3o',
        originalProduct: 'H\u00e0ng ch\u00ednh h\u00e3ng 100%',
        codAvailable: 'H\u1ed7 tr\u1ee3 thanh to\u00e1n khi nh\u1eadn h\u00e0ng cho s\u1ea3n ph\u1ea9m n\u00e0y.',
        easyReturn: 'H\u1ed7 tr\u1ee3 \u0111\u1ed5i tr\u1ea3 trong 7 ng\u00e0y.',
        curatedQuality: 'Ch\u1ea5t l\u01b0\u1ee3ng \u0111\u01b0\u1ee3c ch\u1ecdn l\u1ecdc cho nhu c\u1ea7u m\u1eb7c h\u1eb1ng ng\u00e0y.',
        productDescription: 'M\u00f4 t\u1ea3 s\u1ea3n ph\u1ea9m',
        loadingProduct: '\u0110ang t\u1ea3i s\u1ea3n ph\u1ea9m...',
        recentlyViewed: 'S\u1ea3n ph\u1ea9m v\u1eeba xem',
        contactZalo: 'Liên hệ Zalo để đặt hàng',
        scanQR: 'Quét mã QR Zalo',
        contactNow: 'Liên hệ ngay để đặt hàng',
    },
    en: {
        pageTitleSuffix: 'ForeverVN - High-End Fashion',
        metaDescription: (name) =>
            `Shop ${name} with curated quality, clear sizing and fast delivery support from ForeverVN.`,
        productDetails: 'Product Details',
        checkingAvailability: 'Checking availability',
        inStock: (count) => `In stock (${count} left)`,
        selectedVariantOutOfStock: 'Selected variant out of stock',
        outOfStock: 'Out of stock',
        inCart: (count) => `In cart: ${count}`,
        reviews: 'reviews',
        selectSize: 'Select Size',
        selectColor: 'Select Color',
        chooseSizeToast: 'Please choose a size',
        chooseColorToast: 'Please choose a color',
        checkingStockToast: 'Checking stock, please wait a moment',
        variantOutOfStockToast: 'This variant is out of stock',
        limitToast: (count) => `You are ordering too many items. Only ${count} left.`,
        unableToAdd: 'Unable to add this item',
        addedToCart: 'Added to cart',
        addToCart: 'Add To Cart',
        buyNow: 'Buy Now',
        virtualTryOn: 'Virtual Try-On',
        originalProduct: '100% original product',
        codAvailable: 'Cash on delivery is available on this product.',
        easyReturn: 'Easy return and exchange policy within 7 days.',
        curatedQuality: 'Carefully curated quality for everyday wear.',
        productDescription: 'Product Description',
        loadingProduct: 'Loading product...',
        recentlyViewed: 'Recently Viewed',
        contactZalo: 'Contact Zalo to order',
        scanQR: 'Scan Zalo QR Code',
        contactNow: 'Contact now to order',
    },
};

function ensureImageArray(imageValue) {
    if (Array.isArray(imageValue) && imageValue.length > 0) return imageValue;
    if (typeof imageValue === 'string' && imageValue.trim()) return [imageValue.trim()];
    return ['https://dummyimage.com/600x800/e5e7eb/6b7280&text=No+Image'];
}

function ensureSizeArray(sizeValue) {
    if (Array.isArray(sizeValue) && sizeValue.length > 0) return sizeValue;
    return ['Free'];
}

function normalizeCatalogText(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function getVariantKey(size, color = 'Any') {
    return `${String(size || '')}__${String(color || 'Any')}`;
}

function isTryOnEligibleProduct(product) {
    if (!product) return false;

    const catalogText = normalizeCatalogText(
        [product.name, product.category, product.subCategory].filter(Boolean).join(' '),
    );

    const blockedKeywords = [
        'accessor',
        'phu kien',
        'bag',
        'watch',
        'belt',
        'glass',
        'kinh',
        'hat',
        'mu',
        'shoe',
        'giay',
        'dep',
        'sock',
        'wallet',
        'jewelry',
        'jewellery',
    ];

    if (blockedKeywords.some((keyword) => catalogText.includes(keyword))) {
        return false;
    }

    const clothingKeywords = [
        'topwear',
        'bottomwear',
        'winterwear',
        'shirt',
        'tee',
        't-shirt',
        'tshirt',
        'jacket',
        'coat',
        'hoodie',
        'dress',
        'skirt',
        'jean',
        'jeans',
        'pants',
        'trousers',
        'shorts',
        'blazer',
        'sweater',
        'cardigan',
        'ao',
        'quan',
        'vay',
        'dam',
        'khoac',
    ];

    return clothingKeywords.some((keyword) => catalogText.includes(keyword));
}

const Product = () => {
    const { productId } = useParams();
    const { products, cartItems, addToCart, getProductStock, logBehavior, navigate } = useContext(ShopContext);
    const { language } = useLanguage();
    const t = copyByLanguage[language];

    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [color, setColor] = useState('Any');
    const [variantStocks, setVariantStocks] = useState({});
    const [variantLoading, setVariantLoading] = useState(false);
    const [showVTO, setShowVTO] = useState(false);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [magnifierStyle, setMagnifierStyle] = useState({
        display: 'none',
        top: 0,
        left: 0,
        backgroundPosition: '0% 0%',
    });

    const mainImageRef = useRef(null);

    useEffect(() => {
        const item = products.find((p) => String(p._id ?? p.id) === String(productId));

        if (!item) {
            setProductData(null);
            setImage('');
            setSize('');
            setColor('Any');
            return;
        }

        const normalizedImages = ensureImageArray(item.image);
        const normalizedSizes = ensureSizeArray(item.sizes);
        const normalizedColors = Array.isArray(item.colors) ? item.colors : [];

        const normalizedProduct = {
            ...item,
            image: normalizedImages,
            sizes: normalizedSizes,
            colors: normalizedColors,
        };

        setProductData(normalizedProduct);
        setImage(normalizedImages[0]);
        setSize(normalizedSizes[0] || 'Free');
        setColor(normalizedColors[0] || 'Any');

        if (item.videoUrl && item.videoUrl.includes('tiktok.com') && normalizedImages[0].includes('dummyimage.com')) {
            axios
                .get(`https://www.tiktok.com/oembed?url=${item.videoUrl}`)
                .then((res) => {
                    if (res.data?.thumbnail_url) {
                        setImage(res.data.thumbnail_url);
                        setProductData((prev) => (prev ? { ...prev, image: [res.data.thumbnail_url] } : prev));
                    }
                })
                .catch(() => {});
        }
    }, [productId, products]);

    useEffect(() => {
        if (!productId) return;

        try {
            let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            recentlyViewed = recentlyViewed.filter((id) => String(id) !== String(productId));
            recentlyViewed.unshift(productId);
            if (recentlyViewed.length > 6) recentlyViewed.pop();
            localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
        } catch {}

        window.scrollTo(0, 0);
    }, [productId]);

    useEffect(() => {
        if (productId && productData?.category) {
            logBehavior('VIEW_PRODUCT', productId, { category: productData.category });
        }
    }, [logBehavior, productData?.category, productId]);

    useEffect(() => {
        if (!productData) return;

        document.title = `${productData.name} | ${t.pageTitleSuffix}`;

        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.getElementsByTagName('head')[0].appendChild(metaDesc);
        }

        metaDesc.content = t.metaDescription(productData.name);
    }, [productData, t]);

    useEffect(() => {
        if (!productId || !size) {
            return;
        }
    }, [productId, size]);

    const variantOptions = useMemo(() => {
        if (!productData) return [];

        const sizeOptions = ensureSizeArray(productData.sizes);
        const colorOptions =
            Array.isArray(productData.colors) && productData.colors.length > 0
                ? productData.colors
                : ['Any'];

        return sizeOptions.flatMap((variantSize) =>
            colorOptions.map((variantColor) => ({
                size: variantSize,
                color: variantColor || 'Any',
                key: getVariantKey(variantSize, variantColor || 'Any'),
            })),
        );
    }, [productData]);

    useEffect(() => {
        if (!productId || variantOptions.length === 0) {
            setVariantStocks({});
            return;
        }

        let cancelled = false;
        setVariantLoading(true);

        Promise.all(
            variantOptions.map(async (variant) => [
                variant.key,
                await getProductStock(productId, variant.size, variant.color),
            ]),
        )
            .then((entries) => {
                if (cancelled) return;
                setVariantStocks(Object.fromEntries(entries));
            })
            .finally(() => {
                if (!cancelled) {
                    setVariantLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [getProductStock, productId, variantOptions]);

    const canUseVirtualTryOn = useMemo(() => isTryOnEligibleProduct(productData), [productData]);

    useEffect(() => {
        if (!canUseVirtualTryOn) {
            setShowVTO(false);
        }
    }, [canUseVirtualTryOn]);

    const currentVariantQty = useMemo(
        () => Number(cartItems?.[productId]?.[size]?.[color || 'Any'] || 0),
        [cartItems, color, productId, size],
    );

    const selectedVariantStock = useMemo(() => {
        const variantKey = getVariantKey(size, color || 'Any');
        if (!Object.prototype.hasOwnProperty.call(variantStocks, variantKey)) return null;
        return Number(variantStocks[variantKey] || 0);
    }, [color, size, variantStocks]);

    const hasAnyAvailableVariant = useMemo(
        () => variantOptions.some((variant) => Number(variantStocks[variant.key] || 0) > 0),
        [variantOptions, variantStocks],
    );

    useEffect(() => {
        if (variantOptions.length === 0 || Object.keys(variantStocks).length === 0) return;

        const selectedKey = getVariantKey(size, color || 'Any');
        const selectedStock = Number(variantStocks[selectedKey] || 0);
        if (selectedStock > 0) return;

        const firstAvailable = variantOptions.find((variant) => Number(variantStocks[variant.key] || 0) > 0);
        if (!firstAvailable) return;

        if (firstAvailable.size !== size) setSize(firstAvailable.size);
        if (firstAvailable.color !== (color || 'Any')) setColor(firstAvailable.color);
    }, [color, size, variantOptions, variantStocks]);

    const availableToAdd =
        selectedVariantStock === null ? null : Math.max(selectedVariantStock - currentVariantQty, 0);
    const stockStatusLabel =
        selectedVariantStock === null || variantLoading
            ? t.checkingAvailability
            : selectedVariantStock > 0
              ? t.inStock(selectedVariantStock)
              : hasAnyAvailableVariant
                ? t.selectedVariantOutOfStock
                : t.outOfStock;

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.pageXOffset) / width) * 100;
        const y = ((e.pageY - top - window.pageYOffset) / height) * 100;

        setMagnifierStyle({
            display: 'block',
            top: e.pageY - top - window.pageYOffset - 75,
            left: e.pageX - left - window.pageXOffset - 75,
            backgroundPosition: `${x}% ${y}%`,
            backgroundImage: `url(${image})`,
        });
    };

    const handleMouseLeave = () =>
        setMagnifierStyle({
            display: 'none',
            top: 0,
            left: 0,
            backgroundPosition: '0% 0%',
        });

    const validatePurchaseSelection = () => {
        if (!size) {
            toast.error(t.chooseSizeToast);
            return false;
        }

        if (productData?.colors?.length > 0 && !color) {
            toast.error(t.chooseColorToast);
            return false;
        }

        if (selectedVariantStock === null) {
            toast.info(t.checkingStockToast);
            return false;
        }

        if (availableToAdd <= 0) {
            if (Number(selectedVariantStock || 0) > 0) {
                toast.error(t.limitToast(selectedVariantStock));
            } else {
                toast.error(t.variantOutOfStockToast);
            }
            return false;
        }

        return true;
    };

    const animateProductToCart = () => {
        const sourceImage = mainImageRef.current?.querySelector('img');
        const cartTarget = document.querySelector('[data-cart-target="true"]');

        if (!sourceImage || !cartTarget) return;

        const sourceRect = sourceImage.getBoundingClientRect();
        const targetRect = cartTarget.getBoundingClientRect();
        const flyShell = document.createElement('div');
        const flyGlow = document.createElement('div');
        const flyImage = document.createElement('img');
        const flyBadge = document.createElement('div');

        Object.assign(flyShell.style, {
            position: 'fixed',
            top: `${sourceRect.top}px`,
            left: `${sourceRect.left}px`,
            width: `${sourceRect.width}px`,
            height: `${sourceRect.height}px`,
            pointerEvents: 'none',
            zIndex: '9999',
            transformOrigin: 'center center',
        });

        Object.assign(flyGlow.style, {
            position: 'absolute',
            inset: '-8px',
            borderRadius: '32px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.26) 0%, rgba(99,102,241,0) 72%)',
            filter: 'blur(8px)',
            opacity: '0.85',
        });

        flyImage.src = image || sourceImage.currentSrc || sourceImage.src;
        Object.assign(flyImage.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '24px',
            boxShadow: '0 24px 50px rgba(15, 23, 42, 0.18)',
        });

        flyBadge.textContent = '+1';
        Object.assign(flyBadge.style, {
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '34px',
            height: '34px',
            padding: '0 10px',
            borderRadius: '999px',
            background: 'rgba(15, 23, 42, 0.88)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            boxShadow: '0 14px 28px rgba(15, 23, 42, 0.18)',
        });

        flyShell.appendChild(flyGlow);
        flyShell.appendChild(flyImage);
        flyShell.appendChild(flyBadge);
        document.body.appendChild(flyShell);

        const deltaX =
            targetRect.left +
            targetRect.width / 2 -
            (sourceRect.left + sourceRect.width / 2);
        const deltaY =
            targetRect.top +
            targetRect.height / 2 -
            (sourceRect.top + sourceRect.height / 2);

        const lift = Math.max(72, Math.min(150, Math.abs(deltaX) * 0.16 + 82));

        const shellAnimation = flyShell.animate(
            [
                {
                    transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
                    opacity: 1,
                    filter: 'blur(0px)',
                },
                {
                    transform: `translate3d(${deltaX * 0.35}px, ${deltaY * 0.18 - lift}px, 0) scale(0.76) rotate(7deg)`,
                    opacity: 0.98,
                    filter: 'blur(0px)',
                    offset: 0.42,
                },
                {
                    transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.12) rotate(12deg)`,
                    opacity: 0.14,
                    filter: 'blur(1.5px)',
                },
            ],
            {
                duration: 760,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards',
            },
        );

        flyGlow.animate(
            [
                { opacity: 0.65, transform: 'scale(0.92)' },
                { opacity: 1, transform: 'scale(1.08)', offset: 0.35 },
                { opacity: 0, transform: 'scale(0.4)' },
            ],
            {
                duration: 760,
                easing: 'ease-out',
                fill: 'forwards',
            },
        );

        flyBadge.animate(
            [
                { transform: 'translateY(0px) scale(1)', opacity: 1 },
                { transform: 'translateY(-10px) scale(1.04)', opacity: 1, offset: 0.4 },
                { transform: 'translateY(-18px) scale(0.9)', opacity: 0 },
            ],
            {
                duration: 760,
                easing: 'ease-out',
                fill: 'forwards',
            },
        );

        cartTarget.animate(
            [
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(99,102,241,0)' },
                { transform: 'scale(1.16)', boxShadow: '0 0 0 10px rgba(99,102,241,0.12)' },
                { transform: 'scale(1)', boxShadow: '0 0 0 rgba(99,102,241,0)' },
            ],
            {
                duration: 520,
                delay: 360,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
        );

        const pulse = document.createElement('div');
        Object.assign(pulse.style, {
            position: 'fixed',
            top: `${targetRect.top + targetRect.height / 2 - 18}px`,
            left: `${targetRect.left + targetRect.width / 2 - 18}px`,
            width: '36px',
            height: '36px',
            borderRadius: '999px',
            background: 'rgba(99, 102, 241, 0.18)',
            border: '1px solid rgba(99, 102, 241, 0.24)',
            pointerEvents: 'none',
            zIndex: '9998',
        });
        document.body.appendChild(pulse);
        const pulseAnimation = pulse.animate(
            [
                { transform: 'scale(0.4)', opacity: 0.8 },
                { transform: 'scale(1.8)', opacity: 0 },
            ],
            {
                duration: 520,
                delay: 360,
                easing: 'ease-out',
                fill: 'forwards',
            },
        );

        const cleanup = () => {
            if (flyShell.parentNode) {
                flyShell.parentNode.removeChild(flyShell);
            }
            if (pulse.parentNode) {
                pulse.parentNode.removeChild(pulse);
            }
        };

        shellAnimation.addEventListener('finish', cleanup, { once: true });
        pulseAnimation.addEventListener('finish', cleanup, { once: true });
        window.setTimeout(cleanup, 1200);
    };

    const buildSelectedOrderItem = () => ({
        _id: productData?._id ?? productData?.id,
        name: productData?.name,
        price: productData?.price,
        image: productData?.image,
        size,
        color: color === 'Any' ? '' : color,
        quantity: 1,
    });

    const handleAddToCart = async () => {
        if (!validatePurchaseSelection()) return;

        const result = await addToCart(productData._id ?? productData.id, size, color || 'Any');

        if (!result?.success) {
            if (Number(result?.stock || 0) > 0) {
                toast.error(t.limitToast(result.stock));
            } else {
                toast.error(result?.message || t.unableToAdd);
            }
            return;
        }

        animateProductToCart();
        toast.success(t.addedToCart);
    };

    const handleBuyNow = () => {
        if (!validatePurchaseSelection()) return;

        navigate('/place-order', {
            state: {
                buyNowItem: buildSelectedOrderItem(),
            },
        });
    };

    if (!productData) {
        return <div className="py-20 text-center text-slate-400">{t.loadingProduct}</div>;
    }

    return (
        <div className="space-y-3 py-3 md:space-y-4 md:py-4 w-full">
            <section className="section-shell px-2 py-3 md:px-5 md:py-5 mx-2 md:mx-0">
                <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-[1fr_1fr] lg:gap-8 items-start w-full">
                    <div className="flex flex-col-reverse gap-2 lg:grid lg:grid-cols-[90px_minmax(0,1fr)] lg:gap-4">
                        <div className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:overflow-y-auto">
                            {productData.image.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => setImage(item)}
                                    className={`flex-shrink-0 overflow-hidden rounded-[8px] md:rounded-[12px] border bg-white transition-all duration-300 ${
                                        image === item
                                            ? 'border-[#2d2620] shadow-sm ring-1 ring-[#2d2620]'
                                            : 'border-[#f2ebe1] hover:border-[#a89d8d]'
                                    }`}
                                    type="button"
                                >
                                    <img
                                        src={item}
                                        className="h-10 w-8 md:h-16 md:w-12 object-cover lg:h-20 lg:w-full"
                                        alt={productData.name}
                                    />
                                </button>
                            ))}
                        </div>

                        <div
                            ref={mainImageRef}
                            className="relative overflow-hidden rounded-[12px] md:rounded-[20px] border border-white/80 bg-white/60 p-1 md:p-2 shadow-sm cursor-crosshair backdrop-blur-sm"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                className="aspect-[4/5] w-full rounded-[8px] md:rounded-[16px] object-cover"
                                src={image}
                                alt={productData.name}
                            />
                            <div
                                className="pointer-events-none absolute h-[250px] w-[250px] rounded-full border border-white/50 shadow-2xl bg-no-repeat bg-[length:250%_250%] transition-opacity duration-200"
                                style={{
                                    ...magnifierStyle,
                                    opacity: magnifierStyle.display === 'block' ? 1 : 0,
                                    zIndex: 10,
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-6">
                        <div>
                            <p className="text-[9px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8273]">
                                {t.productDetails}
                            </p>
                            <h1 className="display-font mt-1 sm:mt-2 text-base sm:text-3xl lg:text-4xl font-semibold tracking-[-0.04em] text-[#2d2620] leading-tight">
                                {productData.name}
                            </h1>

                            <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-3">
                                <span
                                    className={`flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-bold ${
                                            selectedVariantStock !== null && selectedVariantStock > 0
                                            ? 'bg-emerald-100/70 text-emerald-800'
                                            : 'bg-rose-100/70 text-rose-800'
                                    }`}
                                >
                                    <div
                                        className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                                            selectedVariantStock !== null && selectedVariantStock > 0
                                                ? 'bg-emerald-500 animate-pulse'
                                                : 'bg-rose-500'
                                        }`}
                                    />
                                    {stockStatusLabel}
                                </span>

                                {currentVariantQty > 0 ? (
                                    <span className="rounded-full bg-[#f4ebd9]/50 px-2 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-semibold text-[#59534e]">
                                        {t.inCart(currentVariantQty)}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] sm:text-sm text-[#59534e]">
                            <div className="flex gap-0.5 sm:gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-3 w-3 sm:h-[18px] sm:w-[18px]"
                                        fill={
                                            i <
                                            Math.round(
                                                reviewStats.averageRating && reviewStats.averageRating > 0
                                                    ? reviewStats.averageRating
                                                    : 5,
                                            )
                                                ? '#eab308'
                                                : 'none'
                                        }
                                        stroke={
                                            i <
                                            Math.round(
                                                reviewStats.averageRating && reviewStats.averageRating > 0
                                                    ? reviewStats.averageRating
                                                    : 5,
                                            )
                                                ? '#eab308'
                                                : '#cbd5e1'
                                        }
                                    />
                                ))}
                            </div>
                            <span className="pl-0.5 sm:pl-1 font-bold text-[#1a1f25]">
                                ({reviewStats.totalReviews}){' '}
                                <span className="hidden sm:inline text-xs font-medium text-[#8c8273]">{t.reviews}</span>
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <p className="text-lg sm:text-[28px] font-bold text-[#1a1f25]">
                                {formatMoney(productData.price, language)}
                            </p>
                            {productData.oldPrice > productData.price && (
                                <>
                                    <p className="text-[11px] sm:text-lg text-[#a89d8d] line-through decoration-black/20">
                                        {formatMoney(productData.oldPrice, language)}
                                    </p>
                                    <span className="rounded-full bg-rose-100 px-1.5 py-0.5 sm:px-3 sm:py-1.5 text-[9px] sm:text-xs font-bold text-rose-700">
                                        -
                                        {Math.round(
                                            ((productData.oldPrice - productData.price) / productData.oldPrice) * 100,
                                        )}
                                        %
                                    </span>
                                </>
                            )}
                        </div>

                        <p className="max-w-xl text-[10px] md:text-sm leading-relaxed md:leading-6 text-[#59534e] line-clamp-2 md:line-clamp-none">
                            {productData.description}
                        </p>

                        <div className="rounded-[12px] md:rounded-[20px] border border-[#f2ebe1] bg-white/80 p-2 md:p-4 shadow-sm backdrop-blur-md">
                            <p className="text-[9px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[#8c8273]">
                                {t.selectSize}
                            </p>

                            <div className="mt-1.5 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                                {productData.sizes.map((item, index) => (
                                    <button
                                        onClick={() => {
                                            setSize(item);

                                            if (productData.colors?.length) {
                                                const currentColor = color || 'Any';
                                                const sameColorKey = getVariantKey(item, currentColor);
                                                if (Number(variantStocks[sameColorKey] || 0) > 0) return;

                                                const fallbackVariant = variantOptions.find(
                                                    (variant) =>
                                                        variant.size === item &&
                                                        Number(variantStocks[variant.key] || 0) > 0,
                                                );

                                                if (fallbackVariant) {
                                                    setColor(fallbackVariant.color);
                                                }
                                            }
                                        }}
                                        className={`rounded-full px-3 py-1 sm:px-6 sm:py-3 text-[10px] sm:text-sm font-bold transition-all duration-300 ${
                                            item === size
                                                ? 'bg-[#2d2620] text-white shadow-sm scale-[1.02]'
                                                : 'border border-[#e8e4dc] bg-[#faf8f5] text-[#59534e] hover:border-[#a89d8d] hover:bg-white'
                                        }`}
                                        key={index}
                                        type="button"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {productData.colors && productData.colors.length > 0 && (
                            <div className="rounded-[12px] md:rounded-[20px] border border-[#f2ebe1] bg-white/80 p-2 md:p-4 shadow-sm backdrop-blur-md mt-2">
                                <p className="text-[9px] md:text-xs font-semibold uppercase tracking-[0.18em] text-[#8c8273]">
                                    {t.selectColor}
                                </p>

                                <div className="mt-1.5 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                                    {productData.colors.map((item, index) => (
                                        <button
                                            onClick={() => setColor(item)}
                                            className={`group relative flex items-center gap-1.5 sm:gap-3 rounded-full border px-2 py-1 sm:px-5 sm:py-3 text-[10px] sm:text-sm font-bold transition-all duration-300 ${
                                                item === color
                                                    ? 'border-[#2d2620] bg-[#2d2620] text-white shadow-sm scale-[1.02]'
                                                    : 'border-[#e8e4dc] bg-[#faf8f5] text-[#59534e] hover:border-[#a89d8d] hover:bg-white'
                                            }`}
                                            key={index}
                                            type="button"
                                        >
                                            <div
                                                className="h-3 w-3 sm:h-5 sm:w-5 rounded-full border border-black/10 shadow-inner"
                                                style={{ backgroundColor: item.toLowerCase() }}
                                            />
                                            <span className="tracking-wide hidden sm:inline">{item}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-1.5 md:gap-3 mt-1 md:mt-3 w-full">
                            <button
                                onClick={handleAddToCart}
                                disabled={availableToAdd === null || availableToAdd <= 0}
                                className="w-full rounded-full bg-[#1a1a1a] px-3 py-2 md:px-6 md:py-3.5 text-[9px] md:text-sm font-bold uppercase tracking-[0.16em] text-white shadow-sm hover:bg-black transition-all duration-300 disabled:cursor-not-allowed disabled:bg-[#d1cdc5]"
                                type="button"
                            >
                                {availableToAdd !== null && availableToAdd > 0 ? t.addToCart : t.outOfStock}
                            </button>

                            <button
                                onClick={handleBuyNow}
                                disabled={availableToAdd === null || availableToAdd <= 0}
                                className="w-full rounded-full border border-[var(--border)] bg-white px-3 py-2 md:px-6 md:py-3.5 text-[9px] md:text-sm font-bold uppercase tracking-[0.16em] text-[#1a1a1a] shadow-sm hover:border-[#1a1a1a] transition-all duration-300 disabled:cursor-not-allowed disabled:border-[#e8e4dc] disabled:text-[#b0a698]"
                                type="button"
                            >
                                {t.buyNow}
                            </button>

                            {canUseVirtualTryOn && (
                                <button
                                    onClick={() => setShowVTO(true)}
                                    className="w-full group relative overflow-hidden rounded-full border-2 border-indigo-600/80 px-3 py-1.5 md:px-6 md:py-3 text-[9px] md:text-sm font-bold uppercase tracking-[0.18em] text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white shadow-sm flex items-center justify-center"
                                    type="button"
                                >
                                    <span className="relative z-10 flex items-center gap-1 md:gap-2">{t.virtualTryOn}</span>
                                </button>
                            )}
                        </div>

                        {/* QR Code Zalo khi hết hàng */}
                        {availableToAdd !== null && availableToAdd <= 0 && !hasAnyAvailableVariant && (
                            <div className="mt-3 sm:mt-6 rounded-[16px] sm:rounded-[24px] border-2 border-[#0068FF] bg-gradient-to-br from-blue-50 to-white p-3 sm:p-6 shadow-sm">
                                <div className="flex flex-col lg:flex-row items-center gap-3 sm:gap-6">
                                    <div className="flex-shrink-0">
                                        <div className="overflow-hidden rounded-[12px] sm:rounded-[20px] border-2 border-[#0068FF] bg-white p-1.5 sm:p-3 shadow-sm max-w-[80px] sm:max-w-[180px]">
                                            <img 
                                                src={assets.qr_zalo} 
                                                alt="Zalo QR Code" 
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center lg:text-left">
                                        <h3 className="text-xs sm:text-xl font-bold text-[#0068FF] mb-1 sm:mb-2">
                                            📱 {t.contactZalo}
                                        </h3>
                                        <p className="text-[9px] sm:text-sm text-slate-600 mb-2 sm:mb-3 hidden sm:block">
                                            {t.contactNow}
                                        </p>
                                        <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-[#0068FF] px-3 py-1.5 sm:px-5 sm:py-2.5 text-[9px] sm:text-sm font-bold text-white shadow-sm">
                                            <span>{t.scanQR}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-1.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                            <div className="rounded-[12px] sm:rounded-[22px] border border-[var(--border)] bg-white/80 p-2 sm:p-4 text-[9px] sm:text-sm font-medium text-[#8c8273] shadow-sm text-center">
                                {t.codAvailable}
                            </div>
                            <div className="rounded-[12px] sm:rounded-[22px] border border-[var(--border)] bg-white/80 p-2 sm:p-4 text-[9px] sm:text-sm font-medium text-[#8c8273] shadow-sm text-center">
                                {t.easyReturn}
                            </div>
                            <div className="rounded-[12px] sm:rounded-[22px] border border-[var(--border)] bg-white/80 p-2 sm:p-4 text-[9px] sm:text-sm font-medium text-[#8c8273] shadow-sm text-center">
                                {t.curatedQuality}
                            </div>
                        </div>

                        {showVTO && canUseVirtualTryOn && (
                            <VirtualTryOn
                                productImg={image}
                                productName={productData.name}
                                onClose={() => setShowVTO(false)}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* REMOVED: VideoReview - Giảm tải trang */}
            {/* <VideoReview videoUrl={productData.videoUrl} /> */}

            <section className="section-shell overflow-hidden border border-white/80 shadow-[0_12px_36px_rgba(31,27,24,0.04)] backdrop-blur-sm mx-2 md:mx-0">
                <div className="flex flex-wrap border-b border-[#e8e4dc] bg-white/70">
                    <b className="border-r border-[#e8e4dc] px-4 py-3 md:px-6 md:py-4 text-[11px] md:text-sm font-bold text-[#1a1a1a]">
                        {t.productDescription}
                    </b>
                </div>

                <div className="bg-white/90 px-4 py-4 md:px-8 md:py-6 text-[11px] md:text-sm leading-relaxed md:leading-loose text-[#59534e]">
                    <div dangerouslySetInnerHTML={{ __html: productData.description.replace(/\n/g, '<br/>') }} />
                </div>
            </section>

            <ReviewSystem productId={productData._id || productData.id} onReviewsLoaded={setReviewStats} />

            <RecentlyViewedProducts currentId={productData._id || productData.id} />

            <RelatedProducts
                category={productData.category}
                subCategory={productData.subCategory}
            />
        </div>
    );
};

const RecentlyViewedProducts = ({ currentId }) => {
    const { products } = useContext(ShopContext);
    const { language } = useLanguage();
    const t = copyByLanguage[language];
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        try {
            const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const list = rv
                .filter((id) => String(id) !== String(currentId))
                .map((id) => products.find((p) => String(p._id || p.id) === String(id)))
                .filter(Boolean);

            setRecentProducts(list.slice(0, 5));
        } catch {}
    }, [currentId, products]);

    if (recentProducts.length === 0) return null;

    return (
        <div className="mt-10 md:mt-16 mx-2 md:mx-0">
            <div className="text-center text-xl md:text-2xl py-2">
                <div className="inline-flex gap-2 items-center mb-2 md:mb-3">
                    <p className="text-[#2d2620] font-medium text-xs md:text-sm uppercase tracking-widest">{t.recentlyViewed}</p>
                    <p className="w-6 md:w-12 h-[1px] md:h-[2px] bg-[#8c8273]"></p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 md:gap-4 mt-3 md:mt-4 w-full">
                {recentProducts.map((item, index) => (
                    <div key={index} className="text-[#59534e] cursor-pointer group flex flex-col gap-1.5 md:gap-2 relative">
                        <a
                            href={`/product/${item._id || item.id}`}
                            className="block overflow-hidden relative rounded-[12px] md:rounded-[20px] border border-[#f2ebe1] bg-white/80 p-1 md:p-2 transition-all duration-300 group-hover:border-[#a89d8d] shadow-sm hover:shadow-md group-hover:-translate-y-1"
                        >
                            <div className="overflow-hidden bg-[#faf8f5] rounded-[8px] md:rounded-[16px]">
                                <img
                                    className="hover:scale-105 transition-transform duration-700 ease-in-out w-full aspect-[4/5] object-cover"
                                    src={item.image?.[0] || 'https://dummyimage.com/600x800/e5e7eb/6b7280&text=No+Image'}
                                    alt={item.name}
                                />
                            </div>
                        </a>
                        <p className="pt-1 md:pt-2 pb-0.5 text-[9px] md:text-xs font-bold truncate px-1 group-hover:text-black transition-colors uppercase tracking-[0.05em] text-[#2d2620]">
                            {item.name}
                        </p>
                        <p className="text-[10px] md:text-sm font-bold text-[#1a1f25] px-1">
                            {formatMoney(item.price, language)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Product;
