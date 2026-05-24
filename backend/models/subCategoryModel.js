import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
    status: { type: Boolean, default: true },
    date: { type: Number, default: Date.now }
});

const subCategoryModel = mongoose.models.subCategory || mongoose.model('subCategory', subCategorySchema);

export default subCategoryModel;
