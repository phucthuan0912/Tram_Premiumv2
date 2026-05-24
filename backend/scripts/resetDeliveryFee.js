import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const appConfigSchema = new mongoose.Schema({
    deliveryFee: { type: Number, required: true, default: 0 },
});

const AppConfig = mongoose.models.appconfig || mongoose.model('appconfig', appConfigSchema);

const resetDeliveryFee = async () => {
    try {
        // Connect to MongoDB
        const mongodbUrl = process.env.MONGODB_URI;
        if (!mongodbUrl) {
            console.error('❌ MONGODB_URI not found in .env file');
            process.exit(1);
        }

        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(mongodbUrl);
        console.log('✅ Connected to MongoDB');

        // Update or create config with deliveryFee = 0
        const result = await AppConfig.findOneAndUpdate(
            {},
            { deliveryFee: 0 },
            { upsert: true, new: true }
        );

        console.log('✅ Delivery fee has been reset to 0 (Free Shipping)');
        console.log('📦 Current config:', result);

        // Disconnect
        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        console.log('🎉 Done! Delivery fee is now FREE (0 VND)');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

resetDeliveryFee();
