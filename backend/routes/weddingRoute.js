import express from 'express';
import wedding from '../models/weddingmodel.js'; 

const router = express.Router();

// GET all wedding packages
router.get('/', async (req, res) => {
    try {
        const weddings = await wedding.find({});
        res.json(weddings);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET a single wedding package by ID
router.get('/:id', async (req, res) => {
    try {
        const weddingPackage = await wedding.findById(req.params.id);
        if (weddingPackage) {
            res.json(weddingPackage);
        } else {
            res.status(404).json({ message: 'Wedding package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new wedding package
router.post('/', async (req, res) => {
    const { packagename, price,Description } = req.body;

    if (!packagename || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newWedding = new wedding({
            packagename,
            price,
            Description,
        });

        const savedWedding = await newWedding.save();
        res.status(201).json(savedWedding);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT (update) a wedding package by ID
router.put('/:id', async (req, res) => {
    const { packagename, price, Description } = req.body; // Include all fields you want to update

    try {
        const weddingPackage = await wedding.findById(req.params.id);

        if (weddingPackage) {
            // Update only the fields provided in the request
            weddingPackage.packagename = packagename || weddingPackage.packagename;
            weddingPackage.price = price || weddingPackage.price;
            weddingPackage.Description = Description || weddingPackage.Description;

            const updatedWedding = await weddingPackage.save();
            res.json(updatedWedding);
        } else {
            res.status(404).json({ message: 'Wedding package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


// DELETE a wedding package by ID
router.delete('/:id', async (req, res) => {
    try {
        const weddingPackage = await wedding.findByIdAndDelete(req.params.id);

        if (weddingPackage) {
            res.status(200).json({ message: 'Wedding package removed' });
        } else {
            res.status(404).json({ message: 'Wedding package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
