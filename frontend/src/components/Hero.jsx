import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Sparkles, WandSparkles, ChevronRight } from 'lucide-react';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import Marquee from './Marquee';

const Hero = () => {
  const { language } = useLanguage();

  const copy = useMemo(() => {
    if (language === 'vi') {
      return {
        badge: 'PHUC THUAN AI',
        title: 'Mở Khóa Tài Khoản Premium AI',
        description:
          'Sở hữu ngay các công cụ AI, phần mềm thiết kế và giải trí đỉnh cao. Nhanh chóng - Uy tín - Bảo hành 1 đổi 1.',
        fomoText: '⚡ Ưu đãi giảm giá lên tới 50% chỉ hôm nay!',
        quickNotes: [
          {
            title: 'AI & Tools',
            price: 'Chỉ từ 29k',
            tags: ['Cursor', 'Claude', 'Grok...'],
            link: '/collection', // Điều hướng thẳng tới trang sản phẩm
          },
          {
            title: 'Thiết Kế',
            price: 'Chỉ từ 19k',
            tags: ['Canva', 'CapCut', 'Kling...'],
            link: '/collection',
          },
          {
            title: 'Giải Trí',
            price: 'Giá sốc',
            tags: ['YouTube', 'VPN', 'Netflix...'],
            link: '/collection',
          },
        ],
        shopNow: 'MUA NGAY TỪ 29K',
        ourStory: 'Về chúng tôi',
        support1: 'Bảo hành 1 đổi 1',
        support2: 'Hỗ trợ 24/7',
        support3: 'Giao tức thì',
        cardTitle: 'Cam Kết Uy Tín',
        cardText: 'Bảo hành xuyên suốt thời gian dùng. Hoàn tiền ngay nếu có lỗi.',
        imageAlt: 'Premium Accounts',
      };
    }

    return {
      badge: 'PHUC THUAN AI',
      title: 'Unlock Your Limits With Premium Accounts',
      description:
        'Get instant access to top-tier AI tools, design software, and entertainment. Fast - Trusted - 1-to-1 Warranty.',
      fomoText: '⚡ Up to 50% OFF - Today only!',
      quickNotes: [
        {
          title: 'AI & Tools',
          price: 'From $1.99',
          tags: ['Cursor', 'Claude', 'Grok...'],
          link: '/collection',
        },
        {
          title: 'Design',
          price: 'From $0.99',
          tags: ['Canva', 'CapCut', 'Kling...'],
          link: '/collection',
        },
        {
          title: 'Entertainment',
          price: 'Best Price',
          tags: ['YouTube', 'VPN', 'Netflix...'],
          link: '/collection',
        },
      ],
      shopNow: 'BUY NOW - $1.99',
      ourStory: 'About Us',
      support1: '1-to-1 Warranty',
      support2: '24/7 Support',
      support3: 'Instant Delivery',
      cardTitle: 'Trust & Quality',
      cardText: 'Guaranteed authentic accounts. Full refund if errors occur.',
      imageAlt: 'Premium Accounts',
    };
  }, [language]);

  return (
    <section className='section-shell relative overflow-hidden px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(221,232,243,0.82),transparent_28%),linear-gradient(135deg,rgba(255,247,237,0.85),rgba(255,255,255,0.8))]' />

      <div className='relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12'>
        <div className='w-full'>
          <div className='inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)]'>
            <span className='h-2 w-2 rounded-full bg-slate-900' />
            {copy.badge}
          </div>

          <h1 className='display-font mt-6 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl'>
            {copy.title}
          </h1>

          <p className='mt-4 max-w-2xl text-base leading-7 text-slate-500'>
            {copy.description}
          </p>

          {/* 3 Khung Danh Mục - Đã chuyển thành Link điều hướng */}
          <div className='mt-6 grid gap-4 sm:grid-cols-3'>
            {copy.quickNotes.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                className='group relative flex flex-col justify-between cursor-pointer rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md'
              >
                <div>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='text-[14px] font-bold text-slate-800'>{item.title}</span>
                    <span className='whitespace-nowrap rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600'>
                      {item.price}
                    </span>
                  </div>
                  
                  {/* Tags thu gọn */}
                  <div className='flex flex-wrap gap-1.5 opacity-85 transition-opacity group-hover:opacity-100'>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className='rounded-md bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-600'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Nút bấm giả để kích thích click */}
                <div className='mt-3 flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-slate-900 transition-colors'>
                  Xem ngay <ChevronRight className='h-3 w-3' />
                </div>
              </Link>
            ))}
          </div>

          {/* Badge FOMO */}
          <div className='mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-50/80 px-3 py-2 border border-amber-100'>
            <span className='relative flex h-2.5 w-2.5'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75' />
              <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500' />
            </span>
            <p className='text-xs font-bold text-amber-700'>
              {copy.fomoText}
            </p>
          </div>

          <div className='mt-8 flex flex-wrap items-center gap-4'>
            <Link
              to='/collection'
              className='inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)] hover:-translate-y-0.5 hover:bg-slate-800 transition-transform'
            >
              {copy.shopNow}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='mt-8 flex flex-wrap gap-3'>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600'>
              <BadgeCheck className='h-4 w-4 text-emerald-500' />
              {copy.support1}
            </div>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600'>
              <Sparkles className='h-4 w-4 text-amber-500' />
              {copy.support2}
            </div>
            <div className='inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600'>
              <WandSparkles className='h-4 w-4 text-indigo-500' />
              {copy.support3}
            </div>
          </div>
        </div>

        <div className='relative'>
          <div className='absolute -left-6 top-8 hidden h-28 w-28 rounded-full bg-white/70 blur-2xl md:block' />
          <div className='absolute -right-4 bottom-10 hidden h-24 w-24 rounded-full bg-[#ffe8cc]/80 blur-2xl md:block' />

          <div className='overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-3 shadow-[0_28px_50px_rgba(15,23,42,0.12)]'>
            <img
              className='h-full w-full rounded-[22px] object-cover'
              src={assets.hero_img}
              alt={copy.imageAlt}
            />
          </div>
        </div>
      </div>
      
      <div className='relative z-10 w-full pt-4'>
        <Marquee />
      </div>
    </section>
  );
};

export default Hero;