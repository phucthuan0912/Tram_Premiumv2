import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, PackageCheck, Sparkles, Truck, WandSparkles } from "lucide-react";

import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import Hero from "../components/Hero";
import BannerSlider from "../components/BannerSlider";
import LatestCollection from "../components/LatestCollection";
import BestSeller from "../components/BestSeller";
import NewsletterBox from "../components/NewsletterBox";
import ProductItem from "../components/ProductItem";
import RotatingBadge from "../components/RotatingBadge";

const PulsingTag = ({ text, icon }) => (
  <div className="absolute -top-4 right-4 lg:-right-4 z-20 flex animate-pulse items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 text-xs font-bold tracking-wider text-rose-600 border border-rose-200 shadow-sm">
    <span className="text-base animate-bounce">{icon}</span>
    {text}
  </div>
);

const GradientTag = ({ text, icon }) => (
  <div className="absolute -top-4 left-4 lg:-left-4 z-20 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-xs font-bold tracking-wider text-white shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] transition-transform hover:scale-105">
    <span className="text-base animate-pulse">{icon}</span>
    {text}
  </div>
);

const Home = () => {
  const { products } = useContext(ShopContext);
  const { language } = useLanguage();
  const editorialProducts = useMemo(() => products.slice(0, 3), [products]);

  const copy = useMemo(() => {
    if (language === 'vi') {
      return {
        pillars: [
          {
            title: "Công cụ AI hàng đầu",
            value: "Grok, Claude, Cursor",
            description: "Truy cập các AI chatbot và coding assistant mạnh mẽ nhất với giá cả phải chăng.",
            icon: Sparkles,
            tone: "bg-[#fef2f2]",
            iconTone: "bg-white text-rose-500",
          },
          {
            title: "Phần mềm thiết kế",
            value: "Canva, CapCut, Kling",
            description: "Sáng tạo nội dung chuyên nghiệp với các công cụ thiết kế và video AI tiên tiến.",
            icon: WandSparkles,
            tone: "bg-[#eff6ff]",
            iconTone: "bg-white text-sky-500",
          },
          {
            title: "Giải trí & Tiện ích",
            value: "YouTube, Netflix, VPN",
            description: "Trải nghiệm giải trí không giới hạn và bảo mật trực tuyến tối ưu.",
            icon: Truck,
            tone: "bg-[#fff7ed]",
            iconTone: "bg-white text-amber-500",
          },
        ],
        brandStory: 'Về chúng tôi',
        brandTitle: 'Công nghệ AI cho mọi người.',
        brandText1: 'Trạm Premium mang đến các tài khoản premium với giá cả phải chăng nhất. Từ sinh viên, freelancer đến doanh nghiệp - ai cũng có thể sử dụng công cụ AI tốt nhất để phát triển. Cam kết chất lượng, uy tín và hỗ trợ tận tâm 24/7.',
        brandText2: '',
        exploreCollection: 'Xem tài khoản',
        meetBrand: 'Về chúng tôi',
        editorialTag: 'Demo',
        editorialTitle: 'Trải nghiệm sức mạnh của AI.',
        editorialText: 'Kling AI giúp tạo ảnh thay đồ và video sáng tạo nhanh chóng. Hàng triệu người đang dùng AI để làm content và marketing.',
        lookFeel: 'Giá trị cốt lõi',
        lookFeelTitle: 'Uy tín & Chất lượng.',
        lookFeelText: 'Mỗi tài khoản được kiểm tra kỹ lưỡng, đảm bảo hoạt động ổn định và được bảo hành 1 đổi 1.',
        clearerJourney: 'Giao dịch nhanh chóng',
        clearerJourneyText: 'Nhận tài khoản ngay sau khi thanh toán, hỗ trợ 24/7 qua Zalo.',
        firstImpression: 'Giá tốt nhất',
        firstImpressionText: 'Cam kết giá rẻ nhất thị trường với chất lượng dịch vụ hàng đầu.',
        hotTrendingBadge: 'ĐANG THỊNH HÀNH - ĐANG THỊNH HÀNH - ',
        tramPremiumBadge: 'TRẠM PREMIUM - TRẠM PREMIUM - ',
        aiDemoBadge: 'TÍNH NĂNG - DEMO AI - ',
        demoColorTitle: '🎨 Demo: Thay đổi màu áo tự động',
        demoInputShirt: '👕 Input: Áo trắng',
        demoOriginalImg: 'Ảnh gốc ban đầu',
        demoOutputRed: '📤 Output: Áo đỏ',
        demoAutoColor: 'AI tự động đổi màu',
        demoOutputBlue: '📤 Output: Áo xanh',
        demoInSeconds: 'Chỉ trong vài giây',
        klingDemoTitle: '🎨 Kling AI - Tạo ảnh & Video',
        klingDemoDesc: 'Tạo ảnh thay đồ ảo và video AI chuyên nghiệp chỉ trong vài giây.',
        geminiDemoTitle: '🤖 Gemini Pro - AI Chatbot',
        geminiDemoDesc: 'AI thông minh giúp trả lời câu hỏi, viết content và giải quyết vấn đề.',
        feature1Title: '✨ Thay đổi màu sắc',
        feature1Desc: 'Đổi màu áo, phụ kiện tự động bằng AI.',
        feature2Title: '🎬 Tạo video từ ảnh',
        feature2Desc: 'Biến ảnh tĩnh thành video sống động tự nhiên.',
        feature3Title: '💬 AI Chat thông minh',
        feature3Desc: 'Trợ lý AI giúp viết, phân tích và sáng tạo.',
        videoNotSupported: 'Trình duyệt của bạn không hỗ trợ video.',
      };
    }

    return {
      pillars: [
        {
          title: "Top AI Tools",
          value: "Grok, Claude, Cursor",
          description: "Access the most powerful AI chatbots and coding assistants at affordable prices.",
          icon: Sparkles,
          tone: "bg-[#fef2f2]",
          iconTone: "bg-white text-rose-500",
        },
        {
          title: "Design Software",
          value: "Canva, CapCut, Kling",
          description: "Create professional content with advanced AI design and video tools.",
          icon: WandSparkles,
          tone: "bg-[#eff6ff]",
          iconTone: "bg-white text-sky-500",
        },
        {
          title: "Entertainment & Utilities",
          value: "YouTube, Netflix, VPN",
          description: "Unlimited entertainment experience and optimal online security.",
          icon: Truck,
          tone: "bg-[#fff7ed]",
          iconTone: "bg-white text-amber-500",
        },
      ],
      brandStory: 'Vision & Mission',
      brandTitle: 'Unlock technology potential for everyone.',
      brandText1: 'Trạm Premium believes that AI technology and premium tools should not be a privilege of the few. We provide access to premium accounts at the most affordable prices, helping everyone - from students, freelancers to small businesses - use the best tools to grow.',
      brandText2: 'With commitment to quality, trust and dedicated support, we not only sell accounts but also accompany you on your technology journey.',
      exploreCollection: 'View Accounts',
      meetBrand: 'About Us',
      editorialTag: 'Real Demo',
      editorialTitle: 'See how Kling AI works in action.',
      editorialText: 'Kling AI helps you create professional virtual try-on images and creative videos in just seconds. This powerful AI tool is being used by millions to create content, design products and marketing.',
      lookFeel: 'Core Values',
      lookFeelTitle: 'Trust & Quality.',
      lookFeelText: 'Each account is thoroughly checked, guaranteed stable operation and 1-to-1 warranty.',
      clearerJourney: 'Fast Transaction',
      clearerJourneyText: 'Receive account immediately after payment, 24/7 support via Zalo.',
      firstImpression: 'Best Price',
      firstImpressionText: 'Committed to the cheapest market price with top-notch service quality.',
      hotTrendingBadge: 'HOT TRENDING - HOT TRENDING - ',
      tramPremiumBadge: 'TRAM PREMIUM - TRAM PREMIUM - ',
      aiDemoBadge: 'FEATURES - AI DEMO - ',
      demoColorTitle: '🎨 Demo: Automatic Color Change',
      demoInputShirt: '👕 Input: White Shirt',
      demoOriginalImg: 'Original image',
      demoOutputRed: '📤 Output: Red Shirt',
      demoAutoColor: 'AI auto color change',
      demoOutputBlue: '📤 Output: Blue Shirt',
      demoInSeconds: 'In just a few seconds',
      klingDemoTitle: '🎨 Kling AI - Images & Video',
      klingDemoDesc: 'Create professional virtual try-ons and AI videos in seconds.',
      geminiDemoTitle: '🤖 Gemini Pro - AI Chatbot',
      geminiDemoDesc: 'Smart AI to answer questions, write content and solve problems.',
      feature1Title: '✨ Change Colors',
      feature1Desc: 'Automatically change shirt and accessory colors with AI.',
      feature2Title: '🎬 Image to Video',
      feature2Desc: 'Turn static images into naturally lively videos.',
      feature3Title: '💬 Smart AI Chat',
      feature3Desc: 'AI assistant to help you write, analyze and create.',
      videoNotSupported: 'Your browser does not support the video tag.',
    };
  }, [language]);

  return (
    <div className="space-y-1 lg:space-y-6">
      <Hero />
      {/* <BannerSlider /> */}

      <div className="relative mx-auto max-w-7xl">
        <BestSeller />
      </div>

      <NewsletterBox featured />

      <div className="relative mx-auto max-w-7xl">
        <LatestCollection />
      </div>



      <div className="relative mx-auto max-w-7xl">
        {/* Absolute Badge for AI Demo */}
        <RotatingBadge text={copy.aiDemoBadge} icon="🚀" className="absolute top-12 left-0 lg:-left-8 z-20 scale-100 lg:scale-110 hidden xl:flex pointer-events-none" />

        <section className="section-shell relative overflow-hidden px-2 py-3 md:px-6 lg:py-8 mx-2 md:mx-0">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(255,241,214,0.85),transparent_70%)]" />

        <div className="relative">
          <p className="text-[9px] md:text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {copy.editorialTag}
          </p>
          <h2 className="display-font mt-1.5 md:mt-3 max-w-xl text-lg md:text-3xl font-semibold tracking-[-0.05em] text-slate-900">
            {copy.editorialTitle}
          </h2>

          <p className="mt-1.5 md:mt-4 max-w-2xl text-[10px] md:text-sm leading-5 md:leading-7 text-slate-500">
            {copy.editorialText}
          </p>

          <div className="mt-4 md:mt-6">
            {/* Before & After Image Demo */}
            <div className="mb-4 md:mb-6">
              <h3 className="mb-2 md:mb-3 text-[11px] md:text-lg font-bold text-slate-900">{copy.demoColorTitle}</h3>
              <div className="grid gap-1 md:gap-2 grid-cols-3 px-2 md:px-0">
                {/* Before - White Shirt */}
                <div className="overflow-hidden rounded-[8px] md:rounded-[16px] border border-slate-200 bg-white shadow-sm md:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                  <img src={assets.ai_demo_input} alt="Áo trắng gốc" className="w-full h-auto" />
                  <div className="p-1 md:p-3 bg-slate-50">
                    <p className="text-[7px] md:text-xs font-bold text-slate-700 leading-tight">{copy.demoInputShirt}</p>
                    <p className="text-[6px] md:text-[10px] text-slate-500 mt-0.5 leading-tight">{copy.demoOriginalImg}</p>
                  </div>
                </div>

                {/* After 1 - Red Shirt */}
                <div className="overflow-hidden rounded-[8px] md:rounded-[16px] border border-rose-200 bg-white shadow-sm md:shadow-[0_12px_24px_rgba(244,63,94,0.15)]">
                  <img src={assets.ai_demo_output_red} alt="Áo đỏ" className="w-full h-auto" />
                  <div className="p-1 md:p-3 bg-rose-50">
                    <p className="text-[7px] md:text-xs font-bold text-rose-700 leading-tight">{copy.demoOutputRed}</p>
                    <p className="text-[6px] md:text-[10px] text-rose-600 mt-0.5 leading-tight">{copy.demoAutoColor}</p>
                  </div>
                </div>

                {/* After 2 - Blue Shirt */}
                <div className="overflow-hidden rounded-[8px] md:rounded-[16px] border border-blue-200 bg-white shadow-sm md:shadow-[0_12px_24px_rgba(59,130,246,0.15)]">
                  <img src="/kling_after2.png" alt="Áo xanh" className="w-full h-auto" />
                  <div className="p-1 md:p-3 bg-blue-50">
                    <p className="text-[7px] md:text-xs font-bold text-blue-700 leading-tight">{copy.demoOutputBlue}</p>
                    <p className="text-[6px] md:text-[10px] text-blue-600 mt-0.5 leading-tight">{copy.demoInSeconds}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Demos */}
            <div className="grid gap-2 md:gap-3 grid-cols-2 px-4 md:px-0">
              {/* Kling AI Demo */}
              <div>
                <h3 className="mb-1 md:mb-2 text-[10px] md:text-base font-bold text-slate-900">{copy.klingDemoTitle}</h3>
                <div className="overflow-hidden rounded-[8px] md:rounded-[16px] border border-white/70 bg-white/70 shadow-sm md:shadow-[0_16px_32px_rgba(15,23,42,0.1)]">
                  <video 
                    className="w-full h-auto"
                    controls
                    poster="/kling_poster.png"
                    preload="metadata"
                  >
                    <source src="/kling_demo.mp4" type="video/mp4" />
                    {copy.videoNotSupported}
                  </video>
                </div>
                <p className="mt-1 md:mt-2 text-[7px] md:text-xs text-slate-600">{copy.klingDemoDesc}</p>
              </div>

              {/* Gemini Pro Demo */}
              <div>
                <h3 className="mb-1 md:mb-2 text-[10px] md:text-base font-bold text-slate-900">{copy.geminiDemoTitle}</h3>
                <div className="overflow-hidden rounded-[8px] md:rounded-[16px] border border-white/70 bg-white/70 shadow-sm md:shadow-[0_16px_32px_rgba(15,23,42,0.1)]">
                  <video 
                    className="w-full h-auto"
                    controls
                    preload="metadata"
                  >
                    <source src="/gemini_demo.mp4" type="video/mp4" />
                    {copy.videoNotSupported}
                  </video>
                </div>
                <p className="mt-1 md:mt-2 text-[7px] md:text-xs text-slate-600">{copy.geminiDemoDesc}</p>
              </div>
            </div>
            
            <div className="mt-3 md:mt-5 grid gap-2 grid-cols-3">
              <div className="rounded-[8px] md:rounded-[16px] border border-[#f5d9b4] bg-[#fffaf2] p-1.5 md:p-4">
                <h3 className="text-[9px] md:text-sm font-bold text-slate-900 leading-tight">{copy.feature1Title}</h3>
                <p className="mt-0.5 md:mt-1 text-[7px] md:text-xs text-slate-600 leading-tight">{copy.feature1Desc}</p>
              </div>
              
              <div className="rounded-[8px] md:rounded-[16px] border border-[#dbeafe] bg-[#eff6ff] p-1.5 md:p-4">
                <h3 className="text-[9px] md:text-sm font-bold text-slate-900 leading-tight">{copy.feature2Title}</h3>
                <p className="mt-0.5 md:mt-1 text-[7px] md:text-xs text-slate-600 leading-tight">{copy.feature2Desc}</p>
              </div>

              <div className="rounded-[8px] md:rounded-[16px] border border-[#f0fdf4] bg-[#f0fdf4] p-1.5 md:p-4">
                <h3 className="text-[9px] md:text-sm font-bold text-slate-900 leading-tight">{copy.feature3Title}</h3>
                <p className="mt-0.5 md:mt-1 text-[7px] md:text-xs text-slate-600 leading-tight">{copy.feature3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
