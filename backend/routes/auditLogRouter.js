import express from 'express';
import { getAuditLogs, clearAuditLogs } from '../controllers/auditLogController.js';
import adminAuth from '../middleware/adminAuth.js';

const auditLogRouter = express.Router();

auditLogRouter.get('/list', adminAuth, getAuditLogs);
auditLogRouter.post('/clear', adminAuth, clearAuditLogs);

export default auditLogRouter;
