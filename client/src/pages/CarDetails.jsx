import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarsAPI } from '../services/CarsAPI';

const CarDetails = ({ title }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    CarsAPI.getCarById(id)
      .then(data => setCar(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!car) return <div className="container" style={{ padding: '40px 0' }}><aria-busy aria-label="Loading spec record..."></aria-busy></div>;

  return (
    <main className="container">
      <hgroup>
        <h1>{title || "Vehicle Specifications"}</h1>
        <h2>Comprehensive parts manifest for this custom build.</h2>
      </hgroup>

      <article>
        <header>
          <h3 style={{ margin: 0 }}>{car.name}</h3>
        </header>

        <ul>
          <li><strong>Exterior Paint Finish:</strong> {car.exterior_name}</li>
          <li><strong>Wheel Setup:</strong> {car.wheels_name}</li>
          <li><strong>Cabin Interior Trim:</strong> {car.interior_name}</li>
        </ul>

        <blockquote>
          <h2>Final Configured Value: ${car.total_price.toLocaleString()}</h2>
        </blockquote>

        <footer>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link to={`/edit/${car.id}`} role="button">Edit Setup</Link>
            <Link to="/customcars" role="button" className="secondary outline">Back to Gallery</Link>
          </div>
        </footer>
      </article>
    </main>
  );
};

export default CarDetails;