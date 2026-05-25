import React from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import NewsletterBox from '../components/NewsletterBox';
import { useLanguage } from '../context/LanguageContext';

const copyByLanguage = {
    vi: {
        title1: 'GIỚI THIỆU',
        title2: 'CHÚNG TÔI',
        intro1:
            'Trạm Premium giúp bạn tiếp cận các công cụ AI hàng đầu thế giới với chi phí tiết kiệm nhất.',
        intro2:
            'Cung cấp đa dạng tài khoản: ChatGPT, Canva, CapCut... phục vụ học tập, làm việc và sáng tạo nội dung.',
        missionTitle: 'Sứ mệnh',
        missionBody:
            'Trao quyền bằng công cụ AI tiên tiến, dịch vụ ổn định và hỗ trợ tận tâm.',
        why1: 'VÌ SAO',
        why2: 'CHỌN CHÚNG TÔI',
        qualityTitle: 'Đảm bảo chất lượng',
        qualityBody:
            'Tài khoản kiểm tra kỹ lưỡng, bảo hành rõ ràng, hoạt động ổn định.',
        convenienceTitle: 'Tiện lợi & Nhanh chóng',
        convenienceBody:
            'Quy trình mua hàng dễ dàng, nhận tài khoản ngay lập tức.',
        serviceTitle: 'Hỗ trợ tận tâm',
        serviceBody:
            'Đội ngũ túc trực 24/7, luôn đồng hành cùng bạn.',
    },
    en: {
        title1: 'ABOUT',
        title2: 'US',
        intro1:
            'Trạm Premium helps you access world-class AI tools at the most affordable cost.',
        intro2:
            'Offering various accounts: ChatGPT, Canva, CapCut... for study, work and content creation.',
        missionTitle: 'Mission',
        missionBody:
            'Empower through advanced AI tools, stable services, and dedicated support.',
        why1: 'WHY',
        why2: 'CHOOSE US',
        qualityTitle: 'Quality Assurance',
        qualityBody:
            'Thoroughly checked accounts, clear warranty, stable operation.',
        convenienceTitle: 'Fast & Convenient',
        convenienceBody:
            'Easy purchase process, get your account instantly.',
        serviceTitle: 'Dedicated Support',
        serviceBody:
            '24/7 support team, always by your side.',
    },
};

const About = () => {
    const { language } = useLanguage();
    const t = copyByLanguage[language];

    return (
        <div className="space-y-4 py-2 sm:space-y-6 sm:py-4">
            <section className="section-shell px-2 py-3 md:px-6 md:py-6 mx-2 md:mx-0">
                <div className="mb-4 md:mb-8 text-center">
                    <Title text1={t.title1} text2={t.title2} />
                </div>

                <div className="grid items-center gap-3 md:gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
                    <div className="overflow-hidden rounded-[16px] md:rounded-[24px] border border-white/70 bg-white/70 p-1 md:p-2 shadow-sm md:shadow-[0_22px_45px_rgba(15,23,42,0.1)]">
                        <img
                            className="w-full h-auto rounded-[12px] md:rounded-[18px]"
                            src={assets.about_img}
                            alt="About Forever"
                        />
                    </div>

                    <div className="space-y-2 md:space-y-5 text-[10px] md:text-sm leading-[1.3] md:leading-7 text-slate-500 sm:text-base">
                        <p>{t.intro1}</p>
                        <p>{t.intro2}</p>

                        <div className="rounded-[12px] md:rounded-[20px] border border-[var(--border)] bg-white p-2 md:p-4">
                            <b className="text-[11px] md:text-base text-slate-900">{t.missionTitle}</b>
                            <p className="mt-1 md:mt-3">{t.missionBody}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-2 md:space-y-5 mx-2 md:mx-0">
                <div className="text-center">
                    <Title text1={t.why1} text2={t.why2} />
                </div>

                <div className="grid gap-1.5 md:gap-3 lg:grid-cols-3">
                    <div className="section-shell p-2 md:p-6">
                        <b className="text-[11px] md:text-base text-slate-900">{t.qualityTitle}</b>
                        <p className="mt-1 md:mt-4 text-[9px] md:text-sm leading-[1.3] md:leading-7 text-slate-500">
                            {t.qualityBody}
                        </p>
                    </div>

                    <div className="section-shell p-2 md:p-6">
                        <b className="text-[11px] md:text-base text-slate-900">{t.convenienceTitle}</b>
                        <p className="mt-1 md:mt-4 text-[9px] md:text-sm leading-[1.3] md:leading-7 text-slate-500">
                            {t.convenienceBody}
                        </p>
                    </div>

                    <div className="section-shell p-2 md:p-6">
                        <b className="text-[11px] md:text-base text-slate-900">{t.serviceTitle}</b>
                        <p className="mt-1 md:mt-4 text-[9px] md:text-sm leading-[1.3] md:leading-7 text-slate-500">
                            {t.serviceBody}
                        </p>
                    </div>
                </div>
            </section>

            <NewsletterBox />
        </div>
    );
};

export default About;
