import React, { useState, useCallback, useEffect, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl as defaultBackendUrl } from '../config'
import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  ConfigProvider,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  adminAntdTheme,
  compactStatCardClass,
  compactStatsRowClass,
  getSelectPopupContainer,
  pageShellClass,
} from '../lib/adminAntd'

const { Title, Text } = Typography

const formatVND = (price) => {
  if (price == null || isNaN(price)) return '—'
  return Number(price).toLocaleString('vi-VN') + 'đ'
}

const TEXTAREA_PLACEHOLDER = `Dán dữ liệu sản phẩm vào đây...

Định dạng bảng (tab-separated):
Tên\tMô tả\tDanh mục\tDanh mục con\tGiá sell\tGiá gốc\tThời hạn gói\tBestseller
ChatGPT Plus Mail iCloud\tTài khoản ChatGPT Plus...\tChatGPT\tPlus\t80000\t100000\t1 tháng\tcó

Hoặc dạng danh sách:
ChatGPT Plus Mail iCloud - 80k
Claude Pro Team - 540k`

const CATEGORY_COLORS = {
  ChatGPT: 'green',
  Claude: 'purple',
  Gemini: 'blue',
  Midjourney: 'orange',
  Canva: 'cyan',
  Spotify: 'lime',
  Netflix: 'red',
  YouTube: 'volcano',
  Adobe: 'magenta',
  Microsoft: 'geekblue',
  Apple: 'default',
  Google: 'gold',
}

const getCategoryColor = (category) => {
  if (!category) return 'default'
  return CATEGORY_COLORS[category] || 'default'
}

