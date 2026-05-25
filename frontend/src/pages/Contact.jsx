import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewsletterBox';
import { useLanguage } from '../context/LanguageContext';

const copyByLanguage = {
    vi: {
        title1: 'LIÊN HỆ',
        title2: 'CHÚNG TÔI',
        storeTitle: 'Trạm Premium',
        storeAddress: 'Hoạt động trực tuyến toàn quốc\nHỗ trợ khách hàng 24/7',
        storeContact: 'Zalo: 0327 906 061\nEmail: thuanphuc12b9@gmail.com',
        careersTitle: 'Hỗ trợ trực tuyến',
        careersBody: 'Quét mã QR Zalo bên cạnh để được hỗ trợ nhanh nhất hoặc liên hệ qua thông tin dưới đây.',
        careersCta: 'Nhắn tin Zalo ngay',
        direct1: 'THÔNG TIN',
        direct2: 'LIÊN HỆ',
        email: 'Email',
        phone: 'Zalo / Điện thoại',
    },
    en: {
        title1: 'CONTACT',
        title2: 'US',
        storeTitle: 'Trạm Premium',
        storeAddress: 'Online nationwide\n24/7 Customer Support',
        storeContact: 'Zalo: 0327 906 061\nEmail: thuanphuc12b9@gmail.com',
        careersTitle: 'Online Support',
        careersBody: 'Scan the Zalo QR code for the fastest support or contact us via the information below.',
        careersCta: 'Message on Zalo',
        direct1: 'CONTACT',
        direct2: 'INFO',
        email: 'Email',
        phone: 'Zalo / Phone',
    },
};

const Contact = () => {
    const { language } = useLanguage();
    const t = copyByLanguage[language];

    return (
        <div className="space-y-4 py-2 sm:space-y-6 sm:py-4">
            <section className="section-shell px-2 py-3 md:px-6 md:py-6 mx-2 md:mx-0">
                <div className="mb-4 md:mb-8 text-center">
                    <Title text1={t.title1} text2={t.title2} />
                </div>

                <div className="grid items-center gap-3 md:gap-6 lg:grid-cols-[0.8fr_1fr] max-w-4xl mx-auto">
                    <div className="overflow-hidden rounded-[16px] md:rounded-[24px] border border-white/70 bg-white/70 p-1 md:p-2 shadow-sm md:shadow-[0_22px_45px_rgba(15,23,42,0.1)] flex justify-center items-center bg-slate-50">
                        <img
                            className="w-full max-w-[75px] md:max-w-[200px] rounded-[12px] md:rounded-[18px] object-contain"
                            src={assets.qr_zalo}
                            alt="Zalo QR Code"
                        />
                    </div>

                    <div className="space-y-2 md:space-y-4">
                        <div className="rounded-[12px] md:rounded-[20px] border border-[var(--border)] bg-white p-2.5 md:p-5 shadow-sm">
                            <p className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{t.storeTitle}</p>
                            <p className="mt-1 md:mt-4 whitespace-pre-line text-[11px] md:text-sm leading-5 md:leading-7 text-slate-700 font-medium sm:text-base">
                                {t.storeAddress}
                            </p>
                            <p className="mt-1 md:mt-4 whitespace-pre-line text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500 sm:text-base">
                                {t.storeContact}
                            </p>
                        </div>

                        <div className="rounded-[12px] md:rounded-[20px] border border-[var(--border)] bg-white p-2.5 md:p-5 shadow-sm">
                            <p className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                                {t.careersTitle}
                            </p>
                            <p className="mt-1 md:mt-4 text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500 sm:text-base">
                                {t.careersBody}
                            </p>
                            <a 
                                href="https://zalo.me/0327906061" 
                                target="_blank" 
                                rel="noreferrer"
                                className="mt-2.5 md:mt-5 inline-block rounded-full bg-slate-900 px-4 md:px-6 py-2 md:py-3 text-[9px] md:text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 transition-all duration-300"
                            >
                                {t.careersCta}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-3 md:space-y-5 mx-2 md:mx-0">
                <div className="text-center">
                    <Title text1={t.direct1} text2={t.direct2} />
                </div>

                <div className="grid gap-2 md:gap-3 md:grid-cols-2 max-w-4xl mx-auto">
                    <div className="section-shell p-3 md:p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                        <p className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{t.email}</p>
                        <p className="mt-1 md:mt-4 text-sm md:text-lg font-semibold text-slate-900">thuanphuc12b9@gmail.com</p>
                    </div>

                    <div className="section-shell p-3 md:p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-md">
                        <p className="text-[10px] md:text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{t.phone}</p>
                        <p className="mt-1 md:mt-4 text-sm md:text-lg font-semibold text-slate-900">0327 906 061</p>
                    </div>
                </div>
            </section>

            <NewsletterBox />
        </div>
    );
};

export default Contact;
