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
    <div className="create-car" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Premium Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
          Design Your Car
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '0' }}>
          Customize your perfect vehicle
        </p>
      </div>

      {/* Convertible Toggle Card */}
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: '0' }}>
          <input
            type="checkbox"
            id="isconvertible"
            checked={isConvertible}
            onChange={(e) => setIsConvertible(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '1.05rem', fontWeight: '500', color: '#333' }}>
            Convert to Convertible <span style={{ color: '#666', fontSize: '0.95rem' }}>+$5,000</span>
          </span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          color: '#dc3545',
          backgroundColor: '#fff5f5',
          padding: '15px 20px',
          marginBottom: '30px',
          fontWeight: '600',
          borderRadius: '8px',
          border: '2px solid #dc3545',
          fontSize: '0.95rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Customization Section */}
      <div style={{ marginBottom: '45px' }}>
        {/* Modern Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '35px',
          borderBottom: '2px solid #e9ecef'
        }}>
          {['exterior', 'wheels', 'interior'].map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveTab(category)}
              style={{
                padding: '16px 28px',
                fontSize: '1.05rem',
                fontWeight: activeTab === category ? '600' : '500',
                color: activeTab === category ? '#000' : '#888',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === category ? '3px solid #000' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                textTransform: 'capitalize',
                position: 'relative',
                bottom: '-2px',
                marginBottom: '-2px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== category) {
                  e.target.style.color = '#333';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== category) {
                  e.target.style.color = '#888';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Options Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {currentTabOptions.map(option => {
            const isSelected =
              (activeTab === 'exterior' && selectedExterior === option.id) ||
              (activeTab === 'wheels' && selectedWheels === option.id) ||
              (activeTab === 'interior' && selectedInterior === option.id);

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (activeTab === 'exterior') setSelectedExterior(option.id);
                  if (activeTab === 'wheels') setSelectedWheels(option.id);
                  if (activeTab === 'interior') setSelectedInterior(option.id);
                }}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: isSelected ? '2.5px solid #000' : '2px solid #e9ecef',
                  backgroundColor: isSelected ? '#f5f5f5' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.28s ease',
                  boxShadow: isSelected ? '0 10px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transform: isSelected ? 'translateY(-4px)' : 'translateY(0)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = '#d0d0d0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#e9ecef';
                  }
                }}
              >
                {/* Live Paint Swatch for Exterior */}
                {activeTab === 'exterior' && (
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: option.visual_value || '#ccc',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  />
                )}

                {/* Option Details */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#000', marginBottom: '4px' }}>
                    {option.name}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#666', fontWeight: '500' }}>
                    +${option.price.toLocaleString()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Premium Price Display */}
      <div style={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '32px 40px',
        borderRadius: '16px',
        marginBottom: '30px',
        textAlign: 'center',
        boxShadow: '0 16px 48px rgba(0,0,0,0.18)'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>
          Total Price
        </div>
        <div style={{
          fontSize: '3.2rem',
          fontWeight: 'bold',
          letterSpacing: '-1px',
          color: '#fff'
        }}>
          ${currentPrice.toLocaleString()}
        </div>
      </div>

      {/* Car Name & Submit Footer */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          id="name"
          name="name"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          placeholder="e.g., Silver Bullet, Midnight Runner"
          style={{
            flex: 1,
            padding: '14px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            transition: 'all 0.25s ease',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#000';
            e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.05)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e9ecef';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!!error}
          style={{
            padding: '14px 48px',
            fontSize: '1.05rem',
            fontWeight: '600',
            backgroundColor: error ? '#ccc' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: error ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            opacity: error ? 0.6 : 1,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (!error) {
              e.currentTarget.style.backgroundColor = '#333';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.18)';
            }
          }}
          onMouseLeave={(e) => {
            if (!error) {
              e.currentTarget.style.backgroundColor = '#000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          Create Car
        </button>
      </div>
    </div>
  );
};

export default CreateCar;