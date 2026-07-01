import { pool } from './database.js';

const createTablesAndSeed = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS custom_cars;
    DROP TABLE IF EXISTS options;

    -- Table to hold all available customization parts
    CREATE TABLE options (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL, -- 'exterior', 'wheels', 'interior'
        name VARCHAR(100) NOT NULL,
        price INT NOT NULL,
        visual_value VARCHAR(100) -- Holds hex codes or image URLs for UI changes
    );

    -- Table to hold the user's saved car creations
    CREATE TABLE custom_cars (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        exterior_id INT REFERENCES options(id),
        wheels_id INT REFERENCES options(id),
        interior_id INT REFERENCES options(id),
        total_price INT NOT NULL
    );
  `;

  const seedOptionsQuery = `
    INSERT INTO options (type, name, price, visual_value) VALUES
    -- Exterior Colors
    ('exterior', 'Midnight Red', 1500, '#8B0000'),
    ('exterior', 'Electric Blue', 1200, '#0000FF'),
    ('exterior', 'Stealth Black', 2000, '#1A1A1A'),
    ('exterior', 'Chrono Silver', 0, '#C0C0C0'), -- Base color

    -- Wheels
    ('wheels', '18" Sport Alloys', 0, 'sport-18'),
    ('wheels', '19" Matte Black Performance', 1800, 'perf-19'),
    ('wheels', '20" Chrome Luxury', 2500, 'lux-20'),

    -- Interior
    ('interior', 'Base Cloth Charcoal', 0, 'charcoal'),
    ('interior', 'Premium Tan Leather', 3000, 'tan-leather'),
    ('interior', 'Alcantara Race Red', 3500, 'alcantara-red');
  `;

  try {
    console.log('🔄 Creating tables...');
    await pool.query(createTablesQuery);
    
    console.log('🌱 Seeding options data...');
    await pool.query(seedOptionsQuery);
    
    console.log('🎉 Database successfully reset and seeded!');
  } catch (err) {
    console.error('❌ Error resetting database:', err);
  } finally {
    await pool.end();
  }
};

createTablesAndSeed();