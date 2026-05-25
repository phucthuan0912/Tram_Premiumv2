import mongoose from 'mongoose';
import 'dotenv/config';

const testProducts = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');
        
        console.log('📊 Checking products collection...\n');
        
        const count = await productsCollection.countDocuments();
        console.log(`Total products: ${count}`);
        
        if (count === 0) {
            console.log('\n⚠️  WARNING: No products found in database!');
            console.log('   Please add products through admin panel or import data.');
        } else {
            console.log('\n✅ Products exist in database');
            
            // Show sample products
            const samples = await productsCollection.find().limit(5).toArray();
            console.log('\n📦 Sample products:');
            samples.forEach((p, i) => {
                console.log(`  ${i + 1}. ${p.name} - ${p.price} VND`);
            });
        }
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

testProducts();
