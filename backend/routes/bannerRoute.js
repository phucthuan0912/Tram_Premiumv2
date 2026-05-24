import express from 'express';
import { addBanner, removeBanner, listBanners, updateBannerStatus } from '../controllers/bannerController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const bannerRouter = express.Router();

bannerRouter.post('/add', adminAuth, upload.single('image'), addBanner);
bannerRouter.post('/remove', adminAuth, removeBanner);
bannerRouter.get('/list', listBanners);
bannerRouter.post('/status', adminAuth, updateBannerStatus);

export default bannerRouter;
