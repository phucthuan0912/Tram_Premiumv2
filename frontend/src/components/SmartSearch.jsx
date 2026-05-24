import { useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const SmartSearch = ({ onSearchResults }) => {
    const { backendUrl } = useContext(ShopContext);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [extractedCriteria, setExtractedCriteria] = useState(null);

    const handleSearch = async () => {
        if (!description.trim() || loading) return;

        setLoading(true);
        try {
            // Bước 1: Lấy tiêu chí có sẵn
            const { data: criteriaData } = await axios.get(`${backendUrl}/api/smart-search/criteria`);
            
            if (!criteriaData.success) {
                throw new Error('Không thể lấy tiêu chí tìm kiếm');
            }

            // Bước 2: Gửi mô tả + tiêu chí cho AI để trích xuất
            const { data: extractData } = await axios.post(`${backendUrl}/api/smart-search/extract`, {
                description: description.trim(),
                availableCriteria: criteriaData.criteria
            });

            if (!extractData.success) {
                throw new Error(extractData.message || 'Không thể trích xuất tiêu chí');
            }

            setExtractedCriteria(extractData.criteria);

            // Bước 3: Tìm kiếm sản phẩm với tiêu chí đã trích xuất
            const { data: searchData } = await axios.post(`${backendUrl}/api/smart-search/search`, extractData.criteria);

            if (!searchData.success) {
                throw new Error(searchData.message || 'Không thể tìm kiếm sản phẩm');
            }

            // Trả kết quả về parent component
            onSearchResults(searchData.products, extractData.criteria);
            setIsOpen(false);

        } catch (error) {
            console.error('Smart search error:', error);
            alert(error.message || 'Có lỗi xảy ra khi tìm kiếm');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/20 bg-white p-8 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)] transition-all duration-300">
            {/* Background decorative elements */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-100 to-fuchsia-100 opacity-60 blur-[80px]"></div>
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-100 to-teal-100 opacity-60 blur-[80px]"></div>

            <div className="relative">
                {/* Header */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <h3 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
                        Tìm kiếm bằng AI ✨
                    </h3>
                    <p className="mt-2 text-sm font-medium text-slate-500">
                        Mô tả sản phẩm bạn muốn tìm bằng ngôn ngữ tự nhiên
                    </p>
                </div>

                {/* Input */}
                <div className="relative group mx-auto max-w-3xl">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ví dụ: Tôi muốn tìm áo thun nam màu đen size L giá dưới 300k, mặc đi biển..."
                        className="w-full resize-none rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 pr-14 text-base font-medium text-slate-800 placeholder:text-slate-400 shadow-[inset_0_2px_8px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        rows={3}
                    />
                    <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-500 shadow-sm transition-transform duration-300 group-focus-within:scale-110 group-focus-within:bg-indigo-100 group-focus-within:text-indigo-600">
                        🪄
                    </div>
                </div>

                {/* Hiển thị tiêu chí đã trích xuất */}
                {extractedCriteria && (
                    <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white/60 p-4 ring-1 ring-slate-200/50 transition-all duration-500 ease-out">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Tiêu chí đã nhận diện</p>
                        <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm font-medium">
                            {extractedCriteria.categories?.map(c => (
                                <span key={`cat-${c}`} className="rounded-lg bg-indigo-50 px-2.5 py-1 text-indigo-700">{c}</span>
                            ))}
                            {extractedCriteria.subCategories?.map(s => (
                                <span key={`sub-${s}`} className="rounded-lg bg-purple-50 px-2.5 py-1 text-purple-700">{s}</span>
                            ))}
                            {extractedCriteria.sizes?.map(s => (
                                <span key={`size-${s}`} className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700">Size: {s}</span>
                            ))}
                            {extractedCriteria.colors?.map(c => (
                                <span key={`color-${c}`} className="rounded-lg bg-rose-50 px-2.5 py-1 text-rose-700">Màu: {c}</span>
                            ))}
                            {(extractedCriteria.minPrice || extractedCriteria.maxPrice) && (
                                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-emerald-700">
                                    Giá: {extractedCriteria.minPrice?.toLocaleString('vi-VN') || '0'}đ - {extractedCriteria.maxPrice?.toLocaleString('vi-VN') || '∞'}đ
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="mx-auto mt-6 flex max-w-sm gap-4 justify-center">
                    <button
                        onClick={handleSearch}
                        disabled={loading || !description.trim()}
                        className="relative flex-1 overflow-hidden rounded-2xl bg-slate-900 py-4 text-base font-bold text-white shadow-[0_8px_16px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_24px_rgba(15,23,42,0.3)] disabled:pointer-events-none disabled:opacity-50"
                    >
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 hover:opacity-100"></div>
                        <div className="relative flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                    <span>Đang phân tích...</span>
                                </>
                            ) : (
                                <>
                                    <span>Khám phá ngay</span>
                                    <span className="text-lg">→</span>
                                </>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmartSearch;
