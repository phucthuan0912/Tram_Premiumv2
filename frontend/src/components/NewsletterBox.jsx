import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';
import { assets } from '../assets/assets';

const PROMO_DURATION_DAYS = 37;

const getNextPromoDeadline = () => {
    const now = new Date();
    const deadline = new Date(now);

    deadline.setDate(deadline.getDate() + PROMO_DURATION_DAYS);
    deadline.setHours(23, 59, 59, 999);
    return deadline;
};

const buildCountdown = (targetDate) => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) {
        return { days: '00', hours: '00', minutes: '00', seconds: '00' };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    return {
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
    };
};

const NewsletterBox = ({ featured = false }) => {
    const { backendUrl } = useContext(ShopContext);
    const { language } = useLanguage();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [promoDeadline, setPromoDeadline] = useState(() => getNextPromoDeadline());
    const [countdown, setCountdown] = useState(() => buildCountdown(getNextPromoDeadline()));

    const timerItems = useMemo(
        () =>
            language === 'vi'
                ? [
                      { key: 'days', label: 'Ngày' },
                      { key: 'hours', label: 'Giờ' },
                      { key: 'minutes', label: 'Phút' },
                      { key: 'seconds', label: 'Giây' },
                  ]
                : [
                      { key: 'days', label: 'Days' },
                      { key: 'hours', label: 'Hrs' },
                      { key: 'minutes', label: 'Mins' },
                      { key: 'seconds', label: 'Secs' },
                  ],
        [language],
    );

    const copy = useMemo(() => {
        if (language === 'vi') {
            return {
                success: 'Cảm ơn bạn! Vui lòng kiểm tra email để nhận thông tin liên hệ',
                error: 'Hiện chưa thể đăng ký nhận tin',
                compactTitle: 'Đăng ký nhận thông tin tư vấn miễn phí',
                compactDesc:
                    'Để lại email, chúng tôi sẽ gửi thông tin liên hệ Zalo và báo giá các tài khoản premium cho bạn.',
                featuredBadge: 'Ưu đãi cho khách hàng mới',
                featuredTitle: 'Tư vấn miễn phí trước khi hết hạn.',
                featuredDesc:
                    'Nhận báo giá và tư vấn các gói premium AI, Design, Streaming qua Zalo ngay.',
                subscriberTitle: 'Đăng ký nhận tư vấn',
                subscriberDesc:
                    'Để lại email, chúng tôi sẽ liên hệ qua Zalo để gửi báo giá ưu đãi nhất.',
                subscriberPill: 'Tư vấn miễn phí qua Zalo',
                emailPlaceholder: 'Nhập email của bạn',
                sending: 'Đang gửi...',
                subscribe: 'Đăng ký',
                shopNow: 'Xem sản phẩm',
            };
        }

        return {
            success: 'Thank you! Please check your email for contact information',
            error: 'Cannot subscribe right now',
            compactTitle: 'Get Free Consultation',
            compactDesc:
                'Leave your email to receive consultation and pricing for premium AI, Design, Streaming accounts. We will send Zalo contact information directly to your email.',
            featuredBadge: 'Special offer for new customers',
            featuredTitle: 'Get free consultation before time runs out.',
            featuredDesc:
                'Register now to receive contact information via Zalo. We will consult and quote premium accounts that suit your needs.',
            subscriberTitle: 'Get Free Consultation',
            subscriberDesc:
                'Leave your email to receive consultation and pricing for premium AI, Design, Streaming accounts. Zalo contact information will be sent directly to your email.',
            subscriberPill: 'Free consultation via Zalo',
            emailPlaceholder: 'Enter your email',
            sending: 'Sending...',
            subscribe: 'Subscribe',
            shopNow: 'View Products',
        };
    }, [language]);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            const next = buildCountdown(promoDeadline);

            if (Object.values(next).every((value) => value === '00')) {
                const nextDeadline = getNextPromoDeadline();
                setPromoDeadline(nextDeadline);
                setCountdown(buildCountdown(nextDeadline));
                return;
            }

            setCountdown(next);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [promoDeadline]);

    const timerValues = useMemo(
        () => timerItems.map((item) => ({ ...item, value: countdown[item.key] })),
        [countdown, timerItems],
    );

    const promoSummary = useMemo(() => {
        const diff = promoDeadline.getTime() - Date.now();
        if (diff <= 0) {
            return language === 'vi' ? '\u01afu \u0111\u00e3i k\u1ebft th\u00fac trong h\u00f4m nay.' : 'The offer ends today.';
        }

        const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(totalDays / 30);
        const days = totalDays % 30;

        if (language === 'vi') {
            if (months > 0) {
                return `C\u00f2n kho\u1ea3ng ${months} th\u00e1ng ${days} ng\u00e0y \u0111\u1ec3 nh\u1eadn \u01b0u \u0111\u00e3i n\u00e0y.`;
            }

            return `C\u00f2n kho\u1ea3ng ${totalDays} ng\u00e0y \u0111\u1ec3 nh\u1eadn \u01b0u \u0111\u00e3i n\u00e0y.`;
        }

        if (months > 0) {
            return `About ${months} month${months > 1 ? 's' : ''} ${days} day${days !== 1 ? 's' : ''} left for this offer.`;
        }

        return `About ${totalDays} day${totalDays !== 1 ? 's' : ''} left for this offer.`;
    }, [countdown.days, countdown.hours, countdown.minutes, countdown.seconds, language, promoDeadline]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            const { data } = await axios.post(`${backendUrl}/api/system/newsletter/subscribe`, {
                email: email.trim(),
            });

            if (data?.success) {
                toast.success(data.message || copy.success);
                setEmail('');
                return;
            }

            toast.error(data?.message || copy.error);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || copy.error);
        } finally {
            setLoading(false);
        }
    };

    if (!featured) {
        return (
            <section className='section-shell relative overflow-hidden px-2 md:px-5 py-3 md:py-0 text-center sm:px-8 lg:py-8 mx-2 md:mx-0'>
                <div className='absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(221,232,243,0.9),transparent_60%)] md:block' />

                <div className='relative'>
                    <p className='display-font text-lg md:text-3xl font-semibold tracking-[-0.04em] text-slate-900'>
                        {copy.compactTitle}
                    </p>

                    <p className='mx-auto mt-1 md:mt-4 max-w-2xl text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500'>
                        {copy.compactDesc}
                    </p>

                    <form
                        onSubmit={onSubmitHandler}
                        className='mx-auto mt-3 md:mt-6 flex w-full max-w-2xl flex-col gap-1.5 md:gap-3 sm:flex-row'
                    >
                        <input
                            className='w-full rounded-full border border-[var(--border)] bg-white px-3 md:px-5 py-2 md:py-4 text-[10px] md:text-sm outline-none shadow-sm'
                            type='email'
                            placeholder={copy.emailPlaceholder}
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className='rounded-full bg-slate-900 px-4 md:px-10 py-2 md:py-4 text-[9px] md:text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60'
                        >
                            {loading ? copy.sending : copy.subscribe}
                        </button>
                    </form>
                </div>
            </section>
        );
    }

    return (
        <section className='section-shell relative overflow-hidden px-1 md:px-5 py-2 md:py-0 sm:px-8 lg:py-8 mx-2 md:mx-0'>
            <div className='absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(221,232,243,0.9),transparent_60%)] md:block' />

            <div className='relative grid gap-2 md:gap-4 xl:grid-cols-[0.92fr_1.08fr] xl:items-center'>
                <div className='overflow-hidden rounded-[12px] md:rounded-[24px] border border-[#f5d9b4] bg-[linear-gradient(135deg,#fffaf2,#fff7ed)] px-2 py-3 shadow-sm md:shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6'>
                    <p className='text-[8px] md:text-xs font-semibold uppercase tracking-[0.2em] text-[#b45309]'>
                        {copy.featuredBadge}
                    </p>

                    <h3 className='display-font mt-1.5 md:mt-2 text-lg md:text-3xl font-semibold tracking-[-0.04em] text-slate-900'>
                        {copy.featuredTitle}
                    </h3>

                    <p className='mt-1 md:mt-2 max-w-xl text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500'>
                        {copy.featuredDesc}
                    </p>

                    <div className='mt-3 inline-flex rounded-full border border-[#f5d9b4] bg-white/80 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#b45309]'>
                        {promoSummary}
                    </div>

                    <div className='mt-2 md:mt-4 grid grid-cols-4 gap-1 md:gap-2'>
                        {timerValues.map((item) => (
                            <div
                                key={item.key}
                                className='rounded-[8px] md:rounded-[16px] border border-[#f5d9b4] bg-white/80 px-1 py-1.5 md:px-2 md:py-3 text-center'
                            >
                                <div className='text-xs md:text-xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-2xl'>
                                    {item.value}
                                </div>
                                <div className='mt-0.5 text-[7px] md:text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400'>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mt-3 md:mt-4 flex flex-wrap items-center gap-4'>
                        <Link
                            to='/collection'
                            className='inline-flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xl font-medium text-slate-900'
                        >
                            <span>{copy.shopNow}</span>
                            <span className='flex h-6 w-6 md:h-12 md:w-12 items-center justify-center rounded-full bg-[#d5a574] text-white shadow-[0_16px_30px_rgba(213,165,116,0.35)]'>
                                <ArrowRight className='h-3 w-3 md:h-5 md:w-5' />
                            </span>
                        </Link>
                    </div>
                </div>

                <div className='text-center xl:text-left mt-2 md:mt-0'>
                    <p className='display-font text-lg md:text-3xl font-semibold tracking-[-0.04em] text-slate-900'>
                        {copy.subscriberTitle}
                    </p>

                    <p className='mx-auto mt-1 md:mt-3 max-w-2xl text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500 xl:mx-0'>
                        {copy.subscriberDesc}
                    </p>

                    <div className='mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309] xl:mx-0'>
                        {copy.subscriberPill}
                    </div>

                    <form
                        onSubmit={onSubmitHandler}
                        className='mx-auto mt-3 md:mt-6 flex w-full max-w-2xl flex-col gap-1.5 md:gap-3 sm:flex-row xl:mx-0'
                    >
                        <input
                            className='w-full rounded-full border border-[var(--border)] bg-white px-3 md:px-5 py-2 md:py-4 text-[10px] md:text-sm outline-none shadow-sm'
                            type='email'
                            placeholder={copy.emailPlaceholder}
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className='rounded-full bg-slate-900 px-4 md:px-8 py-2 md:py-4 text-[9px] md:text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-10'
                        >
                            {loading ? copy.sending : copy.subscribe}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default NewsletterBox;
