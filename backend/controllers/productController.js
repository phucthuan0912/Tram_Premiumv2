import importBatchModel from '../models/importBatchModel.js';
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';
import subCategoryModel from '../models/subCategoryModel.js';
import reviewModel from '../models/reviewModel.js';
import cartModel from '../models/cartModel.js';
import orderModel from '../models/orderModel.js';
import { v2 as cloudinary } from 'cloudinary';
import logAction from '../utils/logger.js';
import { getTikTokHDLink } from '../utils/tiktok.js';
import { getAvailableStock, normalizeVariantColor } from '../utils/inventory.js';

const addProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, category, subCategory, sizes, colors, videoUrl, bestseller } = req.body;

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        if (!images.length) {
            return res.json({ success: false, message: 'Please upload at least one image' });
        }

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        let parsedSizes = [];
        if (Array.isArray(sizes)) {
            parsedSizes = sizes;
        } else if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch {
                parsedSizes = sizes
                    .replace(/^\[|\]$/g, '')
                    .split(/[,\s]+/)
                    .map((item) => item.replace(/^"|"$/g, '').trim())
                    .filter(Boolean);
            }
        }

        if (!Array.isArray(parsedSizes) || !parsedSizes.length) {
            return res.json({ success: false, message: 'Please select at least one size' });
        }

        let parsedColors = [];
        if (Array.isArray(colors)) {
            parsedColors = colors;
        } else if (typeof colors === 'string') {
            try {
                parsedColors = JSON.parse(colors);
            } catch {
                parsedColors = colors.replace(/^\[|\]$/g, '').split(/[,\s]+/).map(i => i.replace(/^"|"$/g, '').trim()).filter(Boolean);
            }
        }

        const productData = {
            name,
            description,
            price: Number(price),
            oldPrice: Number(oldPrice) || 0,
            category,
            subCategory,
            sizes: parsedSizes,
            colors: parsedColors,
            videoUrl: getTikTokHDLink(videoUrl),
            bestseller: bestseller === 'true' ? true : false,
            image: imagesUrl,
            date: Date.now()
        };

        const product = new productModel(productData);
        await product.save();

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'ADD_PRODUCT', `Added new product: ${name}`, product._id);
        }

        res.json({ success: true, message: 'Product Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await productModel.findById(id);
        
        if (product) {
            // Import models for cascade delete
            const reviewModel = (await import('../models/reviewModel.js')).default;
            const importBatchModel = (await import('../models/importBatchModel.js')).default;
            const cartModel = (await import('../models/cartModel.js')).default;
            const orderModel = (await import('../models/orderModel.js')).default;

            // Delete all related data
            await reviewModel.deleteMany({ productId: id });
            await importBatchModel.deleteMany({ productId: id.toString() });
            await cartModel.updateMany(
                { 'items.productId': id },
                { $pull: { items: { productId: id } } }
            );
            await orderModel.updateMany(
                { 'items._id': id },
                { $pull: { items: { _id: id } } }
            );

            // Delete product
            await productModel.findByIdAndDelete(id);
            
            if (req.adminEmail) {
                await logAction(req.adminEmail, req.adminName, 'DELETE_PRODUCT', `Deleted product: ${product.name} with all related data`, id);
            }
        }
        res.json({ success: true, message: 'Product and all related data removed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listProducts = async (req, res) => {
    try {
        const products = await productModel.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: 'name',
                    as: 'categoryDetails'
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'subCategory',
                    foreignField: 'name',
                    as: 'subCategoryDetails'
                }
            },
            {
                $addFields: {
                    smartScore: {
                        $add: [
                            { $multiply: [{ $ifNull: ["$ratingAvg", 0] }, 0.4] },
                            { $multiply: [{ $ifNull: ["$sold", 0] }, 0.3] },
                            { $multiply: [{ $ifNull: ["$views", 0] }, 0.2] },
                            { $multiply: ["$price", -0.1] }
                        ]
                    },
                    categoryInfo: { $arrayElemAt: ["$categoryDetails", 0] },
                    subCategoryInfo: { $arrayElemAt: ["$subCategoryDetails", 0] }
                }
            },
            { $sort: { smartScore: -1, date: -1 } },
            {
                $project: {
                    categoryDetails: 0,
                    subCategoryDetails: 0
                }
            }
        ]);
        
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { productId, name, description, price, oldPrice, category, subCategory, sizes, colors, videoUrl, bestseller } = req.body;

        let parsedSizes = [];
        if (Array.isArray(sizes)) {
            parsedSizes = sizes;
        } else if (typeof sizes === 'string') {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch {
                parsedSizes = sizes.replace(/^\[|\]$/g, '').split(/[,\s]+/).map(i => i.replace(/^"|"$/g, '').trim()).filter(Boolean);
            }
        }
        
        let parsedColors = [];
        if (Array.isArray(colors)) {
            parsedColors = colors;
        } else if (typeof colors === 'string') {
            try {
                parsedColors = JSON.parse(colors);
            } catch {
                parsedColors = colors.replace(/^\[|\]$/g, '').split(/[,\s]+/).map(i => i.replace(/^"|"$/g, '').trim()).filter(Boolean);
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (oldPrice !== undefined) updateData.oldPrice = Number(oldPrice);
        if (category) updateData.category = category;
        if (subCategory) updateData.subCategory = subCategory;
        if (parsedSizes.length) updateData.sizes = parsedSizes;
        if (parsedColors.length) updateData.colors = parsedColors;
        if (videoUrl !== undefined) updateData.videoUrl = getTikTokHDLink(videoUrl);
        if (bestseller !== undefined) updateData.bestseller = bestseller === 'true' || bestseller === true;

        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        if (images.length > 0) {
            let imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );
            updateData.image = imagesUrl;
        }

        await productModel.findByIdAndUpdate(productId, updateData);
        await logAction(req.adminEmail, req.adminName, 'UPDATE_PRODUCT', `Updated product: ${name || productId}`, productId);
        res.json({ success: true, message: 'Product Updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const bulkDiscount = async (req, res) => {
    try {
        const { category, subCategory, discountPercent } = req.body;
        
        if (!discountPercent || discountPercent <= 0 || discountPercent >= 100) {
            return res.json({ success: false, message: 'Invalid discount percentage' });
        }

        const filter = {};
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;

        const products = await productModel.find(filter);
        if (products.length === 0) {
            return res.json({ success: false, message: 'Không tìm thấy sản phẩm nào để giảm giá.' });
        }

        const bulkOps = products.map((prod) => {
            const currentPrice = prod.price || 0;
            const originalPrice = (prod.oldPrice === 0 || !prod.oldPrice) ? currentPrice : prod.oldPrice;
            const newPrice = Math.round(originalPrice * ((100 - Number(discountPercent)) / 100));

            return {
                updateOne: {
                    filter: { _id: prod._id },
                    update: {
                        $set: {
                            oldPrice: originalPrice,
                            price: newPrice
                        }
                    }
                }
            };
        });

        if (bulkOps.length > 0) {
            await productModel.bulkWrite(bulkOps);
        }

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'BULK_DISCOUNT', `Applied ${discountPercent}% discount to ${category || 'All'} - ${subCategory || 'All'}`, 'BULK');
        }

        res.json({ success: true, message: `Successfully applied ${discountPercent}% discount` });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Helper: Parse raw product text with improved category/subcategory detection
const parseRawProductText = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const products = [];
    
    const categoryRules = {
        ChatGPT: 'ChatGPT',
        Claude: 'Claude',
        Cursor: 'Cursor',
        Canva: 'Canva',
        CapCut: 'CapCut',
        Gemini: 'Gemini',
        Kling: 'Kling AI',
        Veo: 'Google Veo',
        YouTube: 'YouTube',
        Nord: 'NordVPN',
        HMA: 'HMA',
        Duolingo: 'Duolingo',
        TradingView: 'TradingView',
        Adobe: 'Adobe',
        Microsoft: 'Microsoft',
        ElevenLabs: 'ElevenLabs',
        Suno: 'Suno AI',
        OpenArt: 'OpenArt',
        Gamma: 'Gamma',
        Meitu: 'Meitu',
        Drive: 'Google Drive',
        ExpressVPN: 'ExpressVPN',
    };
    
    const subCategoryRules = [
        'Plus', 'Pro', 'Premium', 'Team', 'API', 'Request', 
        'Creator', 'Edu', 'Max', 'Family', 'Credit', 'SVIP', 'VPN'
    ];
    
    for (const line of lines) {
        if (!line.includes('—')) continue;
        
        // Remove bullet points
        const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
        
        // Split name and price
        const [left, right] = cleanLine.split('—');
        if (!left || !right) continue;
        
        const name = left.trim();
        
        // Parse price: remove parentheses content, dots, convert k to 000
        let price = right.replace(/\(.*?\)/g, '').trim().toLowerCase();
        price = price.replace(/\./g, '').replace('k', '000');
        price = Number(price) || 0;
        
        if (price === 0) continue;
        
        // Detect category
        let category = 'Khác';
        for (const key in categoryRules) {
            if (name.toLowerCase().includes(key.toLowerCase())) {
                category = categoryRules[key];
                break;
            }
        }
        
        // Detect subcategory
        let subcategory = 'Khác';
        for (const sub of subCategoryRules) {
            if (name.toLowerCase().includes(sub.toLowerCase())) {
                subcategory = sub;
                break;
            }
        }
        
        // Special fallback rules
        if (category === 'TradingView') {
            subcategory = 'Premium';
        }
        if (category === 'HMA' || category === 'NordVPN') {
            subcategory = 'VPN';
        }
        
        // Extract duration
        const durationMatch = name.match(/(\d+[-–]?\d*\s?(ngày|tháng|năm|giờ))/i);
        const duration = durationMatch ? durationMatch[0] : '1 tháng';
        
        // Determine bestseller
        const bestsellerBrands = [
            'ChatGPT', 'Claude', 'Canva', 'CapCut', 
            'Cursor', 'Gemini', 'TradingView'
        ];
        const bestseller = bestsellerBrands.includes(category);
        
        products.push({
            name,
            description: `Tài khoản ${name}`,
            category,
            subCategory: subcategory,
            price,
            oldPrice: Math.round(price * 1.2),
            duration,
            bestseller,
            sizes: ['Default'],
            colors: [],
            image: ['/banner-sponsor.png'], // Default image for bulk import
        });
    }
    
    return products;
};

const parseTextForImport = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.json({ success: false, message: 'Vui lòng nhập dữ liệu' });
        }

        // Get existing metadata for smart matching
        const existingCategories = await categoryModel.find({ status: true }).select('name');
        const existingSubCategories = await subCategoryModel.find({ status: true }).select('name');
        const categoryNames = existingCategories.map(c => c.name.toLowerCase());
        const subCategoryNames = existingSubCategories.map(s => s.name.toLowerCase());

        // Parse products using the improved parser
        const products = parseRawProductText(text);

        if (products.length === 0) {
            return res.json({ success: false, message: 'Không tìm thấy sản phẩm nào trong dữ liệu' });
        }

        // Smart category/subcategory matching with existing database
        const enrichedProducts = products.map(p => {
            // Try to match with existing categories (case-insensitive)
            const matchedCategory = existingCategories.find(
                c => c.name.toLowerCase() === p.category.toLowerCase()
            );
            if (matchedCategory) {
                p.category = matchedCategory.name; // Use exact name from DB
            }

            // Try to match with existing subcategories (case-insensitive)
            const matchedSubCategory = existingSubCategories.find(
                s => s.name.toLowerCase() === p.subCategory.toLowerCase()
            );
            if (matchedSubCategory) {
                p.subCategory = matchedSubCategory.name; // Use exact name from DB
            }

            return p;
        });

        // Check existing products
        const existingProducts = await productModel.find({
            name: { $in: enrichedProducts.map(p => p.name) }
        }).select('name');
        const existingProductNames = new Set(existingProducts.map(p => p.name));

        // Get unique categories and subcategories from parsed data
        const uniqueCategories = [...new Set(enrichedProducts.map(p => p.category))];
        const uniqueSubCategories = [...new Set(enrichedProducts.map(p => p.subCategory).filter(Boolean))];

        // Check which are new
        const existingCategorySet = new Set(existingCategories.map(c => c.name));
        const existingSubCategorySet = new Set(existingSubCategories.map(s => s.name));

        // Mark products as update or new
        const finalProducts = enrichedProducts.map(p => ({
            ...p,
            isUpdate: existingProductNames.has(p.name)
        }));

        // Identify new categories and subcategories
        const newCategories = uniqueCategories.filter(cat => !existingCategorySet.has(cat));
        const newSubCategories = finalProducts
            .filter(p => p.subCategory && !existingSubCategorySet.has(p.subCategory))
            .map(p => ({ name: p.subCategory, category: p.category }))
            .filter((v, i, a) => a.findIndex(t => t.name === v.name && t.category === v.category) === i);

        const summary = {
            total: finalProducts.length,
            newProducts: finalProducts.filter(p => !p.isUpdate).length,
            existingProducts: finalProducts.filter(p => p.isUpdate).length,
        };

        res.json({
            success: true,
            message: `Phân tích thành công ${finalProducts.length} sản phẩm`,
            products: finalProducts,
            newCategories,
            newSubCategories,
            summary
        });
    } catch (error) {
        console.error('Parse Text Error:', error);
        res.json({ success: false, message: 'Lỗi phân tích: ' + error.message });
    }
};

