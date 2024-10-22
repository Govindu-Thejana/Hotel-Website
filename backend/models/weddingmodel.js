import mongoose from 'mongoose';

const weddingSchema = mongoose.Schema(
    {
        packagename:{
            type:String,
            required: true,
        },
        price:{
            type:Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export const wedding = mongoose.model("wedding", weddingSchema);


