import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarsAPI } from '../services/CarsAPI';
import { calculatePrice, checkImpossibleCombo } from '../utilities/carUtils';

const CreateCar = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [carName, setCarName] = useState('');
  
  // State for active design category tab
  const [activeTab, setActiveTab] = useState('exterior');
  
  // Custom selections matching the user choices
  const [selectedExterior, setSelectedExterior] = useState('');
  const [selectedWheels, setSelectedWheels] = useState('');
  const [selectedInterior, setSelectedInterior] = useState('');
  const [isConvertible, setIsConvertible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    CarsAPI.getOptions()
      .then(data => {
        setOptions(data);
        const ext = data.find(o => o.type === 'exterior');
        const wh = data.find(o => o.type === 'wheels');
        const int = data.find(o => o.type === 'interior');
        if (ext) setSelectedExterior(ext.id);
        if (wh) setSelectedWheels(wh.id);
        if (int) setSelectedInterior(int.id);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  useEffect(() => {
    const validationError = checkImpossibleCombo(selectedExterior, selectedInterior);
    setError(validationError || '');
  }, [selectedExterior, selectedInterior]);

  // Dynamic pricing updates (with extra $5,000 convertible premium if checked)
  const baseCalculatedPrice = calculatePrice(options, selectedExterior, selectedWheels, selectedInterior);
  const currentPrice = isConvertible ? baseCalculatedPrice + 5000 : baseCalculatedPrice;

  const currentTabOptions = options.filter(o => o.type === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (error) return alert('Please resolve impossible combinations first!');
    if (!carName.trim()) return alert('Please give your car a name!');

    try {
      await CarsAPI.createCar({
        name: carName + (isConvertible ? " (Convertible)" : ""),
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

  return (
    <div className="create-car">
      {/* Convertible Toggle Row */}
      <label>
        <input 
          type="checkbox" 
          id="isconvertible" 
          checked={isConvertible} 
          onChange={(e) => setIsConvertible(e.target.checked)}
        />
        Convertible
      </label>

      {error && <div style={{ color: '#dc3545', margin: '10px 0', fontWeight: 'bold' }}>⚠️ {error}</div>}

      <div className="create-car-options">
        {/* Category Navigation Bar Tabs */}
        <div id="customization-options" className="car-options" style={{ display: 'flex', gap: '10px', flexDirection: 'row', width: '100%', marginBottom: '15px' }}>
          <div id="car-options" style={{ flex: 1 }}>
            <button type="button" className={activeTab === 'exterior' ? 'active' : ''} style={{ width: '100%' }} onClick={() => setActiveTab('exterior')}>exterior</button>
          </div>
          <div id="car-options" style={{ flex: 1 }}>
            <button type="button" className={activeTab === 'wheels' ? 'active' : ''} style={{ width: '100%' }} onClick={() => setActiveTab('wheels')}>wheels</button>
          </div>
          <div id="car-options" style={{ flex: 1 }}>
            <button type="button" className={activeTab === 'interior' ? 'active' : ''} style={{ width: '100%' }} onClick={() => setActiveTab('interior')}>interior</button>
          </div>
        </div>

        {/* Dynamic Inner Selection Area */}
        <div style={{ padding: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {currentTabOptions.map(option => {
            const isSelected = 
              (activeTab === 'exterior' && selectedExterior === option.id) ||
              (activeTab === 'wheels' && selectedWheels === option.id) ||
              (activeTab === 'interior' && selectedInterior === option.id);

            return (
              <button
                key={option.id}
                type="button"
                className={isSelected ? 'outline' : 'secondary outline'}
                style={{
                  borderColor: isSelected ? 'var(--primary)' : '',
                  backgroundColor: activeTab === 'exterior' ? option.visual_value : ''
                }}
                onClick={() => {
                  if (activeTab === 'exterior') setSelectedExterior(option.id);
                  if (activeTab === 'wheels') setSelectedWheels(option.id);
                  if (activeTab === 'interior') setSelectedInterior(option.id);
                }}
              >
                {option.name} (+${option.price})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Price Display */}
      <div className="create-car-price">
        💰${currentPrice.toLocaleString()}
      </div>

      {/* Save Action Elements Footer */}
      <div className="create-car-name">
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          placeholder="My New Car" 
        />
        <input 
          type="submit" 
          className="create-car-button" 
          value="Create" 
          onClick={handleSubmit}
          disabled={!!error}
        />
      </div>
    </div>
  );
};

export default CreateCar;