const bulkImport = async (req, res) => {
    try {
        const { products } = req.body;
        if (!products || !Array.isArray(products) || !products.length) {
            return res.json({ success: false, message: 'Không có dữ liệu để import' });
        }

        let createdProducts = 0;
        let updatedProducts = 0;
        let failedProducts = 0;
        let createdCategories = 0;
        let createdSubCategories = 0;
        const errors = [];

        // Get all unique categories and subcategories
        const uniqueCategories = [...new Set(products.map(p => p.category))];
        const uniqueSubCategories = [...new Set(products.map(p => p.subCategory).filter(Boolean))];

        // Create missing categories
        for (const categoryName of uniqueCategories) {
            const existing = await categoryModel.findOne({ name: categoryName });
            if (!existing) {
                await categoryModel.create({
                    name: categoryName,
                    image: '',
                    status: true,
                    date: Date.now()
                });
                createdCategories++;
                console.log(`✅ Created category: ${categoryName}`);
            }
        }

        // Get category IDs for subcategories
        const categoryDocs = await categoryModel.find({ 
            name: { $in: uniqueCategories } 
        });
        const categoryMap = {};
        categoryDocs.forEach(cat => {
            categoryMap[cat.name] = cat._id;
        });

        // Create missing subcategories (avoid duplicates)
        const createdSubCategorySet = new Set();
        for (const product of products) {
            if (!product.subCategory) continue;
            
            const categoryId = categoryMap[product.category];
            if (!categoryId) continue;

            const subCategoryKey = `${product.subCategory}|${categoryId}`;
            if (createdSubCategorySet.has(subCategoryKey)) continue;

            const existing = await subCategoryModel.findOne({ 
                name: product.subCategory,
                categoryId: categoryId
            });

            if (!existing) {
                await subCategoryModel.create({
                    name: product.subCategory,
                    categoryId: categoryId,
                    status: true,
                    date: Date.now()
                });
                createdSubCategories++;
                createdSubCategorySet.add(subCategoryKey);
                console.log(`✅ Created subcategory: ${product.subCategory} (${product.category})`);
            }
        }

        // Import/update products
        for (const product of products) {
            try {
                const existingProduct = await productModel.findOne({ name: product.name });

                const productData = {
                    name: product.name,
                    description: product.description || `Tài khoản ${product.name}`,
                    price: product.price,
                    oldPrice: product.oldPrice || 0,
                    category: product.category,
                    subCategory: product.subCategory || '',
                    duration: product.duration || '',
                    bestseller: product.bestseller || false,
                    sizes: product.sizes || ['Default'],
                    colors: product.colors || [],
                    image: product.image || ['/banner-sponsor.png'], // Default image
                };

                if (existingProduct) {
                    // Update existing product
                    await productModel.findByIdAndUpdate(existingProduct._id, productData);
                    updatedProducts++;
                    console.log(`🔄 Updated: ${product.name}`);
                } else {
                    // Create new product
                    await productModel.create({
                        ...productData,
                        date: Date.now()
                    });
                    createdProducts++;
                    console.log(`✨ Created: ${product.name}`);
                }
            } catch (error) {
                failedProducts++;
                errors.push({ product: product.name, error: error.message });
                console.error(`❌ Failed: ${product.name} - ${error.message}`);
            }
        }

        // Log action
        if (req.adminEmail) {
            await logAction(
                req.adminEmail, 
                req.adminName, 
                'BULK_IMPORT', 
                `Imported ${createdProducts + updatedProducts} products (${createdProducts} new, ${updatedProducts} updated)`,
                'BULK'
            );
        }

        res.json({
            success: true,
            message: `Import thành công: ${createdProducts} sản phẩm mới, ${updatedProducts} sản phẩm cập nhật`,
            details: {
                createdProducts,
                updatedProducts,
                failedProducts,
                createdCategories,
                createdSubCategories,
                errors: errors.length > 0 ? errors : undefined
            }
        });
    } catch (error) {
        console.error('Bulk Import Error:', error);
        res.json({ success: false, message: 'Lỗi hệ thống: ' + error.message });
    }
};

