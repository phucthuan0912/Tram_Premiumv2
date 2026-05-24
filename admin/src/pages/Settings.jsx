import React, { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl as defaultBackendUrl } from '../config'

const Settings = ({ token, setToken, backendUrl: backendUrlFromProps }) => {
  const [deliveryFee, setDeliveryFee] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const apiBaseUrl = useMemo(
    () => (backendUrlFromProps || defaultBackendUrl || '').trim().replace(/\/+$/, ''),
    [backendUrlFromProps],
  )

  const handleUnauthorized = useCallback(
    (message) => {
      const normalized = (message || '').toLowerCase()
      if (!normalized.includes('not authorized')) return false

      toast.error('Session expired, please login again')
      setToken?.('')
      localStorage.removeItem('token')
      setTimeout(() => window.location.reload(), 400)
      return true
    },
    [setToken],
  )

  const fetchConfig = useCallback(async () => {
    if (!apiBaseUrl) return

    try {
      setLoading(true)
      const { data } = await axios.get(`${apiBaseUrl}/api/system/config`)

      if (data?.success && data?.config) {
        setDeliveryFee(data.config.deliveryFee || 0)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [apiBaseUrl])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Please login first')

    if (deliveryFee === '') {
      return toast.error('Delivery fee cannot be empty')
    }

    setIsSubmitting(true)
    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/system/config/update`, {
        deliveryFee: Number(deliveryFee)
      }, { headers: { token } })

      if (data.success) {
        toast.success('Settings updated successfully')
        fetchConfig()
      } else {
        if (handleUnauthorized(data.message)) return
        toast.error(data.message)
      }
    } catch (error) {
      if (handleUnauthorized(error.response?.data?.message)) return
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetDeliveryFee = async () => {
    if (!token) return toast.error('Please login first')
    
    setIsResetting(true)
    try {
      const { data } = await axios.post(`${apiBaseUrl}/api/system/config/reset-delivery-fee`, {}, { headers: { token } })
      
      if (data.success) {
        toast.success(data.message || 'Delivery fee reset to 0 (Free Shipping)')
        setDeliveryFee(0)
        fetchConfig()
      } else {
        if (handleUnauthorized(data.message)) return
        toast.error(data.message)
      }
    } catch (error) {
      if (handleUnauthorized(error.response?.data?.message)) return
      toast.error(error.message)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className='flex w-full flex-col gap-8 px-4 py-6 md:px-6'>
      
      <div>
        <p className='mb-4 text-xl font-semibold text-gray-800'>System Settings</p>

        {loading ? (
            <p className='text-sm text-gray-500'>Loading settings...</p>
        ) : (
            <form onSubmit={handleSaveSettings} className='max-w-[400px] w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4'>
                <div className='w-full'>
                    <p className='mb-2 font-medium text-sm text-gray-700'>Global Delivery Fee (VND)</p>
                    <input
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        className='w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-pink-400 font-mono text-gray-800'
                        type='number'
                        min="0"
                        step="1000"
                        placeholder='30000'
                        required
                    />
                    <p className='mt-2 text-xs text-gray-500'>This fee will be applied to all customer orders crossing checkout.</p>
                </div>

                <div className='mt-4 flex gap-3'>
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className='rounded bg-gray-800 px-8 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isSubmitting ? 'SAVING...' : 'SAVE SETTINGS'}
                    </button>
                    <button
                        type='button'
                        onClick={handleResetDeliveryFee}
                        disabled={isResetting}
                        className='rounded bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        {isResetting ? 'RESETTING...' : 'FREE SHIPPING'}
                    </button>
                </div>
            </form>
        )}
      </div>

    </div>
  )
}

export default Settings
