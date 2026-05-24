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
      bodyPadding: 14,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      headerBorderRadius: 12,
      rowHoverBg: '#fbfdff',
      borderColor: '#f1f5f9',
      cellPaddingBlock: 8,
      cellPaddingInline: 10,
      cellFontSize: 12,
    },
    Modal: {
      borderRadiusLG: 18,
    },
    Input: {
      paddingBlock: 7,
    },
    InputNumber: {
      controlHeightLG: 38,
    },
    Select: {
      controlHeightLG: 38,
      optionHeight: 34,
    },
    Button: {
      controlHeightLG: 38,
    },
    Segmented: {
      trackPadding: 3,
    },
  },
}

export const pageShellClass = 'w-full px-3 py-4 md:px-4 xl:px-5'
export const compactStatsRowClass = 'mb-4 flex flex-wrap gap-3 lg:flex-nowrap'
export const compactStatCardClass = 'min-h-[92px] min-w-[220px] flex-1 shadow-sm'
export const sectionGridGapClass = 'grid gap-4'

export const getSelectPopupContainer = (triggerNode) => triggerNode?.parentElement || document.body

export const compactTableProps = {
  size: 'middle',
  pagination: { pageSize: 6, showSizeChanger: false, size: 'small' },
}

export const nativeSelectClass =
  'h-9 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-50'
