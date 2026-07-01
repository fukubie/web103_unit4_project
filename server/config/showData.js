import { pool } from './database.js';

const displayTableData = async () => {
    try {
        console.log('\n🔍 Fetching data from Render PostgreSQL...\n');
        
        // Execute the exact SQL command your rubric asked for
        const results = await pool.query('SELECT * FROM custom_cars;');
        
        // Print it as a formatted table in the terminal
        console.table(results.rows);

    } catch (err) {
        console.error('❌ Error fetching data:', err);
    } finally {
        // Close the connection so the script finishes successfully
        await pool.end();
    }
};

displayTableData();