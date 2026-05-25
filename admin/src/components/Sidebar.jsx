import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'
import { Link, useLocation } from 'react-router-dom'
import { PlusCircle, List, Package, LayoutDashboard, Users, Ticket, Layers, History, ListTree, Image, MessageSquare, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminLocale } from '../lib/adminLocale'

const ALL_NAV_ITEMS = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, labelKey: 'dashboard', roles: ['Admin'], group: 'CORE' },
  { to: '/employees', icon: <Users size={18} />, labelKey: 'employees', roles: ['Admin'], group: 'CORE' },
  { to: '/customers', icon: <Users size={18} />, labelKey: 'customers', roles: ['Admin'], group: 'CORE' },

  { to: '/categories', icon: <Layers size={18} />, labelKey: 'categories', roles: ['Admin', 'Employee'], group: 'CATALOG' },
  { to: '/sub-categories', icon: <ListTree size={18} />, labelKey: 'subCategories', roles: ['Admin', 'Employee'], group: 'CATALOG' },
  { to: '/add', icon: <PlusCircle size={18} />, labelKey: 'add', roles: ['Admin', 'Employee'], group: 'CATALOG' },
  { to: '/list', icon: <List size={18} />, labelKey: 'list', roles: ['Admin', 'Employee'], group: 'CATALOG' },
  { to: '/banners', icon: <Image size={18} />, labelKey: 'banners', roles: ['Admin', 'Employee'], group: 'CATALOG' },
  { to: '/reviews', icon: <MessageSquare size={18} />, labelKey: 'reviews', roles: ['Admin', 'Employee'], group: 'CATALOG' },

  { to: '/import-batch', icon: <Package size={18} />, labelKey: 'importBatch', roles: ['Admin', 'Employee'], group: 'COMMERCE' },
  { to: '/bulk-operation', icon: <Zap size={18} />, labelKey: 'bulkOperation', roles: ['Admin'], group: 'COMMERCE' },
  { to: '/vouchers', icon: <Ticket size={18} />, labelKey: 'vouchers', roles: ['Admin'], group: 'COMMERCE' },
  { to: '/orders', icon: <Package size={18} />, labelKey: 'orders', roles: ['Admin', 'Employee'], group: 'COMMERCE' },
  { to: '/returns', icon: <History size={18} />, labelKey: 'returns', roles: ['Admin', 'Employee'], group: 'COMMERCE' },
  { to: '/audit-logs', icon: <History size={18} />, labelKey: 'auditLogs', roles: ['Admin'], group: 'COMMERCE' },
]

const NAV_GROUPS = ['CORE', 'CATALOG', 'COMMERCE']

const SidebarComponent = () => {
  const location = useLocation()
  const { t } = useAdminLocale()
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) {
      return saved === 'true'
    }
    return window.innerWidth < 768
  })

  useEffect(() => {
    const handleResize = () => {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved === null) {
        setCollapsed(window.innerWidth < 768)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }
  
  let role = 'Admin';
  try {
     const token = localStorage.getItem('token');
     if (token) {
         const payload = JSON.parse(atob(token.split('.')[1]));
         if (payload.role) role = payload.role;
     }
  } catch(e) { }

  const navItems = ALL_NAV_ITEMS.filter(item => item.roles.includes(role));

  const isItemActive = (to) => {
    if (to === '/add') {
      return ['/add', '/add-item', '/add-items'].includes(location.pathname)
    }
    return location.pathname === to
  }

  return (
    <Sidebar
      collapsed={collapsed}
      width="220px"
      collapsedWidth="56px"
      rootStyles={{
        height: '100%',
        minHeight: '100%',
        borderRight: '1px solid var(--admin-border)',
        background: 'transparent',
      }}
    >
      <div className={`flex items-center py-2 px-3 ${collapsed ? 'justify-center' : 'justify-between'} border-b border-[var(--admin-border)]/40 mb-2`}>
        {!collapsed && (
          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider pl-2">Navigation</span>
        )}
        <button
          onClick={toggleCollapsed}
          className='flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm'
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className='py-2'>
        {NAV_GROUPS.map((group) => {
          const items = navItems.filter((item) => item.group === group)
          if (!items.length) return null

          return (
            <div key={group} className='mb-3'>
              {!collapsed && (
                <div className='px-3 md:px-5 pb-1 text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.2em] md:tracking-[0.22em] text-[var(--admin-tertiary)]/80'>
                  {t(`sidebar.groups.${group}`, group)}
                </div>
              )}
              <Menu
                menuItemStyles={{
                  button: ({ active }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '8px md:10px',
                    padding: collapsed ? '8px' : '6px 10px md:9px 14px',
                    margin: collapsed ? '4px 8px' : '2px 6px md:4px 10px',
                    borderRadius: collapsed ? '10px' : '10px md:14px',
                    fontSize: '11px md:13px',
                    fontWeight: active ? '600' : '500',
                    color: active ? 'var(--admin-text)' : 'var(--admin-muted)',
                    background: active ? 'var(--admin-surface-soft)' : 'transparent',
                    border: active ? '1px solid var(--admin-border)' : '1px solid transparent',
                    boxShadow: active ? '0 10px 22px rgba(15, 23, 42, 0.05)' : 'none',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    '&:hover': {
                      backgroundColor: 'var(--admin-surface-soft)',
                      color: 'var(--admin-text)',
                    },
                  }),
                  icon: ({ active }) => ({
                    color: active ? 'var(--admin-tertiary)' : 'var(--admin-muted)',
                    margin: 0,
                  }),
                }}
              >
                {items.map(({ to, icon, labelKey }) => (
                  <MenuItem
                    key={to}
                    icon={icon}
                    component={<Link to={to} />}
                    active={isItemActive(to)}
                  >
                    {t(`sidebar.items.${labelKey}`, labelKey)}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )
        })}
      </div>
    </Sidebar>
  )
}

export default SidebarComponent
