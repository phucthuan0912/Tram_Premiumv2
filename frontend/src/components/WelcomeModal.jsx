import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

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

        <div className="w-full md:w-1/2 h-[250px] md:h-auto bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
          <div className="max-w-[280px] w-full">
            <div className="overflow-hidden rounded-[24px] border-4 border-[#0068FF] bg-white p-4 shadow-[0_16px_40px_rgba(0,104,255,0.25)]">
              <img 
                src={assets.qr_zalo} 
                alt="Zalo QR Code" 
                className="w-full h-auto"
              />
              <div className='mt-3 text-center'>
                <p className='text-base font-bold text-[#0068FF]'>
                  📱 Quét mã Zalo
                </p>
                <p className='text-sm text-slate-600 mt-1'>
                  Liên hệ tư vấn ngay
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center bg-white">
          <p className="text-xs font-bold tracking-widest text-gray-500 mb-3 uppercase">
            Trạm Premium
          </p>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Tài khoản Premium <br/> Giá tốt nhất
          </h2>
          
          <p className="text-gray-600 mb-6 font-medium">AI • Design • Streaming</p>
          
          <div className="mb-6 text-sm text-gray-600 space-y-2">
            <p>✨ Grok, Claude, Cursor</p>
            <p>🎨 Canva, CapCut, Kling</p>
            <p>📺 YouTube, Netflix, VPN</p>
          </div>
          
          {/* NÚT BUY NOW - Gắn thêm onClick={handleClose} */}
          <a 
            href="/collection" 
            onClick={handleClose}
            className="w-full py-3.5 px-6 bg-[#C67A63] hover:bg-[#a66551] text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
          >
            Xem tài khoản
          </a>
        </div>

      </div>
    </div>
  );
};

export default WelcomeModal;