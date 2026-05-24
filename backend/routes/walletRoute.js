import express from 'express';
import { getWalletBalanceAndHistory, createTopUpRequest } from '../controllers/walletController.js';
import authUser from '../middleware/auth.js';

const walletRouter = express.Router();

walletRouter.post('/info', authUser, getWalletBalanceAndHistory);
walletRouter.post('/topup', authUser, createTopUpRequest);

export default walletRouter;
