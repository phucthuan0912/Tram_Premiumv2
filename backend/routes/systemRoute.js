import express from 'express';
import { resetCategories } from '../controllers/systemController.js';
import adminAuth from '../middleware/adminAuth.js';

const systemRouter = express.Router();

systemRouter.post('/reset-categories', adminAuth, resetCategories);

export default systemRouter;
