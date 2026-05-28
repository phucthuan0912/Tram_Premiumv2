import categoryModel from '../models/categoryModel.js';
import subCategoryModel from '../models/subCategoryModel.js';
import productModel from '../models/productModel.js';
import { v2 as cloudinary } from 'cloudinary';

// Add Category
const addCategory = async (req, res) => {
    try {
        const { name, status } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const result = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            imageUrl = result.secure_url;
        }

        const categoryData = {
            name,
            image: imageUrl,
            status: status === 'true' || status === true,
            date: Date.now()
        };

        const category = new categoryModel(categoryData);
        await category.save();

        res.json({ success: true, message: 'Category Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List Categories
const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ date: -1 });
        res.json({ success: true, categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove Category
const removeCategory = async (req, res) => {
    try {
        const categoryId = req.body.id;
        
        // Remove all products in this category
        await productModel.deleteMany({ category: categoryId });
        
        // Remove all subcategories in this category
        await subCategoryModel.deleteMany({ categoryId });
        
        // Remove the category itself
        await categoryModel.findByIdAndDelete(categoryId);
        
        res.json({ success: true, message: 'Category and all related products removed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update Category Status
const updateCategoryStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        await categoryModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addCategory, listCategories, removeCategory, updateCategoryStatus };
