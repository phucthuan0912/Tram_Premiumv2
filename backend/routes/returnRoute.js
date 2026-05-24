import express from 'express';
import { requestReturn, listReturns, userReturns, updateReturnStatus } from '../controllers/returnController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const returnRouter = express.Router();

returnRouter.post('/request', upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), authUser, requestReturn);

returnRouter.post('/user-returns', authUser, userReturns);

returnRouter.post('/list', adminAuth, listReturns);
returnRouter.post('/status', adminAuth, updateReturnStatus);

export default returnRouter;
