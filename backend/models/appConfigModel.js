import mongoose from "mongoose";

// A singleton-style collection where we store global configuration
const appConfigSchema = new mongoose.Schema({
    deliveryFee: { type: Number, required: true, default: 0 },
});

const appConfigModel = mongoose.models.appConfig || mongoose.model('appConfig', appConfigSchema);

export default appConfigModel;
