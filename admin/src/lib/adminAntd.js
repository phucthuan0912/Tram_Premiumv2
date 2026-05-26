export const adminAntdTheme = {
  token: {
    colorPrimary: '#ec4899',
    colorInfo: '#ec4899',
    borderRadius: 14,
    colorBorderSecondary: '#f1f5f9',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  },
  components: {
    Card: {
      bodyPadding: 8,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      headerBorderRadius: 10,
      rowHoverBg: '#fbfdff',
      borderColor: '#f1f5f9',
      cellPaddingBlock: 4,
      cellPaddingInline: 6,
      cellFontSize: 11,
    },
    Modal: {
      borderRadiusLG: 14,
    },
    Input: {
      paddingBlock: 4,
      fontSize: 12,
    },
    InputNumber: {
      controlHeightLG: 32,
    },
    Select: {
      controlHeightLG: 32,
      optionHeight: 28,
    },
    Button: {
      controlHeightLG: 32,
    },
    Segmented: {
      trackPadding: 2,
    },
  },
}

export const pageShellClass = 'w-full px-2 py-2 md:px-4 xl:px-5'
export const pageStickyHeaderClass = 'sticky top-0 z-10 bg-white py-2 md:py-3 -mx-2 md:-mx-4 xl:-mx-5 px-2 md:px-4 xl:px-5 border-b border-slate-100 shadow-sm'
export const compactStatsRowClass = 'mb-2 md:mb-4 flex flex-wrap gap-2 md:gap-3 lg:flex-nowrap'
export const compactStatCardClass = 'min-h-[72px] min-w-[150px] md:min-w-[220px] flex-1 shadow-sm'
export const sectionGridGapClass = 'grid gap-4'

export const getSelectPopupContainer = (triggerNode) => triggerNode?.parentElement || document.body

export const compactTableProps = {
  size: 'small',
  pagination: { pageSize: 6, showSizeChanger: false, size: 'small' },
}

export const nativeSelectClass =
  'h-8 md:h-9 w-full rounded-[10px] md:rounded-xl border border-slate-200 bg-white px-2 md:px-3 text-[11px] md:text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-50'
