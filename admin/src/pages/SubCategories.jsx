import React, { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl as defaultBackendUrl } from '../config'
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  ConfigProvider,
  Empty,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
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

const SubCategories = ({ token, backendUrl: backendUrlFromProps }) => {
  const [list, setList] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('all')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState('')
  const [togglingId, setTogglingId] = useState('')
  const [form] = Form.useForm()

  const apiBaseUrl = useMemo(
    () => (backendUrlFromProps || defaultBackendUrl || '').trim().replace(/\/+$/, ''),
    [backendUrlFromProps],
  )

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [subRes, catRes] = await Promise.all([
        axios.get(`${apiBaseUrl}/api/sub-category/list`),
        axios.get(`${apiBaseUrl}/api/category/list`),
      ])

      if (subRes.data.success) setList(subRes.data.subCategories)
      if (catRes.data.success) setCategories(catRes.data.categories)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const resetFormState = useCallback(() => {
    setName('')
    setCategoryId('')
    form.resetFields()
  }, [form])

  const onSubmitHandler = async () => {
    try {
      setAdding(true)
      const response = await axios.post(
        `${apiBaseUrl}/api/sub-category/add`,
        { name, categoryId, status: true },
        { headers: { token } },
      )

      if (response.data.success) {
        toast.success(response.data.message)
        resetFormState()
        fetchData()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setAdding(false)
    }
  }

  const removeSubCategory = async (id) => {
    try {
      setRemovingId(id)
      const response = await axios.post(
        `${apiBaseUrl}/api/sub-category/remove`,
        { id },
        { headers: { token } },
      )
      if (response.data.success) {
        toast.success(response.data.message)
        fetchData()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setRemovingId('')
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      setTogglingId(id)
      const response = await axios.post(
        `${apiBaseUrl}/api/sub-category/status`,
        { id, status: !currentStatus },
        { headers: { token } },
      )
      if (response.data.success) {
        fetchData()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTogglingId('')
    }
  }

  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: cat._id, label: cat.name })),
    [categories],
  )

  const filteredList = useMemo(() => {
    if (filterCategoryId === 'all') return list
    return list.filter((item) => item.categoryId?._id === filterCategoryId)
  }, [list, filterCategoryId])

  const stats = useMemo(() => {
    const active = filteredList.filter((item) => item.status).length
    const disabled = filteredList.filter((item) => !item.status).length
    const parentCount = new Set(filteredList.map((item) => item?.categoryId?._id).filter(Boolean)).size

    return [
      {
        key: 'total',
        title: 'Total Sub-Categories',
        value: filteredList.length,
        icon: <ApartmentOutlined style={{ color: '#ec4899' }} />,
      },
      {
        key: 'active',
        title: 'Active',
        value: active,
        icon: <CheckCircleOutlined style={{ color: '#16a34a' }} />,
      },
      {
        key: 'disabled',
        title: 'Disabled',
        value: disabled,
        icon: <StopOutlined style={{ color: '#f97316' }} />,
      },
      {
        key: 'parents',
        title: 'Parent Groups',
        value: parentCount,
        icon: <FolderOpenOutlined style={{ color: '#2563eb' }} />,
      },
    ]
  }, [filteredList])

  const columns = useMemo(
    () => [
      {
        title: 'Sub-Category',
        key: 'name',
        render: (_, item) => (
          <div>
            <Text strong style={{ color: '#0f172a' }}>
              {item.name}
            </Text>
            <div>
              <Text type='secondary' style={{ fontSize: 12 }}>
                #{String(item._id || '').slice(-6).toUpperCase()}
              </Text>
            </div>
          </div>
        ),
      },
      {
        title: 'Parent Category',
        key: 'parent',
        width: 220,
        render: (_, item) => (
          <Tag color='blue' style={{ borderRadius: 999, fontWeight: 600 }}>
            {item.categoryId?.name || 'Unknown'}
          </Tag>
        ),
      },
      {
        title: 'Status',
        key: 'status',
        width: 180,
        render: (_, item) => (
          <Switch size="small" checked={Boolean(item.status)} loading={togglingId === item._id} onChange={() => toggleStatus(item._id, item.status)} />
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 120,
        align: 'center',
        render: (_, item) => (
          <Popconfirm
            title='Delete sub-category'
            description='This removes the selected nested category.'
            okText='Delete'
            cancelText='Cancel'
            okButtonProps={{ danger: true, loading: removingId === item._id }}
            onConfirm={() => removeSubCategory(item._id)}
          >
            <Button type='text' shape='circle' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ),
      },
    ],
    [removingId, togglingId],
  )

  return (
    <ConfigProvider theme={adminAntdTheme} getPopupContainer={getSelectPopupContainer}>
      <div className={pageShellClass}>
        <div className='mb-3 md:mb-6 flex flex-col gap-2 md:gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <Title level={4} style={{ margin: 0, color: '#0f172a', fontSize: '14px' }}>
              Sub-Category Manager
            </Title>
          </div>

          <Space size={12} wrap>
            <Select
              size='middle'
              style={{ minWidth: 200 }}
              value={filterCategoryId}
              onChange={setFilterCategoryId}
              options={[
                { value: 'all', label: 'All categories' },
                ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
              ]}
            />
          </Space>
        </div>

        <div className={compactStatsRowClass}>
          {stats.map((item) => (
            <Card key={item.key} bordered={false} className={compactStatCardClass}>
              <Statistic title={item.title} value={item.value} prefix={item.icon} valueStyle={{ color: '#0f172a' }} />
            </Card>
          ))}
        </div>

        <div className='grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]'>
          <Card
            bordered={false}
            className='shadow-sm'
            title={
              <Space size={10}>
                <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-500'>
                  <PlusOutlined />
                </div>
                <div>
                  <div className='text-xs font-bold text-slate-800'>Add Sub-Category</div>
                </div>
              </Space>
            }
          >
            <Form form={form} layout='vertical' onFinish={onSubmitHandler} requiredMark={false}>
              <Form.Item
                label='Sub-Category Name'
                name='name'
                rules={[{ required: true, message: 'Please enter the sub-category name' }]}
              >
                <Input
                  size='middle'
                  placeholder='e.g. T-Shirts'
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Parent Category'
                name='categoryId'
                rules={[{ required: true, message: 'Please choose a parent category' }]}
              >
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={nativeSelectClass}
                >
                  <option value=''>Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Form.Item>

              <div className="flex flex-col gap-2">
                <Button type='primary' htmlType='submit' size='middle' loading={adding} block icon={<PlusOutlined />}>
                  Save Sub-Category
                </Button>
                <Button size='middle' block onClick={resetFormState} disabled={!name && !categoryId}>
                  Clear
                </Button>
              </div>
            </Form>
          </Card>

          <Card
            bordered={false}
            className='shadow-sm'
            title={
              <div>
                <div className='text-xs font-bold text-slate-800'>Sub-Category Directory</div>
              </div>
            }
          >
            <Table
              rowKey='_id'
              columns={columns}
              dataSource={filteredList}
              loading={loading}
              size='small'
              pagination={{ pageSize: 6, showSizeChanger: false, size: 'small' }}

              locale={{
                emptyText: <Empty description='No sub-categories created yet' image={Empty.PRESENTED_IMAGE_SIMPLE} />,
              }}
            />
          </Card>
        </div>
      </div>
    </ConfigProvider>
  )
}

export default SubCategories
