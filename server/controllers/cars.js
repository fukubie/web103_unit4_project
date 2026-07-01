import { pool } from '../config/database.js';

// 1. GET all available customization options (colors, wheels, etc.)
export const getOptions = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM options ORDER BY type, id ASC');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET all user-saved custom cars (with joined option details)
export const getAllCars = async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.name, c.total_price,
             ext.name AS exterior_name, ext.visual_value AS exterior_visual,
             wh.name AS wheels_name, wh.visual_value AS wheels_visual,
             int.name AS interior_name, int.visual_value AS interior_visual
      FROM custom_cars c
      JOIN options ext ON c.exterior_id = ext.id
      JOIN options wh ON c.wheels_id = wh.id
      JOIN options int ON c.interior_id = int.id
      ORDER BY c.id DESC
    `;
    const results = await pool.query(query);
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. GET a single custom car by ID
export const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT c.id, c.name, c.total_price,
             c.exterior_id, c.wheels_id, c.interior_id,
             ext.name AS exterior_name, wh.name AS wheels_name, int.name AS interior_name
      FROM custom_cars c
      JOIN options ext ON c.exterior_id = ext.id
      JOIN options wh ON c.wheels_id = wh.id
      JOIN options int ON c.interior_id = int.id
      WHERE c.id = $1
    `;
    const results = await pool.query(query, [id]);
    if (results.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. CREATE a new custom car configuration
export const createCar = async (req, res) => {
  const { name, exterior_id, wheels_id, interior_id, total_price } = req.body;
  
  // Stretch Goal Rule check: "Stealth Black" exterior combined with "Alcantara Race Red" interior is impossible
  if (parseInt(exterior_id) === 3 && parseInt(interior_id) === 10) {
    return res.status(400).json({ 
      error: "Impossible Combo! Stealth Black exterior cannot be paired with Alcantara Race Red interior due to material constraints." 
    });
  }

  try {
    const query = `
      INSERT INTO custom_cars (name, exterior_id, wheels_id, interior_id, total_price)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const results = await pool.query(query, [name, exterior_id, wheels_id, interior_id, total_price]);
    res.status(201).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. UPDATE an existing custom car configuration
export const updateCar = async (req, res) => {
  const { id } = req.params;
  const { name, exterior_id, wheels_id, interior_id, total_price } = req.body;

  if (parseInt(exterior_id) === 3 && parseInt(interior_id) === 10) {
    return res.status(400).json({ 
      error: "Impossible Combo! Stealth Black exterior cannot be paired with Alcantara Race Red interior." 
    });
  }

  try {
    const query = `
      UPDATE custom_cars 
      SET name = $1, exterior_id = $2, wheels_id = $3, interior_id = $4, total_price = $5
      WHERE id = $6 RETURNING *
    `;
    const results = await pool.query(query, [name, exterior_id, wheels_id, interior_id, total_price, id]);
    if (results.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. DELETE a custom car
export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query('DELETE FROM custom_cars WHERE id = $1 RETURNING *', [id]);
    if (results.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};