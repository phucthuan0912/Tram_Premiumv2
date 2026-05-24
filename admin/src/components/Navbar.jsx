import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdminLocale } from '../lib/adminLocale'

const Navbar = ({ setToken }) => {
  const navigate = useNavigate()
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const { locale, setLocale, t } = useAdminLocale()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleDark = () => {
    setDark((prev) => !prev)
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/', { replace: true })
  }

  return (
    <nav className='sticky top-0 z-40 px-3 py-3 md:px-4 xl:px-5'>
      <div
        className='flex items-center justify-between gap-3 rounded-[24px] border px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-2xl transition-colors duration-300 md:px-5'
        style={{
          borderColor: 'var(--admin-border)',
          background: 'var(--admin-glass)',
        }}
      >
        <div className='flex items-center gap-4'>
          <img src={logo} alt='logo' className='w-[min(190px,18vw)] min-w-[132px]' />
          <div className='hidden xl:block'>
            <p className='text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--admin-tertiary)]'>{t('navbar.panel')}</p>
            <p className='mt-1 text-xs text-[var(--admin-muted)]'>{t('navbar.workspace')}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <div
            className='flex items-center rounded-[18px] border p-1 shadow-[0_8px_20px_rgba(15,23,42,0.05)]'
            style={{
              borderColor: 'var(--admin-border)',
              background: 'var(--admin-surface-solid)',
            }}
          >
            {[
              { code: 'vi', label: 'VI' },
              { code: 'en', label: 'EN' },
            ].map(({ code, label }) => {
              const active = locale === code

              return (
                <button
                  key={code}
                  type='button'
                  onClick={() => setLocale(code)}
                  className='rounded-[14px] px-3 py-2 text-xs font-semibold tracking-[0.12em] transition'
                  style={{
                    background: active ? 'var(--admin-accent)' : 'transparent',
                    color: active ? 'var(--admin-primary-text)' : 'var(--admin-muted)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <button
            onClick={toggleDark}
            title={dark ? t('navbar.light') : t('navbar.dark')}
            className='group flex items-center gap-2 rounded-[18px] border px-3 py-2 text-sm font-medium shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-0.5'
            style={{
              borderColor: 'var(--admin-border)',
              background: 'var(--admin-surface-solid)',
              color: 'var(--admin-muted)',
            }}
          >
            <span
              className='flex h-8 w-8 items-center justify-center rounded-[14px]'
              style={{
                background: dark ? 'rgba(241, 215, 165, 0.16)' : 'rgba(42, 35, 29, 0.08)',
                color: dark ? 'var(--admin-accent)' : 'var(--admin-accent)',
              }}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            <span className='hidden sm:block'>{dark ? t('navbar.light') : t('navbar.dark')}</span>
          </button>

          <button
            onClick={handleLogout}
            className='flex items-center gap-2 rounded-[18px] px-4 py-2 text-sm font-semibold shadow-[0_16px_34px_rgba(31,26,23,0.16)] transition duration-200 hover:-translate-y-0.5 active:scale-[0.99]'
            style={
              dark
                ? {
                    background: 'linear-gradient(135deg, #f2dfba 0%, #d8b57a 100%)',
                    color: '#181410',
                  }
                : {
                    background: 'linear-gradient(135deg, #241d18 0%, #40342c 100%)',
                    color: '#ffffff',
                  }
            }
            >
              <span
              className='flex h-7 w-7 items-center justify-center rounded-[12px]'
              style={{
                background: dark ? 'rgba(24, 20, 16, 0.08)' : 'rgba(255, 255, 255, 0.12)',
              }}
            >
              <LogOut size={15} />
            </span>
            <span>{t('navbar.logout')}</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
