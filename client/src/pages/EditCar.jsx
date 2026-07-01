import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarsAPI } from '../services/CarsAPI';
import { calculatePrice, checkImpossibleCombo } from '../utilities/carUtils';

const EditCar = ({ title }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [options, setOptions] = useState([]);
  const [carName, setCarName] = useState('');
  const [selectedExterior, setSelectedExterior] = useState('');
  const [selectedWheels, setSelectedWheels] = useState('');
  const [selectedInterior, setSelectedInterior] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([CarsAPI.getOptions(), CarsAPI.getCarById(id)])
      .then(([optionsData, carData]) => {
        setOptions(optionsData);
        setCarName(carData.name);
        setSelectedExterior(carData.exterior_id);
        setSelectedWheels(carData.wheels_id);
        setSelectedInterior(carData.interior_id);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!loading) {
      const validationError = checkImpossibleCombo(selectedExterior, selectedInterior);
      setError(validationError || '');
    }
  }, [selectedExterior, selectedInterior, loading]);

  const currentPrice = calculatePrice(options, selectedExterior, selectedWheels, selectedInterior);
  const selectedExtObj = options.find(o => o.id === parseInt(selectedExterior));

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (error) return;
    if (!carName.trim()) return alert('Build name cannot be blank!');

    try {
      await CarsAPI.updateCar(id, {
        name: carName,
        exterior_id: selectedExterior,
        wheels_id: selectedWheels,
        interior_id: selectedInterior,
        total_price: currentPrice
      });
      navigate('/customcars');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${carName}"?`)) {
      try {
        await CarsAPI.deleteCar(id);
        navigate('/customcars');
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="container" style={{ padding: '40px 0' }}><aria-busy></aria-busy></div>;

  return (
    <main className="container">
      <hgroup>
        <h1>{title || "Modify Specifications"}</h1>
        <h2>Alter component specifications or decommission this customized layout.</h2>
      </hgroup>

      <form onSubmit={handleUpdate}>
        <label htmlFor="carName">
          Build Name
          <input 
            type="text" 
            id="carName"
            value={carName} 
            onChange={(e) => setCarName(e.target.value)} 
            required
          />
        </label>

        <div className="grid" style={{ alignItems: 'center', marginBottom: 'var(--typography-spacing-vertical)' }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            backgroundColor: selectedExtObj?.visual_value || '#ccc',
            border: '3px solid var(--primary-inverse)',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            justifySelf: 'center'
          }} />
          <div>
            <strong>Live Paint Swatch Preview</strong>
          </div>
        </div>

        {error && <mark className="accent-color" style={{ display: 'block', marginBottom: 'var(--spacing)', backgroundColor: '#ffdddd', color: '#b71c1c', borderLeft: '4px solid #b71c1c', padding: '10px' }}>⚠️ {error}</mark>}

        <label htmlFor="exterior">
          Exterior Paint Finish
          <select id="exterior" value={selectedExterior} onChange={(e) => setSelectedExterior(e.target.value)}>
            {options.filter(o => o.type === 'exterior').map(o => (
              <option key={o.id} value={o.id}>{o.name} (+${o.price})</option>
            ))}
          </select>
        </label>

        <label htmlFor="wheels">
          Wheel Package
          <select id="wheels" value={selectedWheels} onChange={(e) => setSelectedWheels(e.target.value)}>
            {options.filter(o => o.type === 'wheels').map(o => (
              <option key={o.id} value={o.id}>{o.name} (+${o.price})</option>
            ))}
          </select>
        </label>

        <label htmlFor="interior">
          Interior Styling
          <select id="interior" value={selectedInterior} onChange={(e) => setSelectedInterior(e.target.value)}>
            {options.filter(o => o.type === 'interior').map(o => (
              <option key={o.id} value={o.id}>{o.name} (+${o.price})</option>
            ))}
          </select>
        </label>

        <blockquote>
          <h3>Updated Price: ${currentPrice.toLocaleString()}</h3>
        </blockquote>

        <div className="grid">
          <button type="submit" disabled={!!error} className={error ? 'secondary' : ''}>
            Save Configuration Changes
          </button>
          <button type="button" className="secondary" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545', color: '#fff' }} onClick={handleDelete}>
            Delete Custom Build
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditCar;