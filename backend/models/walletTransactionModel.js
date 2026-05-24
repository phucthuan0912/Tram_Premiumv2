import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        type: { type: String, enum: ['Credit', 'Debit'], required: true }, // Credit = Tiền vào, Debit = Tiền ra
        amount: { type: Number, required: true },
        description: { type: String, required: true }, // VD: "Hoàn tiền Đơn hàng #1234", "Thanh toán Đơn hàng #5678"
        date: { type: Number, required: true, default: Date.now },
        relatedOrderId: { type: String, default: null } // Optional
    },
    { minimize: false }
);

const walletTransactionModel = mongoose.models.walletTransaction || mongoose.model('walletTransaction', walletTransactionSchema);
export default walletTransactionModel;
