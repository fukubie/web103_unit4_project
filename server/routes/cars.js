import express from 'express';
import {
    getOptions,
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} from '../controllers/cars.js';

const router = express.Router();

// Route to get all available customization options (colors, wheels, etc.)
router.get('/options', getOptions);

// CRUD routes for saved custom cars
router.get('/cars', getAllCars);
router.get('/cars/:id', getCarById);
router.post('/cars', createCar);
router.patch('/cars/:id', updateCar);
router.delete('/cars/:id', deleteCar);

export default router;