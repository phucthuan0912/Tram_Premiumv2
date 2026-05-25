import React, { useContext, useEffect, useMemo, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { useLanguage } from '../context/LanguageContext';

const copyByLanguage = {
    vi: {
        home: 'Trang chủ',
        collection: 'Bộ sưu tập',
        about: 'Giới thiệu',
        contact: 'Liên hệ',
        account: 'Tài khoản',
        myAccount: 'Tài khoản của tôi',
        myWallet: 'Ví của tôi',
        orders: 'Đơn hàng',
        logout: 'Đăng xuất',
        login: 'Đăng nhập',
        toggleSearch: 'Mở tìm kiếm',
        cart: 'Giỏ hàng',
        openMenu: 'Mở menu',
        closeMenu: 'Đóng menu',
        language: 'Ngôn ngữ',
    },
    en: {
        home: 'Home',
        collection: 'Collection',
        about: 'About',
        contact: 'Contact',
        account: 'Account',
        myAccount: 'My Account',
        myWallet: 'My Wallet',
        orders: 'Orders',
        logout: 'Logout',
        login: 'Login',
        toggleSearch: 'Toggle search',
        cart: 'Cart',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        language: 'Language',
    },
};

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const {
        getCartCount,
        setShowSearch,
        showSearch,
        token,
        logout,
        navigate,
    } = useContext(ShopContext);
    const { language, setLanguage, isVietnamese } = useLanguage();

    const cartCount = getCartCount();
    const hideCartBadge = location.pathname === '/login';
    const copy = copyByLanguage[language];

    const navItems = useMemo(
        () => [
            { label: copy.home, path: '/' },
            { label: copy.collection, path: '/collection' },
            { label: copy.about, path: '/about' },
            { label: copy.contact, path: '/contact' },
        ],
        [copy],
    );

    useEffect(() => {
        setVisible(false);
    }, [location.pathname]);

    const navLinkClass = ({ isActive }) =>
        `rounded-full px-2 py-1 md:px-3 md:py-1.5 text-[9px] md:text-xs lg:text-sm font-semibold tracking-[0.12em] transition-all duration-300 ${
            isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white'
        }`;

    const roundActionClass =
        'rounded-full border border-[var(--border)] bg-white/90 p-1.5 md:p-2 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950';

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50">
                <div className="page-shell pt-1.5 md:pt-2">
                    <div className="section-shell flex items-center justify-between px-2 py-1.5 md:px-4 md:py-2 lg:px-6">
                        <NavLink to="/" className="flex items-center gap-2 md:gap-3">
                            <img src={assets.logo} className="w-16 md:w-24 lg:w-28 rounded-md lg:rounded-lg" alt="Logo" />
                        </NavLink>

                        <nav className="hidden items-center gap-1 md:flex">
                            {navItems.map((item) => (
                                <NavLink key={item.path} to={item.path} className={navLinkClass}>
                                    {item.label.toUpperCase()}
                                </NavLink>
                            ))}
                        </nav>

                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="hidden items-center rounded-full border border-[var(--border)] bg-white/90 p-0.5 shadow-sm md:flex">
                                <button
                                    type="button"
                                    onClick={() => setLanguage('vi')}
                                    className={`rounded-full px-2 py-1 md:px-2.5 md:py-1.5 text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                        isVietnamese ? 'bg-slate-900 text-white' : 'text-slate-500'
                                    }`}
                                    aria-label="Switch to Vietnamese"
                                >
                                    VI
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLanguage('en')}
                                    className={`rounded-full px-2 py-1 md:px-2.5 md:py-1.5 text-[8px] md:text-[10px] font-semibold uppercase tracking-[0.16em] ${
                                        !isVietnamese ? 'bg-slate-900 text-white' : 'text-slate-500'
                                    }`}
                                    aria-label="Switch to English"
                                >
                                    EN
                                </button>
                            </div>

                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className={roundActionClass}
                                type="button"
                                aria-label={copy.toggleSearch}
                            >
                                <Search className="h-3 w-3 md:h-4 md:w-4" strokeWidth={2.1} />
                            </button>

                            <div className="group relative hidden sm:block">
                                {token ? (
                                    <button
                                        type="button"
                                        className={roundActionClass}
                                        aria-label={copy.account}
                                    >
                                        <User className="h-3 w-3 md:h-[18px] md:w-[18px]" strokeWidth={2.1} />
                                    </button>
                                ) : (
                                    <Link to="/login" className={roundActionClass} aria-label={copy.login}>
                                        <User className="h-3 w-3 md:h-4 md:w-4" strokeWidth={2.1} />
                                    </Link>
                                )}

                                {token && (
                                    <div className="pointer-events-none absolute right-0 top-full hidden pt-2 md:pt-4 group-hover:block group-hover:pointer-events-auto">
                                        <div className="section-shell min-w-[140px] md:min-w-[180px] rounded-[16px] md:rounded-[22px] p-1.5 md:p-2">
                                            <button
                                                onClick={() => navigate('/my-account')}
                                                className="w-full rounded-[10px] md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-left text-[10px] md:text-sm font-medium text-slate-600 hover:bg-slate-900 hover:text-white"
                                                type="button"
                                            >
                                                {copy.myAccount}
                                            </button>
                                            <button
                                                onClick={() => navigate('/my-wallet')}
                                                className="w-full rounded-[10px] md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-left text-[10px] md:text-sm font-medium text-slate-600 hover:bg-slate-900 hover:text-white"
                                                type="button"
                                            >
                                                {copy.myWallet}
                                            </button>
                                            <button
                                                onClick={() => navigate('/orders')}
                                                className="w-full rounded-[10px] md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-left text-[10px] md:text-sm font-medium text-slate-600 hover:bg-slate-900 hover:text-white"
                                                type="button"
                                            >
                                                {copy.orders}
                                            </button>
                                            <button
                                                onClick={logout}
                                                className="w-full rounded-[10px] md:rounded-2xl px-3 py-2 md:px-4 md:py-3 text-left text-[10px] md:text-sm font-medium text-slate-600 hover:bg-slate-900 hover:text-white"
                                                type="button"
                                            >
                                                {copy.logout}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/cart"
                                data-cart-target="true"
                                className={`relative ${roundActionClass}`}
                                aria-label={copy.cart}
                            >
                                <ShoppingBag className="h-3 w-3 min-w-3 md:h-4 md:w-4 md:min-w-4" strokeWidth={2.1} />
                                {!hideCartBadge && cartCount > 0 && (
                                    <p className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-slate-900 px-1 text-[8px] md:h-4 md:min-w-4 md:text-[9px] font-semibold text-white">
                                        {cartCount}
                                    </p>
                                )}
                            </Link>

                            <button
                                onClick={() => setVisible(true)}
                                className={`${roundActionClass} md:hidden`}
                                type="button"
                                aria-label={copy.openMenu}
                            >
                                <Menu className="h-3.5 w-3.5" strokeWidth={2.1} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div
                className={`fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
                    visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                }`}
                onClick={() => setVisible(false)}
            />

            <aside
                className={`fixed right-0 top-0 z-50 h-screen w-[55vw] min-w-[180px] max-w-[220px] p-2 transition-transform duration-300 md:hidden ${
                    visible ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="section-shell flex h-full flex-col rounded-[12px] p-3">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <img src={assets.logo} className="w-20 rounded-md" alt="Logo" />
                        <button
                            onClick={() => setVisible(false)}
                            className="rounded-full border border-[var(--border)] p-1.5"
                            type="button"
                            aria-label={copy.closeMenu}
                        >
                            <X className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </button>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            {copy.language}
                        </span>
                        <button
                            type="button"
                            onClick={() => setLanguage('vi')}
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                                isVietnamese ? 'bg-slate-900 text-white' : 'border border-[var(--border)] text-slate-500'
                            }`}
                        >
                            VI
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${
                                !isVietnamese ? 'bg-slate-900 text-white' : 'border border-[var(--border)] text-slate-500'
                            }`}
                        >
                            EN
                        </button>
                    </div>

                    <nav className="mt-4 flex flex-1 flex-col gap-1.5">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                onClick={() => setVisible(false)}
                                to={item.path}
                                className={({ isActive }) =>
                                    `rounded-[10px] px-2.5 py-2 text-[10px] font-semibold tracking-[0.05em] ${
                                        isActive
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-white text-slate-600 hover:bg-slate-900 hover:text-white'
                                    }`
                                }
                            >
                                {item.label.toUpperCase()}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="space-y-1 border-t border-[var(--border)] pt-2 mt-auto">
                        {token ? (
                            <>
                                <button
                                    onClick={() => {
                                        navigate('/my-account');
                                        setVisible(false);
                                    }}
                                    className="w-full rounded-[10px] border border-[var(--border)] px-2.5 py-2 text-left text-[10px] font-semibold text-slate-600"
                                    type="button"
                                >
                                    {copy.myAccount.toUpperCase()}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/my-wallet');
                                        setVisible(false);
                                    }}
                                    className="w-full rounded-[10px] border border-[var(--border)] px-2.5 py-2 text-left text-[10px] font-semibold text-slate-600"
                                    type="button"
                                >
                                    {copy.myWallet.toUpperCase()}
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/orders');
                                        setVisible(false);
                                    }}
                                    className="w-full rounded-[10px] border border-[var(--border)] px-2.5 py-2 text-left text-[10px] font-semibold text-slate-600"
                                    type="button"
                                >
                                    {copy.orders.toUpperCase()}
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setVisible(false);
                                    }}
                                    className="w-full rounded-[10px] bg-slate-900 px-2.5 py-2 text-left text-[10px] font-semibold text-white"
                                    type="button"
                                >
                                    {copy.logout.toUpperCase()}
                                </button>
                            </>
                        ) : (
                            <Link
                                onClick={() => setVisible(false)}
                                className="block rounded-[10px] bg-slate-900 px-2.5 py-2 text-left text-[10px] font-semibold tracking-[0.05em] text-white"
                                to="/login"
                            >
                                {copy.login.toUpperCase()}
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Navbar;
