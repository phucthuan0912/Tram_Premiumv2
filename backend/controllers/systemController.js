import categoryModel from '../models/categoryModel.js';
import subCategoryModel from '../models/subCategoryModel.js';
import productModel from '../models/productModel.js';
import bannerModel from '../models/bannerModel.js';
import reviewModel from '../models/reviewModel.js';
import appConfigModel from '../models/appConfigModel.js';
import voucherModel from '../models/voucherModel.js';
import logAction from '../utils/logger.js';
import nodemailer from 'nodemailer';
import validator from 'validator';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readEnvValue = (key) => String(process.env[key] || '').trim().replace(/^"|"$/g, '');

const getNewsletterTransporter = () => {
    const emailUser = readEnvValue('EMAIL_USER');
    const emailPass = readEnvValue('EMAIL_PASS');

    if (!emailUser || !emailPass) {
        return null;
    }

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
};
// --- System Configuration ---
const getAppConfig = async (req, res) => {
    try {
        let config = await appConfigModel.findOne();
        if (!config) {
            config = new appConfigModel({ deliveryFee: 0 });
            await config.save();
        }
        res.json({ success: true, config });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateAppConfig = async (req, res) => {
    try {
        const { deliveryFee } = req.body;
        let config = await appConfigModel.findOne();
        if (!config) {
            config = new appConfigModel({ deliveryFee });
        } else {
            config.deliveryFee = deliveryFee;
        }
        await config.save();

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'SYSTEM_UPDATE', `Updated delivery fee to ${deliveryFee}`, null);
        }

        res.json({ success: true, message: 'Settings updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- Voucher Management ---
const addVoucher = async (req, res) => {
    try {
        const { code, discountPercent, description, showAsHot, isActive } = req.body;
        const voucher = new voucherModel({
            code,
            discountPercent,
            description,
            showAsHot,
            isActive,
            date: Date.now()
        });
        await voucher.save();

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'VOUCHER_ADD', `Added voucher ${code}`, voucher._id);
        }

        res.json({ success: true, message: 'Voucher added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listVouchers = async (req, res) => {
    try {
        const vouchers = await voucherModel.find({}).sort({ date: -1 });
        res.json({ success: true, vouchers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateVoucher = async (req, res) => {
    try {
        const { id, code, discountPercent, description, showAsHot, isActive } = req.body;
        await voucherModel.findByIdAndUpdate(id, {
            code,
            discountPercent,
            description,
            showAsHot,
            isActive
        });

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'VOUCHER_UPDATE', `Updated voucher ${code || id}`, id);
        }

        res.json({ success: true, message: 'Voucher updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.body;
        await voucherModel.findByIdAndDelete(id);

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'VOUCHER_DELETE', `Deleted voucher ${id}`, id);
        }

        res.json({ success: true, message: 'Voucher deleted' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const subscribeNewsletter = async (req, res) => {
    try {
        const rawEmail = String(req.body?.email || '').trim().toLowerCase();
        const emailUser = readEnvValue('EMAIL_USER');
        const transporter = getNewsletterTransporter();

        if (!validator.isEmail(rawEmail)) {
            return res.json({ success: false, message: 'Please enter a valid email address' });
        }

        if (!emailUser || !transporter) {
            return res.json({ success: false, message: 'Newsletter email service is not configured yet' });
        }

        const subscribeVoucher =
            (await voucherModel.findOne({ code: 'SUBSCRIBE', isActive: true }).lean()) ||
            (await voucherModel.findOne({ code: { $regex: /^SUBSCRIBE$/i }, isActive: true }).lean());

        const voucherCode = subscribeVoucher?.code || 'SUBSCRIBE';
        const discountText = subscribeVoucher?.discountPercent
            ? `${subscribeVoucher.discountPercent}% OFF`
            : 'exclusive subscriber offer';
        const voucherDescription =
            subscribeVoucher?.description ||
            'Use this welcome code on your next order after it is activated in admin.';

        const html = `
            <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.7;max-width:640px;margin:0 auto;padding:24px;background:#fffaf5">
                <p style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#94a3b8;margin:0 0 12px">PHUC THUAN AI</p>
                <h2 style="margin:0 0 14px;font-size:28px;color:#0f172a">Cảm ơn bạn đã đăng ký!</h2>
                <p style="margin:0 0 16px;font-size:15px;color:#475569">
                    Chúng tôi rất vui khi bạn quan tâm đến các tài khoản premium AI & Tools của chúng tôi.
                </p>

                <div style="margin:22px 0;padding:20px 22px;border:1px solid #fed7aa;border-radius:20px;background:#fff7ed">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#0f172a">📱 Liên hệ ngay để mua hàng:</p>
                    <div style="margin:14px 0">
                        <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#0f172a">
                            Zalo: <a href="https://zalo.me/0327906061" style="color:#0066cc;text-decoration:none">0327906061</a>
                        </p>
                        <p style="margin:0;font-size:14px;color:#475569">
                            Quét mã QR bên dưới để liên hệ trực tiếp qua Zalo
                        </p>
                    </div>
                    
                    <div style="text-align:center;margin:16px 0">
                        <img src="cid:zalo_qr" alt="Zalo QR Code" style="max-width:200px;border-radius:12px;border:2px solid #fed7aa" />
                    </div>
                </div>

                <p style="margin:0 0 12px;font-size:14px;color:#475569">
                    Chúng tôi cung cấp các tài khoản premium: AI Tools, Design Software, Streaming Services với giá tốt nhất thị trường.
                </p>
                <p style="margin:0;font-size:14px;color:#475569">
                    PHUC THUAN AI Team
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: `"PHUC THUAN AI" <${emailUser}>`,
            to: rawEmail,
            subject: 'Thông tin liên hệ - PHUC THUAN AI',
            html,
            attachments: [
                {
                    filename: 'zalo_qr.jpg',
                    path: path.join(__dirname, '..', 'assets', 'zalo_qr.jpg'),
                    cid: 'zalo_qr'
                }
            ]
        });

        res.json({
            success: true,
            message: 'Thông tin liên hệ đã được gửi về email của bạn'
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// --- Database Seeding/Reset ---
const resetCategories = async (req, res) => {
    try {
        // 1. Delete ALL existing data for a clean slate
        await Promise.all([
            categoryModel.deleteMany({}),
            subCategoryModel.deleteMany({}),
            productModel.deleteMany({}),
            bannerModel.deleteMany({}),
            reviewModel.deleteMany({})
        ]);

        const structure = [
            {
                name: 'Nam',
                subs: ['Áo thun', 'Áo Polo', 'Áo sơ mi', 'Quần Jeans', 'Quần Tây/Khaki', 'Đồ thể thao Enthusiast']
            },
            {
                name: 'Nữ',
                subs: ['Váy & Đầm', 'Áo kiểu & Croptop', 'Chân váy', 'Quần Nữ', 'Đồ lót & Đồ ngủ']
            },
            {
                name: 'Trẻ em',
                subs: ['Đồ bé trai', 'Đồ bé gái']
            },
            {
                name: 'Phụ kiện',
                subs: ['Túi xách & Balo', 'Giày dép', 'Đồng hồ & Kính mắt']
            }
        ];

        for (const catData of structure) {
            const category = new categoryModel({
                name: catData.name,
                image: "", 
                status: true
            });
            await category.save();

            for (const subName of catData.subs) {
                const subCategory = new subCategoryModel({
                    name: subName,
                    categoryId: category._id,
                    status: true
                });
                await subCategory.save();
            }
        }

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'SYSTEM_RESET', 'Resetted categories to professional fashion structure', null);
        }

        res.json({ success: true, message: 'Categories resetted to professional fashion structure' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const resetDeliveryFee = async (req, res) => {
    try {
        // Force update delivery fee to 0
        let config = await appConfigModel.findOne();
        if (!config) {
            config = new appConfigModel({ deliveryFee: 0 });
        } else {
            config.deliveryFee = 0;
        }
        await config.save();

        if (req.adminEmail) {
            await logAction(req.adminEmail, req.adminName, 'SYSTEM_UPDATE', 'Reset delivery fee to 0 (Free Shipping)', null);
        }

        res.json({ success: true, message: 'Delivery fee has been reset to 0 (Free Shipping)' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { getAppConfig, updateAppConfig, addVoucher, listVouchers, updateVoucher, deleteVoucher, resetCategories, subscribeNewsletter, resetDeliveryFee };
