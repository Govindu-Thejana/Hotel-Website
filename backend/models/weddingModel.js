import mongoose from 'mongoose';

const weddingSchema = mongoose.Schema(
    {
        packagename: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        Description: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

const wedding = mongoose.model("wedding", weddingSchema);

export default wedding;
