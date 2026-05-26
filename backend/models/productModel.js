import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name:        { type: String,  required: true },
    description: { type: String,  required: true },
    price:       { type: Number,  required: true },
    oldPrice:    { type: Number,  default: 0 },
    image:       { type: Array,   default: ['https://via.placeholder.com/600x600?text=No+Image'] },
    category:    { type: String,  required: true },
    subCategory: { type: String,  default: "" },
    sizes:       { type: Array,   default: []    },
    colors:      { type: Array,   default: []    },
    duration:    { type: String,  default: ""    },
    videoUrl:    { type: String,  default: ""    },
    bestseller:  { type: Boolean  },
    stockThreshold: { type: Number, default: 0   },
    ratingAvg:   { type: Number,  default: 0     },
    ratingCount: { type: Number,  default: 0     },
    views:       { type: Number,  default: 0     },
    sold:        { type: Number,  default: 0     },
    date:        { type: Number,  required: true },
})

const productModel = mongoose.models.product || mongoose.model('product', productSchema)

export default productModel