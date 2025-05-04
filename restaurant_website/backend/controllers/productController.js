import Product from '../models/product.js';
import { v4 as uuidv4 } from 'uuid';

// Function to create a new product
export const createProduct = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { name, description, price, category, image } = req.body;
        if (!name || !description || !price || !category || !image) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        if (isNaN(Number(price))) {
            return res.status(400).json({ success: false, message: 'Invalid price. Please enter a valid number.' });
        }

        const productId = uuidv4();
        const product = new Product({
            productId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.image
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Product added successfully', product });
    } catch (error) {
        console.error('Error creating product:', error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ success: false, message: 'Validation error', details: error.errors });
        } else {
            res.status(500).json({ success: false, message: 'Failed to create product' });
        }
    }
};
// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
};

// Get a product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch product' });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            image: req.body.image // Update image URL directly
        };

        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Failed to update product' });
    }
};


// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete product' });
    }
};