const API_URL = 'http://localhost:3000/api';

export const CarsAPI = {
    // Get all available options (colors, wheels, etc.)
    getOptions: async () => {
        const response = await fetch(`${API_URL}/options`);
        if (!response.ok) throw new Error('Failed to fetch customization options');
        return response.json();
    },

    // Get all user-saved cars
    getAllCars: async () => {
        const response = await fetch(`${API_URL}/cars`);
        if (!response.ok) throw new Error('Failed to fetch custom cars');
        return response.json();
    },

    // Get a specific saved car's details
    getCarById: async (id) => {
        const response = await fetch(`${API_URL}/cars/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch car with id ${id}`)
        return response.json()
    },

    // Save a brand new car configuration
    createCar: async (carData) => {
        const response = await fetch(`${API_URL}/cars`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(carData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create a custom car');
        return data;
    },

    // Update a saved car configuration
    updateCar: async (id, carData) => {
        const response = await fetch(`${API_URL}/cars/${id}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(carData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to update custom car');
        return data;
    },

    // Delete a saved car configuration
    deleteCar: async (id) => {
        const response = await fetch(`${API_URL}/cars/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete custom car');
        return response.json();
    }
};