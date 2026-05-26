import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl as defaultBackendUrl } from '../config'
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  ShoppingOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Alert,
  Statistic,
  Table,
  Tag,
  Typography,
  Switch,
} from 'antd'
import {
  adminAntdTheme,
  compactStatCardClass,
  compactStatsRowClass,
  getSelectPopupContainer,
  nativeSelectClass,
  pageShellClass,
} from '../lib/adminAntd'

const { Title, Text } = Typography

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`

const formatCurrency = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCurrency = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '');
};

const formatPackageName = (name) => {
  if (!name) return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const normalizeImage = (imageValue) => {
  if (Array.isArray(imageValue)) return imageValue[0] || ''
  return imageValue || ''
}

const ImportBatch = ({ token, backendUrl: backendUrlFromProps }) => {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filterBatchCategory, setFilterBatchCategory] = useState('all')
  const [filterBatchProduct, setFilterBatchProduct] = useState('all')
  const [formData, setFormData] = useState({
    productId: '',
    size: 'Any',
    costPrice: '',
    initialQty: '',
    supplier: '',
    note: '',
  })
  const [adding, setAdding] = useState(false)
  const [editingBatchId, setEditingBatchId] = useState(null)
  const [editFormData, setEditFormData] = useState({
    size: '',
    costPrice: '',
    remainingQty: '',
    supplier: '',
    note: '',
    status: '',
  })
  const [updating, setUpdating] = useState(false)
  const [deletingBatchId, setDeletingBatchId] = useState(null)

  const [createForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const apiBaseUrl = useMemo(
    () => (backendUrlFromProps || defaultBackendUrl || '').trim().replace(/\/+$/, ''),
    [backendUrlFromProps],
  )

  const fetchData = useCallback(async () => {
    if (!apiBaseUrl || !token) return
    try {
      setLoading(true)
      const [batchRes, prodRes, catRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/import-batch/list`, { headers: { token } }),
        axios.get(`${apiBaseUrl}/api/product/list`),
        axios.get(`${apiBaseUrl}/api/category/list`),
      ])
      if (batchRes.data.success) {
        setBatches(batchRes.data.batches)
      }
      if (prodRes.data.success) {
        setProducts(prodRes.data.products)
      }
      if (catRes.data.success) {
        setCategories(catRes.data.categories.filter((cat) => cat.status))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error loading batches')
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl, token])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const resetCreateForm = useCallback(() => {
    const nextState = {
      productId: '',
      size: 'Any',
      costPrice: '',
      initialQty: '',
      supplier: '',
      note: '',
    }
    setFormData(nextState)
    setSelectedCategory('all')
    createForm.resetFields()
  }, [createForm])

  const handleAddBatch = async () => {
    try {
      setAdding(true)
      const { data } = await axios.post(
        `${apiBaseUrl}/api/import-batch/add`,
        {
          ...formData,
          initialQty: Number(formData.initialQty),
          costPrice: Number(parseCurrency(formData.costPrice)),
        },
        { headers: { token } },
      )

      if (data.success) {
        toast.success('Added import batch successfully')
        resetCreateForm()
        fetchData()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Failed to add import batch')
    } finally {
      setAdding(false)
    }
  }

  const handleUpdateBatch = async () => {
    try {
      setUpdating(true)
      const { data } = await axios.put(
        `${apiBaseUrl}/api/import-batch/update`,
        {
          id: editingBatchId,
          ...editFormData,
          remainingQty: Number(editFormData.remainingQty),
          costPrice: Number(parseCurrency(editFormData.costPrice)),
        },
        { headers: { token } },
      )

      if (data.success) {
        toast.success('Batch updated successfully')
        setEditingBatchId(null)
        editForm.resetFields()
        fetchData()
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Failed to update import batch')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteBatch = useCallback(async (batchId) => {
    try {
      setDeletingBatchId(batchId)
      const { data } = await axios.post(
        `${apiBaseUrl}/api/import-batch/delete`,
        { id: batchId },
        { headers: { token } },
      )

      if (data.success) {
        toast.success('Batch deleted successfully')
        if (editingBatchId === batchId) {
          setEditingBatchId(null)
          editForm.resetFields()
        }
        fetchData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete import batch')
    } finally {
      setDeletingBatchId(null)
    }
  }, [apiBaseUrl, editForm, editingBatchId, fetchData, token])

  const getProductName = useCallback(
    (id) => {
      const product = products.find((item) => item._id === id)
      return product ? product.name : 'Hidden / removed product'
    },
    [products],
  )

  const productOptions = useMemo(
    () =>
      products
        .filter((product) => {
          if (selectedCategory === 'all') return true
          return product.category === selectedCategory
        })
        .map((product) => ({
          value: product._id,
          label: product.name,
          searchText: [product.name, product.category, product.subCategory].filter(Boolean).join(' ').toLowerCase(),
          meta: {
            name: product.name,
            category: product.category || '-',
            subCategory: product.subCategory || '',
            price: product.price || 0,
            image: normalizeImage(product.image),
          },
        })),
    [products, selectedCategory],
  )

  const selectedProduct = useMemo(
    () => products.find((product) => product._id === formData.productId) || null,
    [formData.productId, products],
  )
  const selectedProductImage = useMemo(() => normalizeImage(selectedProduct?.image), [selectedProduct])

  const selectedProductSizes = useMemo(() => {
    if (!Array.isArray(selectedProduct?.sizes)) return []
    return selectedProduct.sizes.filter(Boolean).map((size) => String(size).toUpperCase())
  }, [selectedProduct])

  const filteredBatches = useMemo(() => {
    let result = batches

    // Filter by category
    if (filterBatchCategory !== 'all') {
      result = result.filter((batch) => {
        const product = products.find((p) => p._id === batch.productId)
        return product?.category === filterBatchCategory
      })
    }

    // Filter by product
    if (filterBatchProduct !== 'all') {
      result = result.filter((batch) => batch.productId === filterBatchProduct)
    }

    return result
  }, [batches, filterBatchCategory, filterBatchProduct, products])

  const filterProductOptions = useMemo(() => {
    let filteredProducts = products

    if (filterBatchCategory !== 'all') {
      filteredProducts = products.filter((p) => p.category === filterBatchCategory)
    }

    return filteredProducts.map((p) => ({ value: p._id, label: p.name }))
  }, [products, filterBatchCategory])

  const stats = useMemo(() => {
    const active = filteredBatches.filter((item) => item.status === 'Active').length
    const hidden = filteredBatches.filter((item) => item.status !== 'Active').length
    const remainingQty = filteredBatches.reduce((sum, item) => sum + Number(item.remainingQty || 0), 0)
    const inventoryValue = filteredBatches.reduce(
      (sum, item) => sum + Number(item.remainingQty || 0) * Number(item.costPrice || 0),
      0,
    )

    return [
      {
        key: 'batches',
        title: 'Total Batches',
        value: filteredBatches.length,
        icon: <InboxOutlined style={{ color: '#ec4899' }} />,
      },
      {
        key: 'active',
        title: 'Active Batches',
        value: active,
        icon: <AppstoreOutlined style={{ color: '#16a34a' }} />,
      },
      {
        key: 'units',
        title: 'Units Remaining',
        value: remainingQty,
        icon: <ShoppingOutlined style={{ color: '#2563eb' }} />,
      },
      {
        key: 'value',
        title: 'Inventory Cost',
        value: new Intl.NumberFormat('vi-VN').format(inventoryValue) + ' đ',
        icon: <WalletOutlined style={{ color: '#f97316' }} />,
      },
      {
        key: 'hidden',
        title: 'Hidden',
        value: hidden,
        icon: <AppstoreOutlined style={{ color: '#94a3b8' }} />,
      },
    ]
  }, [filteredBatches])

  const columns = useMemo(
    () => [
      {
        title: 'Product Base',
        key: 'product',
        width: 320,
        render: (_, batch) => {
          const product = products.find((item) => item._id === batch.productId)
          const productImage = normalizeImage(product?.image)

          return (
            <div className='flex items-start gap-3'>
              <div className='flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50'>
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product?.name || getProductName(batch.productId)}
                    width={48}
                    height={48}
                    className='h-12 w-12 object-cover'
                  />
                ) : (
                  <PictureOutlined style={{ color: '#cbd5e1', fontSize: 16 }} />
                )}
              </div>
              <div className='min-w-0'>
                <Text strong style={{ color: '#0f172a' }}>
                  {getProductName(batch.productId)}
                </Text>
                <div>
                  <Text type='secondary' style={{ fontSize: 12 }}>
                    #{String(batch._id || '').slice(-6).toUpperCase()}
                  </Text>
                </div>
              </div>
            </div>
          )
        },
      },
      {
        title: 'Variant',
        key: 'variant',
        responsive: ['md'],
        width: 140,
        render: (_, batch) => (
          <Tag color='default' style={{ borderRadius: 999, fontWeight: 600 }}>
            {batch.size || 'Any'}
          </Tag>
        ),
      },
      {
        title: 'Supplier',
        dataIndex: 'supplier',
        key: 'supplier',
        width: 180,
        render: (value) => <Text style={{ color: '#64748b' }}>{value || 'N/A'}</Text>,
      },
      {
        title: 'Cost Price',
        dataIndex: 'costPrice',
        key: 'costPrice',
        responsive: ['sm'],
        width: 150,
        render: (value) => <Text strong style={{ color: '#dc2626' }}>{formatVnd(value)}</Text>,
      },
      {
        title: 'Remaining / Initial',
        key: 'qty',
        width: 170,
        render: (_, batch) => (
          <div>
            <Text strong style={{ color: Number(batch.remainingQty) === 0 ? '#ef4444' : '#16a34a' }}>
              {batch.remainingQty}
            </Text>
            <Text style={{ color: '#94a3b8' }}> / {batch.initialQty}</Text>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['lg'],
        width: 130,
        render: (value) => (
          <Switch size="small" checked={value === 'Active'} disabled />
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 100,
        align: 'center',
        render: (_, batch) => (
          <Space size={4}>
            <Button
              type='text'
              shape='circle'
              icon={<EditOutlined />}
              style={{ color: '#f59e0b' }}
              onClick={() => {
                setEditingBatchId(batch._id)
                const nextValues = {
                  size: batch.size,
                  costPrice: String(batch.costPrice || ''),
                  remainingQty: batch.remainingQty,
                  supplier: batch.supplier || '',
                  note: batch.note || '',
                  status: batch.status,
                }
                setEditFormData(nextValues)
                editForm.setFieldsValue({
                  size: nextValues.size,
                  remainingQty: nextValues.remainingQty,
                  supplier: nextValues.supplier,
                  note: nextValues.note,
                  status: nextValues.status,
                  costPrice: formatCurrency(String(batch.costPrice || '')),
                })
              }}
            />
            <Popconfirm
              title='Delete this import batch?'
              okText='Delete'
              cancelText='Cancel'
              onConfirm={() => handleDeleteBatch(batch._id)}
            >
              <Button
                type='text'
                shape='circle'
                danger
                loading={deletingBatchId === batch._id}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [deletingBatchId, editForm, getProductName, handleDeleteBatch, products],
  )

  return (
    <ConfigProvider theme={adminAntdTheme} getPopupContainer={getSelectPopupContainer}>
      <div className={pageShellClass}>
        <div className='mb-3 md:mb-6'>
          <Title level={4} style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>
            Import Hub
          </Title>
        </div>

        <div className={compactStatsRowClass}>
          {stats.map((item) => (
            <Card key={item.key} className={compactStatCardClass}>
              <Statistic title={item.title} value={item.value} prefix={item.icon}  />
            </Card>
          ))}
        </div>

        <div className='grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]'>
          <Card
            className='shadow-sm'
            title={
              <Space size={10}>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-500'>
                  <PlusOutlined />
                </div>
                <div>
                  <div className='text-xs font-bold text-slate-800'>New Goods Receipt</div>
                </div>
              </Space>
            }
          >
            <Form form={createForm} layout='vertical' onFinish={handleAddBatch} requiredMark={false}>
              <Form.Item label='Category Filter'>
                <Select
                  size='middle'
                  value={selectedCategory}
                  onChange={(value) => {
                    setSelectedCategory(value)
                    // Reset product selection when changing category
                    setFormData((prev) => ({ ...prev, productId: '' }))
                    createForm.setFieldValue('productId', undefined)
                  }}
                  options={[
                    { value: 'all', label: 'All categories' },
                    ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
                  ]}
                />
              </Form.Item>

              <Form.Item
                label='Product'
                name='productId'
                rules={[{ required: true, message: 'Please choose a product' }]}
              >
                <Select
                  size='middle'
                  showSearch
                  value={formData.productId || undefined}
                  placeholder='Search and select product'
                  optionFilterProp='searchText'
                  listHeight={320}
                  options={productOptions}
                  filterOption={(input, option) =>
                    String(option?.searchText || '').includes(String(input || '').toLowerCase())
                  }
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, productId: value || '' }))
                    createForm.setFieldValue('productId', value)
                  }}
                  optionRender={(option) => {
                    const meta = option.data.meta
                    return (
                      <div className='flex items-center gap-3 py-1'>
                        <div className='flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50'>
                          {meta?.image ? (
                            <img
                              src={meta.image}
                              alt={meta.name}
                              width={40}
                              height={40}
                              className='h-full w-full object-contain p-1'
                            />
                          ) : (
                            <InboxOutlined style={{ color: '#cbd5e1', fontSize: 14 }} />
                          )}
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='truncate font-medium text-slate-900'>{meta?.name}</div>
                          <div className='truncate text-xs text-slate-400'>
                            {meta?.category}
                            {meta?.subCategory ? ` • ${meta.subCategory}` : ''}
                          </div>
                        </div>
                        <div className='text-xs font-semibold text-slate-500'>
                          {formatVnd(meta?.price)}
                        </div>
                      </div>
                    )
                  }}
                />
              </Form.Item>

              <div className='grid gap-4 md:grid-cols-2'>
                <Form.Item label='Size' name='size'>
                  <Input
                    size='middle'
                    placeholder='1 Tháng, 3 Tháng, Vĩnh viễn...'
                    value={formData.size}
                    onChange={(event) => {
                      const newSize = formatPackageName(event.target.value)
                      setFormData((prev) => ({ ...prev, size: newSize }))
                      createForm.setFieldValue('size', newSize)
                    }}
                  />
                </Form.Item>
                <Form.Item label='Supplier' name='supplier'>
                  <Input
                    size='middle'
                    placeholder='Factory / vendor'
                    value={formData.supplier}
                    onChange={(event) => setFormData((prev) => ({ ...prev, supplier: event.target.value }))}
                  />
                </Form.Item>
              </div>

              {selectedProduct ? (
                <div className='mb-4 rounded-2xl border border-[#f2c99b] bg-[#fff1df] px-4 py-4'>
                  <div className='flex flex-wrap items-start justify-between gap-3'>
                    <div className='flex min-w-0 items-start gap-3'>
                      <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-200 bg-white/70'>
                        {selectedProductImage ? (
                          <img
                            src={selectedProductImage}
                            alt={selectedProduct.name}
                            width={64}
                            height={64}
                            className='h-16 w-16 object-cover'
                          />
                        ) : (
                          <PictureOutlined style={{ color: '#cbd5e1', fontSize: 20 }} />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <div className='text-sm font-semibold text-slate-900'>{selectedProduct.name}</div>
                        <div className='mt-1 text-xs text-amber-800'>
                        Giá đang để bán: <span className='font-semibold'>{formatVnd(selectedProduct.price)}</span>
                        </div>
                    </div>
                    </div>
                    <Tag
                      style={{
                        borderRadius: 999,
                        background: '#fff7ed',
                        borderColor: '#fdba74',
                        color: '#9a3412',
                        fontWeight: 700,
                      }}
                    >
                      Active setup
                    </Tag>
                  </div>
                  {selectedProductSizes.length > 0 ? (
                    <div className='mt-3'>
                      <div className='mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>
                        Gói dịch vụ có sẵn
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {selectedProductSizes.map((sizeOption) => (
                          <Button
                            key={sizeOption}
                            size='small'
                            type={formData.size === sizeOption ? 'primary' : 'default'}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, size: sizeOption }))
                              createForm.setFieldValue('size', sizeOption)
                            }}
                          >
                            {sizeOption}
                          </Button>
                        ))}
                        {selectedProductSizes.length > 1 ? (
                          <Button
                            size='small'
                            type={formData.size === selectedProductSizes.join(',') ? 'primary' : 'default'}
                            onClick={() => {
                              const allSizes = selectedProductSizes.join(',')
                              setFormData((prev) => ({ ...prev, size: allSizes }))
                              createForm.setFieldValue('size', allSizes)
                            }}
                          >
                            {selectedProductSizes.join(',')}
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className='grid gap-4 md:grid-cols-2'>
                <Form.Item
                  label='Cost Price'
                  name='costPrice'
                  rules={[{ required: true, message: 'Please enter cost price' }]}
                >
                  <Input
                    size='middle'
                    style={{ width: '100%', fontSize: '14px', fontWeight: 600 }}
                    placeholder='150.000'
                    value={formatCurrency(formData.costPrice)}
                    onChange={(event) => setFormData((prev) => ({ ...prev, costPrice: parseCurrency(event.target.value) }))}
                  />
                </Form.Item>
                <Form.Item
                  label='Initial Quantity'
                  name='initialQty'
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <InputNumber
                    size='middle'
                    style={{ width: '100%' }}
                    min={0}
                    placeholder='50'
                    value={formData.initialQty === '' ? null : Number(formData.initialQty)}
                    onChange={(value) => setFormData((prev) => ({ ...prev, initialQty: value ?? '' }))}
                  />
                </Form.Item>
              </div>

              {selectedProduct ? (
                <div className='-mt-2 mb-2 text-xs text-slate-500'>
                  Cost price nên thấp hơn giá đang bán hiện tại là{' '}
                  <span className='font-semibold text-slate-700'>{formatVnd(selectedProduct.price)}</span>
                </div>
              ) : null}

              <Form.Item label='Note' name='note'>
                <Input
                  size='middle'
                  placeholder='Fabric notes, source quality, batch remark...'
                  value={formData.note}
                  onChange={(event) => setFormData((prev) => ({ ...prev, note: event.target.value }))}
                />
              </Form.Item>

              <div className="flex flex-col gap-2">
                <Button type='primary' htmlType='submit' size='middle' loading={adding} block icon={<PlusOutlined />}>
                  Save Batch
                </Button>
                <Button size='middle' block onClick={resetCreateForm}>
                  Clear
                </Button>
              </div>
            </Form>
          </Card>

          <Card
            className='shadow-sm'
            title={
              <div>
                <div className='text-xs font-bold text-slate-800'>Batch Directory</div>
              </div>
            }
          >
            <div className='mb-4 flex flex-wrap gap-3'>
              <Select
                size='middle'
                style={{ minWidth: 180 }}
                placeholder='Filter by category'
                value={filterBatchCategory}
                onChange={(value) => {
                  setFilterBatchCategory(value)
                  setFilterBatchProduct('all')
                }}
                options={[
                  { value: 'all', label: 'All categories' },
                  ...categories.map((cat) => ({ value: cat.name, label: cat.name })),
                ]}
              />
              <Select
                size='middle'
                style={{ minWidth: 200 }}
                placeholder='Filter by product'
                value={filterBatchProduct}
                onChange={setFilterBatchProduct}
                options={[
                  { value: 'all', label: 'All products' },
                  ...filterProductOptions,
                ]}
              />
              {(filterBatchCategory !== 'all' || filterBatchProduct !== 'all') && (
                <Button
                  size='middle'
                  onClick={() => {
                    setFilterBatchCategory('all')
                    setFilterBatchProduct('all')
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>

            <Table
              rowKey='_id'
              columns={columns}
              dataSource={filteredBatches}
              loading={loading}
              rowClassName={(record) => (record.status === 'Active' ? '!bg-[#fff7ed]' : '')}
              size='small'
              pagination={{ pageSize: 7, showSizeChanger: false, size: 'small' }}

              locale={{
                emptyText: <Empty description='No batches found' image={Empty.PRESENTED_IMAGE_SIMPLE} />,
              }}
            />
          </Card>
        </div>

        <Modal
          open={!!editingBatchId}
          onCancel={() => setEditingBatchId(null)}
          title='Update Import Batch'
          okText={updating ? 'Saving...' : 'Save Changes'}
          onOk={() => editForm.submit()}
          confirmLoading={updating}
          cancelText='Cancel'
          destroyOnHidden
        >
          <Form form={editForm} layout='vertical' onFinish={handleUpdateBatch} requiredMark={false}>
            <div className='grid gap-4 md:grid-cols-2'>
              <Form.Item
                label='Size'
                name='size'
                rules={[{ required: true, message: 'Please enter size' }]}
              >
                <Input
                  size='middle'
                  value={editFormData.size}
                  onChange={(event) =>
                    setEditFormData((prev) => ({ ...prev, size: event.target.value.toUpperCase() }))
                  }
                />
              </Form.Item>

              <Form.Item
                label='Status'
                name='status'
                rules={[{ required: true, message: 'Please choose status' }]}
              >
                <Select
                  size='middle'
                  value={editFormData.status}
                  onChange={(value) => setEditFormData((prev) => ({ ...prev, status: value }))}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Hidden', label: 'Hidden' },
                  ]}
                />
              </Form.Item>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <Form.Item
                label='Cost Price'
                name='costPrice'
                rules={[{ required: true, message: 'Please enter cost price' }]}
              >
                <Input
                  size='middle'
                  style={{ width: '100%', fontSize: '14px', fontWeight: 600 }}
                  placeholder='100.000'
                  value={formatCurrency(editFormData.costPrice)}
                  onChange={(event) =>
                    setEditFormData((prev) => ({ ...prev, costPrice: parseCurrency(event.target.value) }))
                  }
                />
              </Form.Item>

              <Form.Item
                label='Remaining Quantity'
                name='remainingQty'
                rules={[{ required: true, message: 'Please enter remaining quantity' }]}
              >
                <InputNumber
                  size='middle'
                  style={{ width: '100%' }}
                  min={0}
                  value={editFormData.remainingQty === '' ? null : Number(editFormData.remainingQty)}
                  onChange={(value) => setEditFormData((prev) => ({ ...prev, remainingQty: value ?? '' }))}
                />
              </Form.Item>
            </div>

            <Alert
              message='Lưu ý quan trọng'
              description='Không cộng dồn sản phẩm mới vào lô cũ. Hãy tạo lô mới để báo cáo Lãi/Lỗ chính xác'
              type='warning'
              style={{ marginBottom: 16 }}
              showIcon
            />

            <Form.Item label='Supplier' name='supplier'>
              <Input
                size='middle'
                value={editFormData.supplier}
                onChange={(event) => setEditFormData((prev) => ({ ...prev, supplier: event.target.value }))}
              />
            </Form.Item>

            <Form.Item label='Note' name='note'>
              <Input
                size='middle'
                value={editFormData.note}
                onChange={(event) => setEditFormData((prev) => ({ ...prev, note: event.target.value }))}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  )
}

export default ImportBatch
