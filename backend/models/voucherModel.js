import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercent: { type: Number, required: true },
    description: { type: String, required: true },
    showAsHot: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    date: { type: Number, required: true }
});

const voucherModel = mongoose.models.voucher || mongoose.model('voucher', voucherSchema);

export default voucherModel;