const getInventory = async (req, res) => {
    try {
        const inventory = await importBatchModel.aggregate([
            {
                $project: {
                    productId: { $toObjectId: '$productId' },
                    size: 1,
                    color: 1,
                    remainingQty: 1,
                }
            },
            {
                $group: {
                    _id: {
                        productId: '$productId',
                        size: '$size',
                        color: '$color',
                    },
                    totalStock: { $sum: '$remainingQty' },
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id.productId',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $project: {
                    _id: 0,
                    productId: '$_id.productId',
                    productName: '$productInfo.name',
                    category: '$productInfo.category',
                    subCategory: '$productInfo.subCategory',
                    size: '$_id.size',
                    color: '$_id.color',
                    totalStock: '$totalStock',
                },
            },
        ]);
        res.json({ success: true, inventory });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getProductStock = async (req, res) => {
    try {
        const { id } = req.params;
        const size = String(req.query?.size || '').trim();
        const rawColor = String(req.query?.color || '').trim();
        const totalStock = await getAvailableStock({
            productId: id,
            size: size || undefined,
            color: rawColor ? normalizeVariantColor(rawColor) : undefined,
        });
        
        res.json({ success: true, stock: totalStock });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all metadata for import (categories, subcategories, existing products)
const getImportMetadata = async (req, res) => {
    try {
        // Get all categories
        const categories = await categoryModel.find({ status: true })
            .select('name image')
            .sort({ name: 1 });

        // Get all subcategories with category info
        const subcategories = await subCategoryModel.aggregate([
            { $match: { status: true } },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    name: 1,
                    categoryName: '$categoryInfo.name',
                    categoryId: 1
                }
            },
            { $sort: { categoryName: 1, name: 1 } }
        ]);

        // Get all product names for duplicate checking
        const products = await productModel.find()
            .select('name category subCategory')
            .sort({ name: 1 });

        // Get unique sizes and colors from existing products
        const allSizes = await productModel.distinct('sizes');
        const allColors = await productModel.distinct('colors');

        res.json({
            success: true,
            metadata: {
                categories: categories.map(c => ({ name: c.name, image: c.image })),
                subcategories: subcategories.map(s => ({
                    name: s.name,
                    category: s.categoryName,
                    categoryId: s.categoryId
                })),
                products: products.map(p => ({
                    name: p.name,
                    category: p.category,
                    subCategory: p.subCategory
                })),
                sizes: allSizes.flat().filter((v, i, a) => a.indexOf(v) === i),
                colors: allColors.flat().filter((v, i, a) => a.indexOf(v) === i)
            }
        });
    } catch (error) {
        console.error('Get Import Metadata Error:', error);
        res.json({ success: false, message: error.message });
    }
};

const bulkDeleteProducts = async (req, res) => {
    try {
        const { productIds } = req.body;
        
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.json({ success: false, message: 'No product IDs provided' });
        }

        // Import models for cascade delete
        const reviewModel = (await import('../models/reviewModel.js')).default;
        const importBatchModel = (await import('../models/importBatchModel.js')).default;
        const cartModel = (await import('../models/cartModel.js')).default;
        const orderModel = (await import('../models/orderModel.js')).default;

        // Delete all related data
        const deleteResults = {
            products: 0,
            reviews: 0,
            inventory: 0,
            carts: 0,
            orders: 0
        };

        // 1. Delete reviews
        const reviewResult = await reviewModel.deleteMany({ productId: { $in: productIds } });
        deleteResults.reviews = reviewResult.deletedCount;

        // 2. Delete inventory batches
        const inventoryResult = await importBatchModel.deleteMany({ 
            productId: { $in: productIds.map(id => id.toString()) } 
        });
        deleteResults.inventory = inventoryResult.deletedCount;

        // 3. Remove from carts (remove items, keep cart if empty)
        const cartResult = await cartModel.updateMany(
            { 'items.productId': { $in: productIds } },
            { $pull: { items: { productId: { $in: productIds } } } }
        );
        deleteResults.carts = cartResult.modifiedCount;

        // 4. Remove from orders (remove items, keep order if empty)
        const orderResult = await orderModel.updateMany(
            { 'items._id': { $in: productIds } },
            { $pull: { items: { _id: { $in: productIds } } } }
        );
        deleteResults.orders = orderResult.modifiedCount;

        // 5. Delete products
        const productResult = await productModel.deleteMany({ _id: { $in: productIds } });
        deleteResults.products = productResult.deletedCount;

        if (req.adminEmail) {
            await logAction(
                req.adminEmail, 
                req.adminName, 
                'BULK_DELETE_PRODUCTS', 
                `Deleted ${deleteResults.products} products with cascade: ${deleteResults.reviews} reviews, ${deleteResults.inventory} inventory batches, ${deleteResults.carts} carts updated, ${deleteResults.orders} orders updated`, 
                null
            );
        }

        res.json({ 
            success: true, 
            message: `Deleted ${deleteResults.products} products and all related data`,
            details: deleteResults
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addProduct, removeProduct, singleProduct, listProducts, updateProduct, bulkDiscount, bulkImport, parseTextForImport, getInventory, getProductStock, getImportMetadata, bulkDeleteProducts };
