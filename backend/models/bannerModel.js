import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    status: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    date: { type: Number, default: Date.now }
});

const bannerModel = mongoose.models.banner || mongoose.model('banner', bannerSchema);

export default bannerModel;
