import express from 'express';
import { getAppConfig, updateAppConfig, addVoucher, listVouchers, updateVoucher, deleteVoucher, resetCategories, subscribeNewsletter, resetDeliveryFee } from '../controllers/systemController.js';
import adminAuth from '../middleware/adminAuth.js';

const systemRouter = express.Router();

systemRouter.get('/config', getAppConfig);
systemRouter.post('/config/update', adminAuth, updateAppConfig);
systemRouter.post('/config/reset-delivery-fee', adminAuth, resetDeliveryFee);

systemRouter.get('/voucher/list', listVouchers);
systemRouter.post('/voucher/add', adminAuth, addVoucher);
systemRouter.post('/voucher/update', adminAuth, updateVoucher);
systemRouter.post('/voucher/delete', adminAuth, deleteVoucher);
systemRouter.post('/newsletter/subscribe', subscribeNewsletter);

systemRouter.post('/reset-categories', adminAuth, resetCategories);

export default systemRouter;
