import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import SmartSearch from '../components/SmartSearch';
import Pagination from '../components/Pagination';

const parsePrice = (price) => {
    if (typeof price === 'number') return price < 1000 ? price * 1000 : price;

    const digits = String(price ?? '').replace(/[^\d]/g, '');
    if (!digits) return 0;

    const n = Number(digits);
    if (!Number.isFinite(n)) return 0;

    return n < 1000 ? n * 1000 : n;
};

const copyByLanguage = {
    vi: {
        title1: 'TOÀN BỘ',
        title2: 'BỘ SƯU TẬP',
        refinedDiscovery: 'Khám phá tinh chọn',
        intro: 'Bộ sưu tập được trình bày rõ ràng hơn với lọc nhanh, sắp xếp trực quan và trải nghiệm duyệt sản phẩm mượt mà trên mọi kích thước màn hình.',
        showFilters: 'Hiện bộ lọc',
        hideFilters: 'Ẩn bộ lọc',
        sortRelevant: 'Sắp xếp: Liên quan',
        sortLowHigh: 'Sắp xếp: Giá thấp đến cao',
        sortHighLow: 'Sắp xếp: Giá cao đến thấp',
        sortNewest: 'Sắp xếp: Mới nhất',
        sortNameAZ: 'Sắp xếp: Tên A-Z',
        sortNameZA: 'Sắp xếp: Tên Z-A',
        filters: 'Bộ lọc',
        narrowYourStyle: 'Thu gọn phong cách',
        clearAll: 'Xóa tất cả',
        priceRange: 'Khoảng giá',
        minPlaceholder: 'Giá từ',
        maxPlaceholder: 'Giá đến',
        priceHint: 'Bạn có thể nhập 100 hoặc 100.000.',
        onlyBestSeller: 'Chỉ hiện bestseller',
        categories: 'Danh mục',
        collapse: 'Thu gọn',
        viewSubCategories: 'Xem danh mục con',
        productsFound: 'Sản phẩm tìm thấy',
        matchedCount: (count) => `${count} sản phẩm phù hợp với lựa chọn hiện tại.`,
        resetFilters: 'Đặt lại bộ lọc',
        noProductsTitle: 'Không tìm thấy sản phẩm phù hợp',
        noProductsBody: 'Thử nới rộng khoảng giá, bỏ bớt bộ lọc hoặc xóa từ khóa tìm kiếm để xem thêm lựa chọn.',
        loadMore: 'Xem thêm',
        fallbackCategories: [
            { value: 'Nam', label: 'Nam' },
            { value: 'Nữ', label: 'Nữ' },
            { value: 'Trẻ em', label: 'Trẻ em' },
            { value: 'Phụ kiện', label: 'Phụ kiện' },
        ],
    },
    en: {
        title1: 'ALL',
        title2: 'COLLECTIONS',
        refinedDiscovery: 'Refined discovery',
        intro: 'The collection is presented more clearly with quick filtering, intuitive sorting and a smoother browsing experience across every screen size.',
        showFilters: 'Show Filters',
        hideFilters: 'Hide Filters',
        sortRelevant: 'Sort by: Relevant',
        sortLowHigh: 'Sort by: Low to High',
        sortHighLow: 'Sort by: High to Low',
        sortNewest: 'Sort by: Newest',
        sortNameAZ: 'Sort by: Name A-Z',
        sortNameZA: 'Sort by: Name Z-A',
        filters: 'Filters',
        narrowYourStyle: 'Narrow your style',
        clearAll: 'Clear all',
        priceRange: 'Price Range',
        minPlaceholder: 'Min',
        maxPlaceholder: 'Max',
        priceHint: 'You can type 100 or 100,000.',
        onlyBestSeller: 'Only Bestseller',
        categories: 'Categories',
        collapse: 'Collapse',
        viewSubCategories: 'View sub-categories',
        productsFound: 'Products found',
        matchedCount: (count) => `${count} products match your current filters.`,
        resetFilters: 'Reset Filters',
        noProductsTitle: 'No matching products found',
        noProductsBody: 'Try widening the price range, removing some filters or clearing the search term to see more options.',
        loadMore: 'Load More',
        fallbackCategories: [
            { value: 'Nam', label: 'Men' },
            { value: 'Nữ', label: 'Women' },
            { value: 'Trẻ em', label: 'Kids' },
            { value: 'Phụ kiện', label: 'Accessories' },
        ],
    },
};

