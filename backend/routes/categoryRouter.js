import express from 'express';
import { addCategory, listCategories, removeCategory, updateCategoryStatus } from '../controllers/categoryController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const categoryRouter = express.Router();

categoryRouter.post('/add', adminAuth, upload.single('image'), addCategory);
categoryRouter.get('/list', listCategories);
categoryRouter.post('/remove', adminAuth, removeCategory);
categoryRouter.post('/status', adminAuth, updateCategoryStatus);

export default categoryRouter;
