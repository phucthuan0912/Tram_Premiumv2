import subCategoryModel from '../models/subCategoryModel.js';

// Add SubCategory
const addSubCategory = async (req, res) => {
    try {
        const { name, categoryId, status } = req.body;

        const subCategoryData = {
            name,
            categoryId,
            status: status === 'true' || status === true,
            date: Date.now()
        };

        const subCategory = new subCategoryModel(subCategoryData);
        await subCategory.save();

        res.json({ success: true, message: 'SubCategory Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List SubCategories
const listSubCategories = async (req, res) => {
    try {
        const subCategories = await subCategoryModel.find({}).populate('categoryId', 'name').sort({ date: -1 });
        res.json({ success: true, subCategories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove SubCategory
const removeSubCategory = async (req, res) => {
    try {
        await subCategoryModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: 'SubCategory Removed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update SubCategory Status
const updateSubCategoryStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        await subCategoryModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: 'Status Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addSubCategory, listSubCategories, removeSubCategory, updateSubCategoryStatus };
