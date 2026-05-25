import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { language } = useLanguage();

    const copy = useMemo(() => {
        if (language === 'vi') {
            return {
                description:
                    'Trạm Premium mang đến các tài khoản phần mềm và công cụ AI chất lượng cao với mức giá tốt nhất thị trường. Uy tín, nhanh chóng và hỗ trợ 24/7.',
                company: 'TRẠM PREMIUM',
                home: 'Trang chủ',
                about: 'Giới thiệu',
                collection: 'Sản phẩm',
                contact: 'Liên hệ',
                touch: 'LIÊN HỆ HỖ TRỢ',
                copyright: 'Copyright 2026 @ Trạm Premium - Bảo lưu mọi quyền.',
            };
        }

        return {
            description:
                'Trạm Premium provides high-quality software accounts and AI tools at the best market prices. Reliable, fast, and 24/7 support.',
            company: 'TRẠM PREMIUM',
            home: 'Home',
            about: 'About us',
            collection: 'Products',
            contact: 'Contact',
            touch: 'GET IN TOUCH',
            copyright: 'Copyright 2026 @ Trạm Premium - All rights reserved.',
        };
    }, [language]);

    return (
        <footer className="mt-4 md:mt-8 lg:mt-12">
            <div className="section-shell grid gap-4 px-3 py-4 text-[11px] md:text-sm sm:px-6 sm:py-6 lg:grid-cols-[2fr_1fr_1fr] lg:gap-8 mx-2 md:mx-0">
                <div>
                    <img src={assets.logo} className="mb-2 w-16 md:mb-4 md:w-28" alt="logo" />
                    <p className="max-w-lg text-[10px] leading-5 md:text-sm md:leading-7 text-slate-500">
                        {copy.description}
                    </p>
                </div>

                <div>
                    <p className="mb-2 text-xs md:text-base md:mb-4 font-semibold text-slate-900">{copy.company}</p>
                    <ul className="flex flex-col gap-1 md:gap-3 text-[10px] md:text-sm text-slate-500">
                        <li><Link className="hover:text-slate-900" to="/">{copy.home}</Link></li>
                        <li><Link className="hover:text-slate-900" to="/about">{copy.about}</Link></li>
                        <li><Link className="hover:text-slate-900" to="/collection">{copy.collection}</Link></li>
                        <li><Link className="hover:text-slate-900" to="/contact">{copy.contact}</Link></li>
                    </ul>
                </div>

                <div>
                    <p className="mb-2 text-xs md:text-base md:mb-4 font-semibold text-slate-900">{copy.touch}</p>
                    <ul className="flex flex-col gap-1 md:gap-3 text-[10px] md:text-sm text-slate-500">
                        <li>0327906061</li>
                        <li>thuanphuc12b9@gmail.com</li>
                    </ul>
                </div>
            </div>

            <div className="px-2 py-3 md:py-5 text-center text-[10px] md:text-sm text-slate-500">
                <p>{copy.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;
