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
            'Trạm Premium ra đời từ niềm đam mê công nghệ và mong muốn mang sức mạnh của AI đến gần hơn với mọi người. Hành trình của chúng tôi bắt đầu với một mục tiêu đơn giản: tạo ra nơi khách hàng có thể dễ dàng tiếp cận các công cụ AI hàng đầu với chi phí hợp lý nhất.',
        intro2:
            'Chúng tôi cung cấp đa dạng các tài khoản premium như ChatGPT, Claude, Canva, CapCut, Kling, v.v... đáp ứng mọi nhu cầu từ học tập, làm việc đến sáng tạo nội dung. Cho dù bạn là sinh viên, freelancer hay doanh nghiệp, chúng tôi đều có giải pháp tối ưu dành cho bạn.',
        missionTitle: 'Sứ mệnh của chúng tôi',
        missionBody:
            'Sứ mệnh của Trạm Premium là trao quyền cho khách hàng bằng những công cụ công nghệ tiên tiến. Chúng tôi cam kết mang đến trải nghiệm dịch vụ vượt trội, chất lượng ổn định và hỗ trợ khách hàng tận tâm trong suốt quá trình sử dụng.',
        why1: 'VÌ SAO',
        why2: 'CHỌN CHÚNG TÔI',
        qualityTitle: 'Đảm bảo chất lượng',
        qualityBody:
            'Mỗi tài khoản đều được chúng tôi kiểm tra kỹ lưỡng, đảm bảo hoạt động ổn định và đi kèm chính sách bảo hành rõ ràng.',
        convenienceTitle: 'Tiện lợi & Nhanh chóng',
        convenienceBody:
            'Quy trình mua hàng đơn giản, nhận tài khoản ngay lập tức giúp bạn tiết kiệm thời gian và bắt đầu công việc ngay.',
        serviceTitle: 'Hỗ trợ tận tâm',
        serviceBody:
            'Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7, đảm bảo bạn luôn có trải nghiệm mượt mà nhất.',
    },
    en: {
        title1: 'ABOUT',
        title2: 'US',
        intro1:
            'Trạm Premium was born from a passion for technology and a desire to bring the power of AI closer to everyone. Our journey started with a simple goal: create a place where customers can easily access top AI tools at the most reasonable cost.',
        intro2:
            'We offer a wide range of premium accounts such as ChatGPT, Claude, Canva, CapCut, Kling, etc., catering to all needs from studying and working to content creation. Whether you are a student, freelancer, or business, we have the optimal solution for you.',
        missionTitle: 'Our Mission',
        missionBody:
            'The mission of Trạm Premium is to empower customers with advanced technological tools. We are committed to delivering an outstanding service experience, stable quality, and dedicated customer support throughout your usage.',
        why1: 'WHY',
        why2: 'CHOOSE US',
        qualityTitle: 'Quality Assurance',
        qualityBody:
            'Every account is thoroughly checked by us to ensure stable operation, backed by a clear warranty policy.',
        convenienceTitle: 'Convenience & Speed',
        convenienceBody:
            'A simple purchasing process and instant account delivery save you time so you can start working right away.',
        serviceTitle: 'Dedicated Support',
        serviceBody:
            'Our team is always ready to support you 24/7, ensuring you have the smoothest experience possible.',
    },
};

const About = () => {
    const { language } = useLanguage();
    const t = copyByLanguage[language];

    return (
        <div className="space-y-6 py-4 sm:space-y-8 sm:py-6">
            <section className="section-shell px-5 py-6 sm:px-8 sm:py-8">
                <div className="mb-8 text-center">
                    <Title text1={t.title1} text2={t.title2} />
                </div>

                <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
                    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-3 shadow-[0_22px_45px_rgba(15,23,42,0.1)]">
                        <img
                            className="w-full h-auto rounded-[22px]"
                            src={assets.about_img}
                            alt="About Forever"
                        />
                    </div>

                    <div className="space-y-5 text-sm leading-7 text-slate-500 sm:text-base">
                        <p>{t.intro1}</p>
                        <p>{t.intro2}</p>

                        <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                            <b className="text-slate-900">{t.missionTitle}</b>
                            <p className="mt-3">{t.missionBody}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-5">
                <div className="text-center">
                    <Title text1={t.why1} text2={t.why2} />
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="section-shell p-6 sm:p-7">
                        <b className="text-slate-900">{t.qualityTitle}</b>
                        <p className="mt-4 text-sm leading-7 text-slate-500">
                            {t.qualityBody}
                        </p>
                    </div>

                    <div className="section-shell p-6 sm:p-7">
                        <b className="text-slate-900">{t.convenienceTitle}</b>
                        <p className="mt-4 text-sm leading-7 text-slate-500">
                            {t.convenienceBody}
                        </p>
                    </div>

                    <div className="section-shell p-6 sm:p-7">
                        <b className="text-slate-900">{t.serviceTitle}</b>
                        <p className="mt-4 text-sm leading-7 text-slate-500">
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
