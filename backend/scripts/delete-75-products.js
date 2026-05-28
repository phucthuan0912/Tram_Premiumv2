import mongoose from 'mongoose';
import productModel from '../models/productModel.js';
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
        console.log('Product IDs:', productIds.map(id => id.toString()).join(', '));

        // Delete them
        const result = await productModel.deleteMany({ _id: { $in: productIds } });
        
        console.log(`✓ Deleted ${result.deletedCount} products successfully`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

deleteProducts();
