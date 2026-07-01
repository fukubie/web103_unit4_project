import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CarsAPI } from '../services/CarsAPI';

const ViewCars = ({ title }) => {
  const [savedCars, setSavedCars] = useState([]);

  useEffect(() => {
    CarsAPI.getAllCars()
      .then(data => setSavedCars(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="container">
      <hgroup>
        <h1>{title || "Saved Showroom"}</h1>
        <h2>All currently registered custom vehicles in the database.</h2>
      </hgroup>

      {savedCars.length === 0 ? (
        <article style={{ textAlign: 'center' }}>
          <p>No custom configurations saved yet. Go design one!</p>
          <Link to="/" role="button">Start Customizing</Link>
        </article>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {savedCars.map(car => (
            <article key={car.id} style={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ margin: 0 }}>{car.name}</h5>
                <span style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  backgroundColor: car.exterior_visual || '#ccc',
                  border: '2px solid var(--card-border-color)'
                }} />
              </header>
              
              <p>
                <strong>Paint:</strong> {car.exterior_name}<br />
                <strong>Wheels:</strong> {car.wheels_name}<br />
                <strong>Interior:</strong> {car.interior_name}
              </p>

              <footer>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                    ${car.total_price.toLocaleString()}
                  </span>
                  <Link to={`/customcars/${car.id}`} role="button" className="outline contrast" style={{ padding: '4px 12px', fontSize: '0.85em' }}>
                    Details
                  </Link>
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default ViewCars;