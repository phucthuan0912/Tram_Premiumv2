import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
import reviewModel from '../models/reviewModel.js';
import importBatchModel from '../models/importBatchModel.js';
import cartModel from '../models/cartModel.js';
import orderModel from '../models/orderModel.js';
import dotenv from 'dotenv';

dotenv.config();

const deleteProducts = async () => {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI not found in .env');
        }
        
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Get first 75 products
        const products = await productModel.find({}).limit(75);
        const productIds = products.map(p => p._id);

        console.log(`Found ${productIds.length} products to delete`);

        // Delete cascade
        console.log('Deleting reviews...');
        const reviewResult = await reviewModel.deleteMany({ productId: { $in: productIds } });
        console.log(`  ✓ Deleted ${reviewResult.deletedCount} reviews`);

        console.log('Deleting inventory batches...');
        const inventoryResult = await importBatchModel.deleteMany({ 
            productId: { $in: productIds.map(id => id.toString()) } 
        });
        console.log(`  ✓ Deleted ${inventoryResult.deletedCount} inventory batches`);

        console.log('Removing from carts...');
        const cartResult = await cartModel.updateMany(
            { 'items.productId': { $in: productIds } },
            { $pull: { items: { productId: { $in: productIds } } } }
        );
        console.log(`  ✓ Updated ${cartResult.modifiedCount} carts`);

        console.log('Removing from orders...');
        const orderResult = await orderModel.updateMany(
            { 'items._id': { $in: productIds } },
            { $pull: { items: { _id: { $in: productIds } } } }
        );
        console.log(`  ✓ Updated ${orderResult.modifiedCount} orders`);

        console.log('Deleting products...');
        const productResult = await productModel.deleteMany({ _id: { $in: productIds } });
        console.log(`  ✓ Deleted ${productResult.deletedCount} products`);
        
        console.log('\n✓ All 75 products and related data deleted successfully!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

deleteProducts();
