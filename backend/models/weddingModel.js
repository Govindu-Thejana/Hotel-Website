import mongoose from 'mongoose';
import { type } from 'os';

const weddingSchema = mongoose.Schema(
    {
        packagename:{
            type:String,
            required: true,
        },
        price:{
            type:Number,
            required: true,
        },
        Description:{
            type:String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export const wedding = mongoose.model("wedding", weddingSchema);


