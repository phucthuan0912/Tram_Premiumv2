import React, { useEffect, useMemo, useState, useCallback } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  BgColorsOutlined,
  FireOutlined,
  InboxOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { Button, Card, ConfigProvider, Input, Space, Statistic, Switch, Tag, Typography } from 'antd'
import { backendUrl as defaultBackendUrl } from '../config'
import {
  adminAntdTheme,
  compactStatCardClass,
  compactStatsRowClass,
  getSelectPopupContainer,
  nativeSelectClass,
  pageShellClass,
} from '../lib/adminAntd'

const { Title, Text } = Typography
const { TextArea } = Input

const DEFAULT_PACKAGES = ['1 Tháng', '3 Tháng', '6 Tháng', '1 Năm', 'Vĩnh viễn']
const MAX_IMAGE_SIZE_MB = 5

const formatCurrency = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const parseCurrency = (val) => {
  if (!val) return '';
  return String(val).replace(/\D/g, '');
};

const formatPackageName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

const Add = ({ token, setToken, backendUrl: backendUrlFromProps }) => {
  const [images, setImages] = useState([null, null, null, null])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [oldPrice, setOldPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [videoUrl, setVideoUrl] = useState('')
  const [customSize, setCustomSize] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [allSubCategories, setAllSubCategories] = useState([])

  const apiBaseUrl = useMemo(
    () => (backendUrlFromProps || defaultBackendUrl || '').trim().replace(/\/+$/, ''),
    [backendUrlFromProps],
  )

  const previewUrls = useMemo(
    () => images.map((file) => (file ? URL.createObjectURL(file) : null)),
    [images],
  )

  const filledImageCount = useMemo(() => images.filter(Boolean).length, [images])

  const isDirty = useMemo(
    () =>
      Boolean(
        filledImageCount ||
          name ||
          description ||
          price ||
          oldPrice ||
          sizes.length ||
          videoUrl ||
          bestseller,
      ),
    [bestseller, description, filledImageCount, name, oldPrice, price, sizes.length, videoUrl],
  )

  useEffect(
    () => () => {
      previewUrls.forEach((url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    },
    [previewUrls],
  )

  const setImageAt = (index, file) => {
    setImages((prev) => prev.map((item, i) => (i === index ? file : item)))
    // Reset input file để có thể chọn lại cùng file
    if (!file) {
      const input = document.getElementById(`image${index + 1}`)
      if (input) input.value = ''
    }
  }

  const handleImageChange = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Chi chap nhan file anh')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Anh vuot qua ${MAX_IMAGE_SIZE_MB}MB`)
      event.target.value = ''
      return
    }

    setImageAt(index, file)
  }

  const toggleSize = (rawSize) => {
    const size = formatPackageName(rawSize)
    if (!size) return

    setSizes((prev) =>
      prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
    )
  }

  const addCustomSize = () => {
    const size = formatPackageName(customSize)
    if (!size) return

    setSizes((prev) => (prev.includes(size) ? prev : [...prev, size]))
    setCustomSize('')
  }

  const fetchCategoryData = useCallback(async () => {
    if (!apiBaseUrl) return

    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/category/list`),
        axios.get(`${apiBaseUrl}/api/sub-category/list`),
      ])

      if (catRes.data.success) {
        const activeCategories = catRes.data.categories.filter((item) => item.status)
        setCategories(activeCategories)

        if (activeCategories.length > 0 && !activeCategories.find((item) => item.name === category)) {
          setCategory(activeCategories[0].name)
        }
      }

      if (subRes.data.success) {
        setAllSubCategories(subRes.data.subCategories.filter((item) => item.status))
      }
    } catch (error) {
      console.error('Error fetching category data:', error)
    }
  }, [apiBaseUrl, category])

  useEffect(() => {
    fetchCategoryData()
  }, [fetchCategoryData])

  useEffect(() => {
    const parent = categories.find((item) => item.name === category)
    if (parent) {
      const filtered = allSubCategories.filter((item) => item.categoryId?._id === parent._id)
      setSubCategories(filtered)
      if (filtered.length > 0) setSubCategory(filtered[0].name)
      else setSubCategory('')
      return
    }

    setSubCategories([])
    setSubCategory('')
  }, [allSubCategories, category, categories])

  const resetForm = () => {
    setImages([null, null, null, null])
    setName('')
    setDescription('')
    setPrice('')
    setOldPrice('')
    if (categories.length > 0) {
      setCategory(categories[0].name)
    } else {
      setCategory('')
    }
    setSubCategory('')
    setBestseller(false)
    setSizes([])
    setVideoUrl('')
    setCustomSize('')
  }

  const renderUploadSlot = (index, file) => {
    const previewUrl = previewUrls[index]

    if (previewUrl) {
      return (
        <img
          src={previewUrl}
          alt={`product-upload-${index + 1}`}
          width={80}
          height={80}
          className='h-full w-full object-contain p-2'
        />
      )
    }

    return (
      <div className='flex h-full w-full flex-col items-center justify-center gap-1.5 bg-transparent text-[#a68f76]'>
        <div className='flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(166,123,39,0.12)] ring-1 ring-[#f4e2c9] transition hover:scale-110'>
          <InboxOutlined style={{ fontSize: 18, color: '#a67b27' }} />
        </div>
        <span className='mt-1 text-[11px] font-semibold tracking-wide'>Upload</span>
      </div>
    )
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    if (!apiBaseUrl) {
      toast.error('Thieu VITE_BACKEND_URL trong admin/.env')
      return
    }

    if (!token) {
      toast.error('Token khong hop le, vui long dang nhap lai')
      return
    }

    if (!images.some(Boolean)) {
      toast.error('Vui long chon it nhat 1 anh san pham')
      return
    }

    if (!sizes.length) {
      toast.error('Vui long chon it nhat 1 size')
      return
    }

    const numericPrice = Number(parseCurrency(price))
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      toast.error('Gia san pham phai lon hon 0')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('description', description.trim())
      formData.append('price', numericPrice)
      formData.append('oldPrice', Number(parseCurrency(oldPrice)) || 0)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))
      formData.append('videoUrl', videoUrl)

      images.forEach((file, index) => {
        if (file) {
          formData.append(`image${index + 1}`, file)
        }
      })

      const { data } = await axios.post(`${apiBaseUrl}/api/product/add`, formData, {
        headers: { token },
        timeout: 20000,
      })

      if (data?.success) {
        toast.success(data.message || 'Product added')
        resetForm()
      } else {
        if ((data?.message || '').toLowerCase().includes('not authorized')) {
          toast.error('Phien dang nhap het han, vui long dang nhap lai')
          setToken?.('')
          localStorage.removeItem('token')
          setTimeout(() => window.location.reload(), 500)
          return
        }
        toast.error(data?.message || 'Khong the them san pham')
      }
    } catch (error) {
      const isNetworkError = error.code === 'ERR_NETWORK' || error.message === 'Network Error'
      if (isNetworkError) {
        toast.error(`Khong ket noi backend ${apiBaseUrl}. Hay bat backend va kiem tra CORS.`)
      } else {
        toast.error(error.response?.data?.message || error.message || 'Them san pham that bai')
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <ConfigProvider theme={adminAntdTheme} getPopupContainer={getSelectPopupContainer}>
      <form onSubmit={onSubmitHandler}>
        <div className={pageShellClass}>
          <div className='mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <Title level={3} style={{ margin: 0, color: 'var(--admin-text)' }}>
                Add Product
              </Title>
              <Text type='secondary'>
                Publish a new catalog item with media, pricing, sizes and merchandising details.
              </Text>
            </div>

            <Space size={12} wrap>
              <Button size='large' icon={<ReloadOutlined />} onClick={resetForm} disabled={!isDirty}>
                Clear Draft
              </Button>
              <Button
                type='primary'
                size='large'
                htmlType='submit'
                loading={isSubmitting}
                icon={<PlusOutlined />}
              >
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </Space>
          </div>


          <div className='flex flex-col gap-4 lg:flex-row lg:items-start'>
            <Card
              bordered={false}
              className='admin-card overflow-hidden xl:min-w-0 xl:flex-1'
            >
              <div className='space-y-4'>
                <div>
                  <Text strong style={{ color: 'var(--admin-text)' }}>
                    Product Name
                  </Text>
                  <Input
                    size='large'
                    className='mt-2 !bg-[var(--admin-surface)] !text-[var(--admin-text)] !border-[var(--admin-border)] placeholder:!text-[var(--admin-muted)]'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder='Enter product name'
                    required
                  />
                </div>

                <div>
                  <Text strong style={{ color: 'var(--admin-text)' }}>
                    Product Description
                  </Text>
                  <TextArea
                    className='mt-2 !bg-[var(--admin-surface)] !text-[var(--admin-text)] !border-[var(--admin-border)] placeholder:!text-[var(--admin-muted)]'
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder='Write product description here'
                    required
                  />
                </div>

                <div className='grid gap-3 lg:grid-cols-2'>
                  <div>
                    <Text strong style={{ color: 'var(--admin-text)' }}>
                      Category
                    </Text>
                    <select
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="mt-2 admin-select"
                    >
                      {!category ? <option value=''>Select category</option> : null}
                      {categories.map((item) => (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Text strong style={{ color: 'var(--admin-text)' }}>
                      Sub Category (Optional)
                    </Text>
                    <select
                      value={subCategory}
                      onChange={(event) => setSubCategory(event.target.value)}
                      disabled={!subCategories.length}
                      className="mt-2 admin-select"
                    >
                      {!subCategories.length ? <option value=''>No sub-category</option> : null}
                      {subCategories.map((item) => (
                        <option key={item._id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Text strong style={{ color: 'var(--admin-text)' }}>
                      Sell Price
                    </Text>
                    <Input
                      size='large'
                      className='mt-2 !bg-[var(--admin-surface)] !text-[var(--admin-text)] !border-[var(--admin-border)] placeholder:!text-[var(--admin-muted)]'
                      type='text'
                      style={{ fontSize: '1.25rem', fontWeight: 600, padding: '8px 14px' }}
                      value={formatCurrency(price)}
                      onChange={(event) => setPrice(parseCurrency(event.target.value))}
                      placeholder='250.000'
                      required
                    />
                  </div>

                  <div>
                    <Text strong style={{ color: 'var(--admin-text)' }}>
                      Original Price
                    </Text>
                    <Input
                      size='large'
                      className='mt-2 !bg-[var(--admin-surface)] !text-[var(--admin-text)] !border-[var(--admin-border)] placeholder:!text-[var(--admin-muted)]'
                      type='text'
                      style={{ fontSize: '1.25rem', fontWeight: 600, padding: '8px 14px' }}
                      value={formatCurrency(oldPrice)}
                      onChange={(event) => setOldPrice(parseCurrency(event.target.value))}
                      placeholder='300.000'
                    />
                  </div>
                </div>
              </div>
            </Card>
            <div className='flex w-full flex-col gap-4 xl:w-[400px] 2xl:w-[440px]'>
              <Card
                bordered={false}
                className='admin-card overflow-hidden'
                title={
                  <Space size={10}>
                    <div className='flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--admin-accent-soft)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] ring-1 ring-[var(--admin-border)] text-[var(--admin-tertiary)]'>
                      <PictureOutlined />
                    </div>
                    <div>
                      <div className='font-semibold text-slate-900'>Media Gallery</div>
                      <div className='text-xs font-normal text-slate-400'>
                        Upload up to 4 product images in compact slots.
                      </div>
                    </div>
                  </Space>
                }
              >
                <div className='grid grid-cols-2 gap-2'>
                  {images.map((file, index) => (
                    <div key={`image-${index}`} className='admin-panel p-2 shadow-[0_8px_20px_rgba(31,26,23,0.03)]'>
                      <label htmlFor={`image${index + 1}`} className='block cursor-pointer'>
                        <div className='relative h-28 overflow-hidden rounded-[18px] border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] backdrop-blur transition hover:bg-[var(--admin-surface-solid)]'>
                          {renderUploadSlot(index, file)}
                          <div className='absolute inset-x-1.5 bottom-1.5 rounded-lg bg-[var(--admin-surface-solid)] px-2 py-1 text-center text-[10px] font-semibold text-[var(--admin-muted)] shadow-sm'>
                            {file ? `Image ${index + 1}` : `Slot ${index + 1}`}
                          </div>
                        </div>
                      </label>

                      <input
                        id={`image${index + 1}`}
                        key={`input-${index}-${file ? 'filled' : 'empty'}`}
                        type='file'
                        hidden
                        accept='image/*'
                        onChange={(event) => handleImageChange(index, event)}
                      />

                      <div className='mt-1 flex items-center justify-between gap-2'>
                        <Text type='secondary' style={{ fontSize: 11 }}>
                          {MAX_IMAGE_SIZE_MB}MB max
                        </Text>
                        {file ? (
                          <Button type='text' danger size='small' onClick={() => setImageAt(index, null)}>
                            Remove
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>

                <div className='mt-3'>
                  <Text strong style={{ color: 'var(--admin-text)' }}>
                    TikTok Video URL
                  </Text>
                  <Input
                    size='large'
                    className='mt-2 !bg-[var(--admin-surface)] !text-[var(--admin-text)] !border-[var(--admin-border)] placeholder:!text-[var(--admin-muted)]'
                    prefix={<PlayCircleOutlined style={{ color: '#94a3b8' }} />}
                    value={videoUrl}
                    onChange={(event) => setVideoUrl(event.target.value)}
                    placeholder='https://www.tiktok.com/@user/video/...'
                  />
                  <Text type='secondary' style={{ display: 'block', marginTop: 6, fontSize: 11 }}>
                    He thong se tu dong lay link HD khong logo.
                  </Text>
                </div>
              </Card>

            </div>
          </div>

          <Card
            bordered={false}
            className='admin-card overflow-hidden mt-6'
            title={
              <Space size={10}>
                <div className='flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--admin-accent-soft)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] ring-1 ring-[var(--admin-border)] text-[var(--admin-tertiary)]'>
                  <TagsOutlined />
                </div>
                <div>
                  <div className='font-semibold text-slate-900'>Variants & Merchandising</div>
                  <div className='text-xs font-normal text-slate-400'>
                    Keep size, color and bestseller controls visible in one glance.
                  </div>
                </div>
              </Space>
            }
          >
            <div className='grid gap-4 lg:grid-cols-2'>
              <div className='admin-panel p-4.5 shadow-[0_8px_20px_rgba(31,26,23,0.03)]'>
                <div className='mb-2 flex items-center gap-2'>
                  <TagsOutlined style={{ color: 'var(--admin-tertiary)' }} />
                  <Text strong style={{ color: 'var(--admin-text)' }}>
                    Thời hạn gói (Packages)
                  </Text>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {DEFAULT_PACKAGES.map((size) => (
                    <Button
                      key={size}
                      size='middle'
                      type={sizes.includes(formatPackageName(size)) ? 'primary' : 'default'}
                      className='!rounded-full !px-4'
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>

                <div className='mt-3 flex gap-2'>
                  <Input
                    size='large'
                    value={customSize}
                    onChange={(event) => setCustomSize(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        addCustomSize()
                      }
                    }}
                    placeholder='Add custom package: 1 Tuần, 2 Năm...'
                  />
                  <Button size='large' onClick={addCustomSize} icon={<PlusOutlined />}>
                    Add
                  </Button>
                </div>

                <div className='mt-3 flex flex-wrap gap-2'>
                  {sizes.length ? (
                    sizes.map((size) => (
                      <Tag
                        key={size}
                        closable
                        onClose={(event) => {
                          event.preventDefault()
                          toggleSize(size)
                        }}
                        style={{
                          borderRadius: 999,
                          padding: '6px 12px',
                          borderColor: '#bfdbfe',
                          backgroundColor: '#eff6ff',
                          color: '#2563eb',
                          fontWeight: 600,
                        }}
                      >
                        {size}
                      </Tag>
                    ))
                  ) : (
                    <Text type='secondary'>No size selected</Text>
                  )}
                </div>
              </div>

              <div className='admin-panel p-4.5 shadow-[0_8px_20px_rgba(31,26,23,0.03)]'>
                <div className='mb-2 flex items-center gap-2'>
                  <FireOutlined style={{ color: 'var(--admin-tertiary)' }} />
                  <Text strong style={{ color: 'var(--admin-text)' }}>
                    Bestseller
                  </Text>
                </div>
                <Text type='secondary' style={{ display: 'block', marginBottom: 16, lineHeight: 1.6 }}>
                  Highlight this item in bestseller sections.
                </Text>
                <div className='flex items-center justify-between rounded-[18px] border border-[var(--admin-border)] bg-[var(--admin-surface)] backdrop-blur px-5 py-3.5 shadow-sm'>
                  <Text style={{ color: 'var(--admin-text)', fontWeight: 500 }}>
                    {bestseller ? 'Enabled' : 'Disabled'}
                  </Text>
                  <Switch checked={bestseller} onChange={setBestseller} />
                </div>
              </div>
            </div>
          </Card>

          <Card 
            bordered={false} 
            className='admin-card mt-6 overflow-hidden'
          >
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <div className='font-semibold text-slate-900'>Ready to publish</div>
                <div className='text-sm text-slate-500'>
                  Review the media slots and variant chips, then send the product to the live catalog.
                </div>
              </div>

              <Space size={12} wrap>
                <Button size='large' onClick={resetForm} disabled={!isDirty}>
                  Reset Form
                </Button>
                <Button
                  type='primary'
                  size='large'
                  htmlType='submit'
                  loading={isSubmitting}
                  icon={<PlusOutlined />}
                >
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </form>
    </ConfigProvider>
  )
}

export default Add

