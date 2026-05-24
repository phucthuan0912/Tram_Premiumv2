import bannerModel from '../models/bannerModel.js';
import { v2 as cloudinary } from 'cloudinary';
import logAction from '../utils/logger.js';

const addBanner = async (req, res) => {
    try {
        const { title, link, status, order } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.json({ success: false, message: 'Please upload a banner image' });
        }

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;

        const bannerData = {
            title,
            link,
            image: imageUrl,
            status: status === 'true',
            order: Number(order) || 0
        };

        const newBanner = new bannerModel(bannerData);
        await newBanner.save();

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'ADD_BANNER', `Added banner: ${title || 'Unnamed'}`, newBanner._id);
        }

        res.json({ success: true, message: 'Banner Added' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeBanner = async (req, res) => {
    try {
        const { id } = req.body;
        await bannerModel.findByIdAndDelete(id);
        
        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'REMOVE_BANNER', `Removed banner ID: ${id}`, id);
        }

        res.json({ success: true, message: 'Banner Removed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listBanners = async (req, res) => {
    try {
        const banners = await bannerModel.find({}).sort({ order: 1, date: -1 });
        res.json({ success: true, banners });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateBannerStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        await bannerModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: 'Banner status updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addBanner, removeBanner, listBanners, updateBannerStatus };
