import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Star, User, Camera, Send, X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewSystem = ({ productId, onReviewsLoaded }) => {
    const { getReviews, addReview, token, backendUrl } = useContext(ShopContext);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchReviews = async () => {
        setFetching(true);
        const data = await getReviews(productId);
        setReviews(data);
        if (onReviewsLoaded && Array.isArray(data)) {
            const count = data.length;
            const avg = count > 0 ? (data.reduce((acc, curr) => acc + Number(curr.rating), 0) / count) : 0;
            // Làm tròn đến 1 chữ số thập phân (VD: 4.5)
            onReviewsLoaded({ averageRating: avg, totalReviews: count });
        }
        setFetching(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            toast.error("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.error("Vui lòng nhập nhận xét.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('rating', rating);
            formData.append('comment', comment);

            images.forEach((img) => {
                formData.append('images', img);
            });

            const res = await addReview(formData);
            if (res.success) {
                toast.success("Cảm ơn bạn đã đánh giá!");
                setComment('');
                setImages([]);
                setRating(5);
                fetchReviews();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Gửi đánh giá thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 md:mt-16 border-t border-slate-100 pt-6 md:pt-12 mx-2 md:mx-0">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                {/* Review Form */}
                <div className="lg:w-1/3 space-y-4 md:space-y-8">
                    <div>
                        <h2 className="text-lg md:text-3xl font-bold text-slate-900">Đánh giá sản phẩm</h2>
                        <p className="text-slate-500 mt-1 md:mt-2 text-[11px] md:text-lg">Hệ thống luôn lắng nghe ý kiến từ bạn để cải thiện chất lượng dịch vụ.</p>
                    </div>

                    <form onSubmit={onSubmitReview} className="space-y-4 md:space-y-6 bg-slate-50/50 p-4 md:p-8 rounded-[16px] md:rounded-[32px] border border-slate-100">
                        <div>
                            <p className="font-bold text-slate-800 mb-2 md:mb-4 text-xs md:text-base">Chọn số sao</p>
                            <div className="flex gap-1 md:gap-2">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <button 
                                        key={num} 
                                        type="button" 
                                        onClick={() => setRating(num)}
                                        className="transition-transform active:scale-95"
                                    >
                                        <Star 
                                            size={24} 
                                            fill={num <= rating ? "#fbbf24" : "none"} 
                                            stroke={num <= rating ? "#fbbf24" : "#cbd5e1"} 
                                            className="drop-shadow-sm md:w-8 md:h-8"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="font-bold text-slate-800 mb-2 md:mb-4 text-xs md:text-base">Nhận xét của bạn</p>
                            <textarea 
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl md:rounded-2xl p-3 md:p-4 min-h-[80px] md:min-h-[120px] outline-none focus:ring-2 md:focus:ring-4 focus:ring-black/5 transition-all text-[11px] md:text-sm leading-relaxed"
                                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                            />
                        </div>

                        <div>
                            <p className="font-bold text-slate-800 mb-2 md:mb-4 text-xs md:text-base">Hình ảnh thực tế (Tối đa 5)</p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {images.map((img, index) => (
                                    <div key={index} className="relative w-14 h-14 md:w-20 md:h-20 rounded-lg md:rounded-xl overflow-hidden border border-slate-200">
                                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                                        <button 
                                            type="button" 
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 md:p-1 hover:bg-black transition-colors"
                                        >
                                            <X size={10} className="md:w-3 md:h-3" />
                                        </button>
                                    </div>
                                ))}
                                {images.length < 5 && (
                                    <label className="w-14 h-14 md:w-20 md:h-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg md:rounded-xl cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all text-slate-400">
                                        <Camera size={16} className="md:w-5 md:h-5" />
                                        <span className="text-[9px] md:text-[10px] font-bold mt-0.5 md:mt-1">Thêm ảnh</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} hidden />
                                    </label>
                                )}
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-lg flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-800 transition-all shadow-md md:shadow-xl shadow-slate-200"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} className="md:w-5 md:h-5" />}
                            {loading ? "Đang gửi..." : "Gửi đánh giá"}
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="flex-1 space-y-6 md:space-y-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg md:text-2xl font-bold text-slate-900">
                            Tất cả đánh giá 
                            <span className="ml-2 md:ml-3 px-2 py-0.5 md:px-3 md:py-1 bg-slate-100 text-slate-600 rounded-full text-xs md:text-sm font-bold">
                                {reviews.length}
                            </span>
                        </h3>
                    </div>

                    {fetching ? (
                        <div className="flex justify-center py-10 md:py-20">
                            <Loader2 className="animate-spin text-slate-300" size={30} />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-[16px] md:rounded-[32px] p-8 md:p-20 text-center">
                            <div className="w-12 h-12 md:w-20 md:h-20 bg-white border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-6">
                                <Star size={20} className="text-slate-200 md:w-8 md:h-8" />
                            </div>
                            <p className="text-slate-400 font-medium text-xs md:text-lg italic">"Hãy là người đầu tiên đánh giá sản phẩm này!"</p>
                        </div>
                    ) : (
                        <div className="space-y-6 md:space-y-10">
                            {reviews.map((item, index) => (
                                <div key={index} className="group relative">
                                    <div className="flex gap-3 md:gap-6">
                                        <div className="w-8 h-8 md:w-14 md:h-14 bg-slate-100 rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-50">
                                            <User size={16} className="text-slate-400 md:w-7 md:h-7" />
                                        </div>
                                        <div className="flex-1 pt-0.5 md:pt-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                                                <h4 className="font-bold text-slate-900 text-[11px] md:text-lg">{item.userName}</h4>
                                                <div className="flex gap-0.5 md:gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={10} 
                                                            fill={i < item.rating ? "#fbbf24" : "none"} 
                                                            stroke={i < item.rating ? "#fbbf24" : "#d1d5db"} 
                                                            className="md:w-3.5 md:h-3.5"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[9px] md:text-sm text-slate-400 font-medium mb-2 md:mb-4">{new Date(item.date).toLocaleDateString()}</p>
                                            <p className="text-slate-700 leading-relaxed text-[10px] md:text-lg mb-3 md:mb-6">{item.comment}</p>
                                            
                                            {item.images && item.images.length > 0 && (
                                                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-4 scrollbar-hide">
                                                    {item.images.map((img, i) => (
                                                        <img 
                                                            key={i} 
                                                            src={img} 
                                                            className="w-16 h-20 md:w-32 md:h-44 object-cover rounded-lg md:rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-105 cursor-zoom-in" 
                                                            alt="" 
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Phản hồi từ quản trị viên */}
                                            {item.adminReply && (
                                                <div className="mt-3 md:mt-6 bg-slate-50 border border-slate-100 rounded-[12px] md:rounded-[24px] p-3 md:p-6 relative before:content-[''] before:absolute before:-top-2 md:before:-top-3 before:left-4 md:before:left-6 before:w-0 before:h-0 before:border-l-[8px] md:before:border-l-[12px] before:border-l-transparent before:border-r-[8px] md:before:border-r-[12px] before:border-r-transparent before:border-b-[8px] md:before:border-b-[12px] before:border-b-slate-50">
                                                    <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-3">
                                                        <div className="w-5 h-5 md:w-8 md:h-8 bg-black rounded-full flex items-center justify-center">
                                                            <User size={10} className="text-white md:w-4 md:h-4" />
                                                        </div>
                                                        <span className="text-[9px] md:text-xs font-black uppercase text-slate-900 tracking-wider">Phản hồi từ FOREVERVN</span>
                                                        <span className="ml-auto text-[8px] md:text-[10px] text-slate-400 font-bold">{new Date(item.replyDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-slate-600 text-[10px] md:text-sm leading-relaxed italic font-medium">"{item.adminReply}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-3 md:-bottom-5 left-10 md:left-20 right-0 h-px bg-slate-100 group-last:hidden" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewSystem;
