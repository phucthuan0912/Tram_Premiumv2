import mongoose from 'mongoose';
import 'dotenv/config';

const createIndexes = async () => {
    try {
        console.log('Connecting to MongoDB...');
        // Use MONGO_URI instead of MONGODB_URI
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        
        console.log('\n📊 Creating indexes for importBatch collection...');
        
        const importBatchCollection = db.collection('importbatches');
        
        // Drop existing indexes (except _id)
        console.log('Dropping old indexes...');
        const existingIndexes = await importBatchCollection.indexes();
        for (const index of existingIndexes) {
            if (index.name !== '_id_') {
                try {
                    await importBatchCollection.dropIndex(index.name);
                    console.log(`  ✓ Dropped index: ${index.name}`);
                } catch (err) {
                    console.log(`  ⚠ Could not drop index ${index.name}: ${err.message}`);
                }
            }
        }
        
        // Create optimized indexes
        console.log('\nCreating new optimized indexes...');
        
        await importBatchCollection.createIndex(
            { productId: 1, status: 1, remainingQty: 1 },
            { name: 'productId_status_remainingQty' }
        );
        console.log('  ✓ Created index: productId_status_remainingQty');
        
        await importBatchCollection.createIndex(
            { productId: 1, size: 1, color: 1, status: 1, remainingQty: 1 },
            { name: 'productId_size_color_status_remainingQty' }
        );
        console.log('  ✓ Created index: productId_size_color_status_remainingQty');
        
        await importBatchCollection.createIndex(
            { status: 1, remainingQty: 1 },
            { name: 'status_remainingQty' }
        );
        console.log('  ✓ Created index: status_remainingQty');
        
        console.log('\n✅ All indexes created successfully!');
        
        // Show all indexes
        console.log('\n📋 Current indexes:');
        const newIndexes = await importBatchCollection.indexes();
        newIndexes.forEach(index => {
            console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
        });
        
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error creating indexes:', error);
        process.exit(1);
    }
};

createIndexes();
