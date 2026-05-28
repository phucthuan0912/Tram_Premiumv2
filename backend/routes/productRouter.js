import express from 'express';
import { listProducts, addProduct, removeProduct, singleProduct, updateProduct, bulkDiscount, bulkImport, parseTextForImport, getInventory, getProductStock, getImportMetadata, bulkDeleteProducts } from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';
const productRouter = express.Router();

productRouter.post('/add',adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/bulk-delete', adminAuth, bulkDeleteProducts);
productRouter.post('/update', adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), updateProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

productRouter.post('/bulk-discount', adminAuth, bulkDiscount);
productRouter.post('/parse-text', adminAuth, parseTextForImport);
productRouter.post('/bulk-import', adminAuth, bulkImport);
productRouter.get('/import-metadata', adminAuth, getImportMetadata);
productRouter.get('/inventory', adminAuth, getInventory);
productRouter.get('/stock/:id', getProductStock);

export default productRouter;
