import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

/**
 * getCroppedImg – converts the cropped area into a Blob/File
 */
async function getCroppedImg(imageSrc, pixelCrop, fileName = 'cropped.jpg') {
    const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Canvas is empty'));
            const file = new File([blob], fileName, { type: 'image/jpeg' });
            resolve(file);
        }, 'image/jpeg', 0.92);
    });
}

/**
 * ImageCropModal
 * Props:
 *   imageSrc   – string: data URL of the selected image
 *   aspect     – number: crop aspect ratio (default 16/9 for banners)
 *   onCrop     – function(File): called with the cropped File
 *   onCancel   – function(): called when user cancels
 *   fileName   – string: output file name
 */
const ImageCropModal = ({
    imageSrc,
    aspect = 16 / 9,
    onCrop,
    onCancel,
    fileName = 'banner.jpg',
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [processing, setProcessing] = useState(false);

    const onCropComplete = useCallback((_, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setProcessing(true);
        try {
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, fileName);
            onCrop(croppedFile);
        } catch (err) {
            console.error('Crop error:', err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
            <div className='w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col'>
                {/* Header */}
                <div className='flex items-center justify-between border-b border-gray-100 px-5 py-4'>
                    <div>
                        <p className='font-semibold text-gray-800'>Cắt ảnh Banner</p>
                        <p className='text-xs text-gray-400 mt-0.5'>Kéo để căn chỉnh · Cuộn để zoom</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-700'
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Cropper */}
                <div className='relative bg-gray-900' style={{ height: '380px' }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        showGrid={true}
                        style={{
                            containerStyle: { borderRadius: 0 },
                        }}
                    />
                </div>

                {/* Zoom slider */}
                <div className='flex items-center gap-3 border-t border-gray-100 bg-gray-50 px-5 py-3'>
                    <ZoomOut size={16} className='text-gray-400 flex-shrink-0' />
                    <input
                        type='range'
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className='w-full h-1.5 accent-black cursor-pointer'
                    />
                    <ZoomIn size={16} className='text-gray-400 flex-shrink-0' />
                    <span className='ml-1 text-xs font-medium text-gray-500 w-10 text-right flex-shrink-0'>
                        {zoom.toFixed(1)}×
                    </span>
                </div>

                {/* Actions */}
                <div className='flex gap-3 justify-end border-t border-gray-100 px-5 py-4'>
                    <button
                        onClick={onCancel}
                        className='rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={processing}
                        className='flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60'
                    >
                        <Check size={15} />
                        {processing ? 'Đang xử lý...' : 'Dùng ảnh này'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;