const BulkOperation = ({ token, backendUrl: backendUrlFromProps }) => {
  // ── Text paste state ──
  const [rawText, setRawText] = useState('')
  const [isParsing, setIsParsing] = useState(false)

  // ── Preview state ──
  const [parsedProducts, setParsedProducts] = useState(null)
  const [parseResponse, setParseResponse] = useState(null)
  const [selectedKeys, setSelectedKeys] = useState([])

  // ── Import state ──
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)

  const apiBaseUrl = useMemo(
    () => (backendUrlFromProps || defaultBackendUrl || '').trim().replace(/\/+$/, ''),
    [backendUrlFromProps],
  )

  // ── Step: Parse text ──
  const handleParse = useCallback(async () => {
    const trimmed = rawText.trim()
    if (!trimmed) {
      toast.error('Vui lòng dán dữ liệu sản phẩm trước khi phân tích')
      return
    }

    try {
      setIsParsing(true)
      setImportResult(null)

      const { data } = await axios.post(
        `${apiBaseUrl}/api/product/parse-text`,
        { text: trimmed },
        { headers: { token } },
      )

      if (data.success) {
        const products = (data.products || []).map((p, idx) => ({ ...p, _rowKey: idx }))
        setParsedProducts(products)
        setParseResponse(data)
        setSelectedKeys(products.map((p) => p._rowKey))
        toast.success(`Phân tích thành công: ${products.length} sản phẩm`)
      } else {
        toast.error(data.message || 'Phân tích thất bại')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi kết nối khi phân tích dữ liệu')
    } finally {
      setIsParsing(false)
    }
  }, [rawText, apiBaseUrl, token])

  // ── Step: Import selected products ──
  const handleImport = useCallback(async () => {
    if (!parsedProducts || selectedKeys.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 sản phẩm để import')
      return
    }

    const selectedProducts = parsedProducts.filter((p) => selectedKeys.includes(p._rowKey))
    // strip internal _rowKey before sending
    const payload = selectedProducts.map(({ _rowKey, ...rest }) => rest)

    try {
      setIsImporting(true)

      const { data } = await axios.post(
        `${apiBaseUrl}/api/product/bulk-import`,
        { products: payload },
        { headers: { token } },
      )

      if (data.success) {
        setImportResult(data)
        toast.success(data.message || 'Import thành công!')
      } else {
        toast.error(data.message || 'Import thất bại')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi kết nối khi import')
    } finally {
      setIsImporting(false)
    }
  }, [parsedProducts, selectedKeys, apiBaseUrl, token])

  // ── Reset ──
  const handleReset = useCallback(() => {
    setRawText('')
    setParsedProducts(null)
    setParseResponse(null)
    setSelectedKeys([])
    setImportResult(null)
  }, [])

  const handleCancelPreview = useCallback(() => {
    setParsedProducts(null)
    setParseResponse(null)
    setSelectedKeys([])
  }, [])

  // ── Table columns ──
  const columns = useMemo(
    () => [
      {
        title: '#',
        dataIndex: '_rowKey',
        width: 44,
        render: (_, __, idx) => (
          <Text style={{ fontSize: 11, color: '#94a3b8' }}>{idx + 1}</Text>
        ),
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        ellipsis: true,
        width: 220,
        render: (text) => (
          <Text strong style={{ fontSize: 12, color: '#0f172a' }}>
            {text}
          </Text>
        ),
      },
      {
        title: 'Danh mục',
        dataIndex: 'category',
        width: 120,
        render: (cat) => <Tag color={getCategoryColor(cat)}>{cat || '—'}</Tag>,
      },
      {
        title: 'Danh mục con',
        dataIndex: 'subCategory',
        width: 120,
        render: (sub) => (sub ? <Tag>{sub}</Tag> : <Text type="secondary">—</Text>),
      },
      {
        title: 'Giá sell',
        dataIndex: 'price',
        width: 100,
        align: 'right',
        render: (val) => (
          <Text strong style={{ fontSize: 12, color: '#059669' }}>
            {formatVND(val)}
          </Text>
        ),
      },
      {
        title: 'Giá gốc',
        dataIndex: 'oldPrice',
        width: 100,
        align: 'right',
        render: (val) => (
          <Text style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through' }}>
            {formatVND(val)}
          </Text>
        ),
      },
      {
        title: 'Thời hạn',
        dataIndex: 'duration',
        width: 90,
        render: (val) => <Text style={{ fontSize: 11 }}>{val || '—'}</Text>,
      },
      {
        title: 'Bestseller',
        dataIndex: 'bestseller',
        width: 80,
        align: 'center',
        render: (val) =>
          val ? (
            <CheckOutlined style={{ color: '#059669', fontSize: 14 }} />
          ) : (
            <CloseOutlined style={{ color: '#cbd5e1', fontSize: 12 }} />
          ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'isUpdate',
        width: 100,
        align: 'center',
        render: (isUpdate) =>
          isUpdate ? (
            <Tag icon={<EditOutlined />} color="blue">
              Cập nhật
            </Tag>
          ) : (
            <Tag icon={<PlusCircleOutlined />} color="green">
              Mới
            </Tag>
          ),
      },
    ],
    [],
  )

  // ── Selection ──
  const rowSelection = useMemo(
    () => ({
      selectedRowKeys: selectedKeys,
      onChange: (keys) => setSelectedKeys(keys),
      getCheckboxProps: () => ({ disabled: !!importResult }),
    }),
    [selectedKeys, importResult],
  )

  // ── Preview stats ──
  const previewStats = useMemo(() => {
    if (!parseResponse) return null
    const summary = parseResponse.summary || {}
    return [
      {
        key: 'total',
        title: 'Tổng sản phẩm',
        value: summary.total || 0,
        icon: <FileTextOutlined style={{ color: '#6366f1' }} />,
      },
      {
        key: 'new',
        title: 'Sản phẩm mới',
        value: summary.newProducts || 0,
        icon: <PlusCircleOutlined style={{ color: '#16a34a' }} />,
      },
      {
        key: 'update',
        title: 'Cập nhật',
        value: summary.existingProducts || 0,
        icon: <EditOutlined style={{ color: '#2563eb' }} />,
      },
      {
        key: 'categories',
        title: 'Danh mục mới',
        value: (parseResponse.newCategories || []).length,
        icon: <AppstoreOutlined style={{ color: '#ec4899' }} />,
      },
      {
        key: 'subcategories',
        title: 'Danh mục con mới',
        value: (parseResponse.newSubCategories || []).length,
        icon: <AppstoreOutlined style={{ color: '#f97316' }} />,
      },
    ]
  }, [parseResponse])

  // ── Header stats (before parse) ──
  const headerStats = useMemo(
    () => [
      {
        key: 'mode',
        title: 'Chế độ',
        value: 'Text Paste',
        icon: <FileTextOutlined style={{ color: '#6366f1' }} />,
      },
      {
        key: 'lines',
        title: 'Số dòng',
        value: rawText.trim() ? rawText.trim().split('\n').length : 0,
        icon: <FileTextOutlined style={{ color: '#ec4899' }} />,
      },
      {
        key: 'parsed',
        title: 'Đã phân tích',
        value: parsedProducts ? parsedProducts.length : 0,
        icon: <ThunderboltOutlined style={{ color: '#16a34a' }} />,
      },
      {
        key: 'selected',
        title: 'Đã chọn',
        value: selectedKeys.length,
        icon: <CheckCircleOutlined style={{ color: '#f97316' }} />,
      },
    ],
    [rawText, parsedProducts, selectedKeys.length],
  )

  return (
    <ConfigProvider theme={adminAntdTheme} getPopupContainer={getSelectPopupContainer}>
      <div className={pageShellClass}>
        {/* ── Header ── */}
        <div className="mb-3 md:mb-6">
          <Title level={4} style={{ margin: 0, color: '#0f172a', fontSize: '18px' }}>
            Smart Import
          </Title>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            Dán dữ liệu sản phẩm dạng bảng hoặc danh sách, xem trước và xác nhận import hàng loạt.
          </Text>
        </div>

        {/* ── Top stats row ── */}
        <div className={compactStatsRowClass}>
          {headerStats.map((item) => (
            <Card key={item.key} className={compactStatCardClass}>
              <Statistic
                title={item.title}
                value={item.value}
                prefix={item.icon}
                
              />
            </Card>
          ))}
        </div>

        {/* ── Import Result ── */}
        {importResult && (
          <Card
            className="mb-4 shadow-sm"
            title={
              <Space size={10}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
                  <CheckCircleOutlined />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Kết quả Import</div>
                  <div className="text-xs font-normal text-slate-400">
                    Quá trình import đã hoàn tất
                  </div>
                </div>
              </Space>
            }
          >
            <Alert
              type="success"
              showIcon
              message={importResult.message || 'Import thành công!'}
              style={{ marginBottom: 16 }}
            />

            {importResult.details && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                <Card bordered className="text-center shadow-none">
                  <Statistic
                    title="Tạo mới"
                    value={importResult.details.createdProducts || 0}
                    
                    prefix={<PlusCircleOutlined />}
                  />
                </Card>
                <Card bordered className="text-center shadow-none">
                  <Statistic
                    title="Cập nhật"
                    value={importResult.details.updatedProducts || 0}
                    
                    prefix={<EditOutlined />}
                  />
                </Card>
                <Card bordered className="text-center shadow-none">
                  <Statistic
                    title="Danh mục tạo"
                    value={importResult.details.createdCategories || 0}
                    
                    prefix={<AppstoreOutlined />}
                  />
                </Card>
                <Card bordered className="text-center shadow-none">
                  <Statistic
                    title="DM con tạo"
                    value={importResult.details.createdSubCategories || 0}
                    
                    prefix={<AppstoreOutlined />}
                  />
                </Card>
                <Card bordered className="text-center shadow-none">
                  <Statistic
                    title="Thất bại"
                    value={importResult.details.failedProducts || 0}
                    
                    prefix={
                      importResult.details.failedProducts > 0 ? (
                        <ExclamationCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    }
                  />
                </Card>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleReset}
                size="middle"
              >
                Import thêm
              </Button>
            </div>
          </Card>
        )}

        {/* ── Textarea section ── */}
        {!importResult && (
          <Card
            className="mb-4 shadow-sm"
            title={
              <Space size={10}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <FileTextOutlined />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Dán dữ liệu sản phẩm</div>
                  <div className="text-xs font-normal text-slate-400">
                    Hỗ trợ bảng tab-separated hoặc danh sách text thô từ Telegram
                  </div>
                </div>
              </Space>
            }
          >
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={TEXTAREA_PLACEHOLDER}
              rows={12}
              disabled={!!parsedProducts}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
              style={{ minHeight: 180, maxHeight: 400, lineHeight: '1.6' }}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <Text type="secondary" style={{ fontSize: 11 }}>
                💡 Hỗ trợ: bảng copy từ Excel/Google Sheet (tab-separated) hoặc text dạng danh sách
              </Text>

              <Space>
                {parsedProducts && (
                  <Button onClick={handleCancelPreview} size="middle">
                    Nhập lại
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  onClick={handleParse}
                  loading={isParsing}
                  disabled={!rawText.trim() || !!parsedProducts}
                  size="middle"
                >
                  Phân tích dữ liệu
                </Button>
              </Space>
            </div>
          </Card>
        )}

        {/* ── Preview section ── */}
        {parsedProducts && !importResult && (
          <Card
            className="mb-4 shadow-sm"
            title={
              <Space size={10}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <ThunderboltOutlined />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Xem trước dữ liệu</div>
                  <div className="text-xs font-normal text-slate-400">
                    Kiểm tra và chọn sản phẩm cần import · {selectedKeys.length}/
                    {parsedProducts.length} đã chọn
                  </div>
                </div>
              </Space>
            }
          >
            {/* Preview stats */}
            {previewStats && (
              <div className={compactStatsRowClass}>
                {previewStats.map((item) => (
                  <Card key={item.key} className={compactStatCardClass}>
                    <Statistic
                      title={item.title}
                      value={item.value}
                      prefix={item.icon}
                      
                    />
                  </Card>
                ))}
              </div>
            )}

            {/* New categories alert */}
            {parseResponse?.newCategories?.length > 0 && (
              <Alert
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                message="Danh mục mới sẽ được tạo"
                description={
                  <div className="mt-1 flex flex-wrap gap-1">
                    {parseResponse.newCategories.map((cat) => (
                      <Tag key={cat} color="gold">
                        + {cat}
                      </Tag>
                    ))}
                  </div>
                }
                style={{ marginBottom: 12 }}
              />
            )}

            {/* New subcategories alert */}
            {parseResponse?.newSubCategories?.length > 0 && (
              <Alert
                type="info"
                showIcon
                message="Danh mục con mới sẽ được tạo"
                description={
                  <div className="mt-1 flex flex-wrap gap-1">
                    {parseResponse.newSubCategories.map((sub, idx) => (
                      <Tag key={idx} color="blue">
                        + {sub.name}{' '}
                        <span style={{ opacity: 0.6 }}>({sub.category})</span>
                      </Tag>
                    ))}
                  </div>
                }
                style={{ marginBottom: 12 }}
              />
            )}

            {/* Products table */}
            <Table
              rowKey="_rowKey"
              dataSource={parsedProducts}
              columns={columns}
              rowSelection={rowSelection}
              size="small"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                size: 'small',
                showTotal: (total, range) => (
                  <Text style={{ fontSize: 11, color: '#64748b' }}>
                    {range[0]}-{range[1]} / {total} sản phẩm
                  </Text>
                ),
              }}
              scroll={{ x: 900 }}
              style={{ marginBottom: 16 }}
            />

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <Text type="secondary" style={{ fontSize: 11 }}>
                {selectedKeys.length} sản phẩm đã chọn để import
              </Text>

              <Space>
                <Button onClick={handleCancelPreview} size="middle">
                  Huỷ
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<ThunderboltOutlined />}
                  onClick={handleImport}
                  loading={isImporting}
                  disabled={selectedKeys.length === 0}
                  size="middle"
                >
                  Xác nhận Import ({selectedKeys.length})
                </Button>
              </Space>
            </div>
          </Card>
        )}
      </div>
    </ConfigProvider>
  )
}

export default BulkOperation
