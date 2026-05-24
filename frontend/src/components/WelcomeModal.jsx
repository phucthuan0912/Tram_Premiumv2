import React, { useState, useEffect } from 'react';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra trong bộ nhớ trình duyệt xem người dùng đã từng tắt popup chưa
    const hasSeenPopup = localStorage.getItem('hasSeenPopup');
    
    // 2. Nếu chưa từng tắt (hasSeenPopup là null), mới cho hiện popup sau 1 giây
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Hàm xử lý chung khi người dùng bấm Tắt (X) hoặc bấm Buy Now
  const handleClose = () => {
    setIsOpen(false); // Ẩn popup ngay lập tức
    localStorage.setItem('hasSeenPopup', 'true'); // Ghi nhớ vĩnh viễn vào trình duyệt
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all p-4">
      <div className="relative w-full max-w-[800px] bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Nút Đóng (X) - Gắn hàm handleClose */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 p-1 bg-white/70 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full md:w-1/2 h-[250px] md:h-auto bg-gray-100">
          <img 
            src="https://via.placeholder.com/400x500/ff9900/ffffff?text=Your+Image+Here" 
            alt="Promotion" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-white">
          <p className="text-xs font-bold tracking-widest text-gray-500 mb-3 uppercase">
            Get My Product
          </p>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            2026 Dream Big <br/> Vision Workbook
          </h2>
          
          <p className="text-gray-600 mb-8 font-medium">Now Available</p>
          
          {/* NÚT BUY NOW - Gắn thêm onClick={handleClose} */}
          <a 
            href="/collection" 
            onClick={handleClose}
            className="w-full py-3.5 px-6 bg-[#C67A63] hover:bg-[#a66551] text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
          >
            Buy Now
          </a>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;