const Collection = () => {
    const { products, search, setSearch, categories, subCategories } = useContext(ShopContext);
    const { language } = useLanguage();
    const t = copyByLanguage[language];

    const [showFilter, setShowFilter] = useState(false);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [onlyBestSeller, setOnlyBestSeller] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});

    const [smartSearchResults, setSmartSearchResults] = useState(null);
    const [smartSearchCriteria, setSmartSearchCriteria] = useState(null);

    const ITEMS_PER_PAGE = 15;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        category,
        subCategory,
        sortType,
        search,
        minPrice,
        maxPrice,
        onlyBestSeller,
        products,
        smartSearchResults,
    ]);

    const toggleCategory = (value) => {
        setCategory((prev) =>
            prev.includes(value)
                ? prev.filter((x) => x !== value)
                : [...prev, value],
        );
    };

    const toggleExpandCategory = (catName) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [catName]: !prev[catName],
        }));
    };

    const toggleSubCategory = (value) => {
        setSubCategory((prev) =>
            prev.includes(value)
                ? prev.filter((x) => x !== value)
                : [...prev, value],
        );
    };

    const clearAll = () => {
        setCategory([]);
        setSubCategory([]);
        setSortType('relavent');
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        setOnlyBestSeller(false);
        setExpandedCategories({});
        setSmartSearchResults(null);
        setSmartSearchCriteria(null);
    };

    const handleSmartSearchResults = (products, criteria) => {
        setSmartSearchResults(products);
        setSmartSearchCriteria(criteria);
        
        // Tự động apply các filter từ AI
        if (criteria.categories?.length > 0) setCategory(criteria.categories);
        if (criteria.subCategories?.length > 0) setSubCategory(criteria.subCategories);
        if (criteria.minPrice) setMinPrice(criteria.minPrice.toString());
        if (criteria.maxPrice) setMaxPrice(criteria.maxPrice.toString());
    };

    const filteredAndSorted = useMemo(() => {
        // Nếu có kết quả từ smart search, ưu tiên hiển thị
        let list = smartSearchResults ? [...smartSearchResults] : (Array.isArray(products) ? [...products] : []);

        if (category.length > 0) {
            list = list.filter((p) => category.includes(p.category));
        }

        if (subCategory.length > 0) {
            list = list.filter((p) => subCategory.includes(p.subCategory));
        }

        if (onlyBestSeller) {
            list = list.filter((p) => p.bestseller === true);
        }

        const q = search.trim().toLowerCase();
        if (q) {
            list = list.filter((p) => {
                const name = String(p.name ?? '').toLowerCase();
                const desc = String(p.description ?? '').toLowerCase();
                return name.includes(q) || desc.includes(q);
            });
        }

        const min = minPrice !== '' ? parsePrice(minPrice) : null;
        const max = maxPrice !== '' ? parsePrice(maxPrice) : null;

        if (min !== null) list = list.filter((p) => parsePrice(p.price) >= min);
        if (max !== null) list = list.filter((p) => parsePrice(p.price) <= max);

        switch (sortType) {
            case 'low-high':
                list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'high-low':
                list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case 'newest':
                list.sort((a, b) => (b.date || 0) - (a.date || 0));
                break;
            case 'name-az':
                list.sort((a, b) =>
                    String(a.name ?? '').localeCompare(String(b.name ?? '')),
                );
                break;
            case 'name-za':
                list.sort((a, b) =>
                    String(b.name ?? '').localeCompare(String(a.name ?? '')),
                );
                break;
            default:
                break;
        }

        return list;
    }, [
        products,
        category,
        subCategory,
        sortType,
        search,
        minPrice,
        maxPrice,
        onlyBestSeller,
        smartSearchResults,
    ]);

    const categoryOptions = categories.length === 0
        ? t.fallbackCategories.map((item) => ({ _id: item.value, name: item.value, label: item.label, _static: true }))
        : categories.map((item) => ({ ...item, label: item.name }));

    const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
    const displayed = filteredAndSorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="space-y-3 py-3 md:space-y-4 md:py-4 w-full">
            {/* Khối Tìm kiếm thông minh được đưa ra giữa, luôn hiển thị */}
            <section className="px-2 sm:px-5 md:px-8 max-w-5xl mx-auto w-full">
                <SmartSearch onSearchResults={handleSmartSearchResults} />
            </section>

            <section className="section-shell px-3 py-3 md:px-5 md:py-4 mx-2 md:mx-0">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="w-full lg:w-auto text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start">
                            <Title text1={t.title1} text2={t.title2} />
                        </div>
                        <p className="mt-1 max-w-2xl text-[11px] leading-5 md:text-sm md:leading-6 text-slate-500 mx-auto lg:mx-0">
                            {t.intro}
                        </p>
                        <div className="mt-2 md:mt-3 flex flex-col sm:flex-row items-center gap-2 justify-center lg:justify-start">
                            <p className="text-xs md:text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                                {t.matchedCount(filteredAndSorted.length)}
                            </p>
                            {smartSearchCriteria && (
                                <div className="inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-700 px-2.5 py-1 md:px-3 text-[10px] md:text-xs font-semibold text-white shadow-sm">
                                    <span>✨</span>
                                    <span>Kết quả tìm kiếm thông minh</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full lg:w-auto mt-2 lg:mt-0">
                        <button
                            onClick={clearAll}
                            className="w-full sm:w-auto rounded-full border border-[var(--border)] px-4 py-2 md:px-5 md:py-2.5 text-[11px] md:text-sm font-semibold text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                            type="button"
                        >
                            {t.resetFilters}
                        </button>

                        <button
                            onClick={() => setShowFilter((prev) => !prev)}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[var(--border)] px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-semibold tracking-[0.14em] text-slate-600 hover:bg-slate-900 hover:text-white lg:hidden transition-colors"
                            type="button"
                        >
                            {showFilter ? t.hideFilters : t.showFilters}
                        </button>

                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="w-full sm:w-auto rounded-full border border-[var(--border)] bg-white px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm font-medium text-slate-600 outline-none"
                        >
                            <option value="relavent">{t.sortRelevant}</option>
                            <option value="low-high">{t.sortLowHigh}</option>
                            <option value="high-low">{t.sortHighLow}</option>
                            <option value="newest">{t.sortNewest}</option>
                            <option value="name-az">{t.sortNameAZ}</option>
                            <option value="name-za">{t.sortNameZA}</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="flex flex-col lg:flex-row gap-4 md:gap-5 px-2 md:px-0">
                <aside className={`w-full lg:w-1/4 ${showFilter ? 'block' : 'hidden'} lg:block`}>
                    <div className="section-shell h-fit p-3 md:p-4 lg:sticky lg:top-24 lg:p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                                    {t.filters}
                                </p>
                                <h2 className="display-font mt-1 md:mt-2 text-lg md:text-2xl font-semibold text-slate-900">
                                    {t.narrowYourStyle}
                                </h2>
                            </div>

                            <button
                                onClick={clearAll}
                                className="text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-900"
                                type="button"
                            >
                                {t.clearAll}
                            </button>
                        </div>

                        <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                            <div className="rounded-[16px] md:rounded-[24px] border border-[var(--border)] bg-white p-3 md:p-4">
                                <p className="mb-2 md:mb-3 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {t.priceRange}
                                </p>

                                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full">
                                    <input
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full rounded-[12px] md:rounded-2xl border border-[var(--border)] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm outline-none focus:border-slate-400 transition-colors"
                                        placeholder={t.minPlaceholder}
                                    />
                                    <input
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full rounded-[12px] md:rounded-2xl border border-[var(--border)] px-3 py-2 md:px-4 md:py-3 text-xs md:text-sm outline-none focus:border-slate-400 transition-colors"
                                        placeholder={t.maxPlaceholder}
                                    />
                                </div>

                                <p className="mt-2 md:mt-3 text-[10px] md:text-xs leading-5 md:leading-6 text-slate-400">
                                    {t.priceHint}
                                </p>
                            </div>

                            <div className="rounded-[16px] md:rounded-[24px] border border-[var(--border)] bg-white p-3 md:p-4">
                                <label className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-600 cursor-pointer w-full">
                                    <input
                                        type="checkbox"
                                        checked={onlyBestSeller}
                                        onChange={(e) =>
                                            setOnlyBestSeller(e.target.checked)
                                        }
                                        className="accent-slate-900 w-4 h-4 md:w-auto md:h-auto"
                                    />
                                    {t.onlyBestSeller}
                                </label>
                            </div>

                            <div className="rounded-[16px] md:rounded-[24px] border border-[var(--border)] bg-white p-3 md:p-4">
                                <p className="mb-2 md:mb-3 text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                                    {t.categories}
                                </p>

                                <div className="space-y-0.5 text-xs md:text-sm text-slate-600">
                                    {categoryOptions.map((cat) => {
                                        const catSubs = cat._static ? [] : subCategories.filter(
                                            (s) => s.categoryId?._id === cat._id || s.categoryId === cat._id,
                                        );
                                        const isExpanded = expandedCategories[cat.name];
                                        const isChecked = category.includes(cat.name);

                                        return (
                                            <div key={cat._id} className="w-full">
                                                <div className="flex items-center gap-1 rounded-[10px] md:rounded-xl hover:bg-slate-50 transition-colors w-full">
                                                    <label className="flex flex-1 cursor-pointer items-center gap-2 md:gap-3 px-2 py-2 w-full">
                                                        <input
                                                            type="checkbox"
                                                            value={cat.name}
                                                            onChange={() => toggleCategory(cat.name)}
                                                            checked={isChecked}
                                                            className="accent-slate-900 w-4 h-4 md:w-auto md:h-auto flex-shrink-0"
                                                        />
                                                        <span className={`flex-1 font-medium truncate ${isChecked ? 'text-slate-900' : ''}`}>
                                                            {cat.label}
                                                        </span>
                                                    </label>
                                                    {catSubs.length > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleExpandCategory(cat.name)}
                                                            className="mr-1 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 flex-shrink-0"
                                                            title={isExpanded ? t.collapse : t.viewSubCategories}
                                                        >
                                                            {isExpanded ? '\u2212' : '+'}
                                                        </button>
                                                    )}
                                                </div>

                                                {isExpanded && catSubs.length > 0 && (
                                                    <div className="mb-1 ml-4 md:ml-6 mt-0.5 space-y-0.5 border-l-2 border-slate-100 pl-2 md:pl-3 w-full">
                                                        {catSubs.map((sub) => (
                                                            <label
                                                                key={sub._id}
                                                                className="flex cursor-pointer items-center gap-2 md:gap-3 rounded-[10px] md:rounded-xl px-2 py-1.5 hover:bg-slate-50 w-full transition-colors"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    value={sub.name}
                                                                    onChange={() => toggleSubCategory(sub.name)}
                                                                    checked={subCategory.includes(sub.name)}
                                                                    className="accent-slate-700 w-3.5 h-3.5 md:w-auto md:h-auto flex-shrink-0"
                                                                />
                                                                <span className="text-slate-500 truncate text-[11px] md:text-sm">{sub.name}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="space-y-4 w-full lg:w-3/4">
                    {displayed.length === 0 ? (
                        <div className="section-shell px-3 py-6 md:px-5 md:py-8 text-center w-full">
                            <p className="text-sm md:text-base lg:text-lg font-semibold text-slate-900">
                                {t.noProductsTitle}
                            </p>
                            <p className="mt-2 md:mt-3 text-xs md:text-sm leading-5 md:leading-7 text-slate-500 max-w-md mx-auto">
                                {t.noProductsBody}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full">
                                {displayed.map((item, index) => (
                                    <ProductItem
                                        key={item._id ?? index}
                                        name={item.name}
                                        id={item._id}
                                        price={item.price}
                                        oldPrice={item.oldPrice}
                                        image={item.image}
                                    />
                                ))}
                            </div>

                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={setCurrentPage} 
                            />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Collection;