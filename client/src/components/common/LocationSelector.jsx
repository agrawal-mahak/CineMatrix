import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCity } from '../../store/movieSlice';
import { MapPin, ChevronDown, Check, Compass, Loader2 } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'Mumbai', icon: '🏙️' },
  { name: 'Delhi', icon: '🏛️' },
  { name: 'Bengaluru', icon: '💻' },
  { name: 'Hyderabad', icon: '🏰' },
  { name: 'Pune', icon: '🎓' },
  { name: 'Chennai', icon: '🏖️' },
  { name: 'Kolkata', icon: '🌉' },
  { name: 'Ratlam', icon: '🚉' },
  { name: 'Indore', icon: '🍧' },
  { name: 'Bhopal', icon: '🏞️' },
  { name: 'Ahmedabad', icon: '🪁' },
  { name: 'Jaipur', icon: '🏰' },
  { name: 'Chandigarh', icon: '🌿' },
  { name: 'Lucknow', icon: '🕌' },
];

const LocationSelector = () => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.movies.selectedCity);
  const [isOpen, setIsOpen] = useState(false);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');
  const [customCitiesList, setCustomCitiesList] = useState(POPULAR_CITIES);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLoadingGeo(true);
    setGeoMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let detectedCity = '';

        try {
          // Primary reverse geocoding API
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          detectedCity = data.city || data.locality || data.principalSubdivision;

          // Secondary Nominatim fallback if primary doesn't return locality
          if (!detectedCity) {
            const nomRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const nomData = await nomRes.json();
            detectedCity =
              nomData.address?.city ||
              nomData.address?.town ||
              nomData.address?.district ||
              nomData.address?.county ||
              nomData.address?.state_district;
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }

        if (detectedCity) {
          // Format city name cleanly (e.g. "Ratlam", "Indore", "Mumbai")
          const cleanCityName = detectedCity.trim();

          // Add to cities dropdown list if not already present
          setCustomCitiesList((prev) => {
            const exists = prev.some((c) => c.name.toLowerCase() === cleanCityName.toLowerCase());
            if (!exists) {
              return [{ name: cleanCityName, icon: '📍' }, ...prev];
            }
            return prev;
          });

          dispatch(setSelectedCity(cleanCityName));
          setGeoMessage(`📍 Location detected: ${cleanCityName}`);
        } else {
          // IP-based fallback if GPS reverse lookup failed
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipData = await ipRes.json();
            if (ipData.city) {
              dispatch(setSelectedCity(ipData.city));
              setGeoMessage(`📍 Detected via IP: ${ipData.city}`);
            } else {
              setGeoMessage('Could not pinpoint exact city name.');
            }
          } catch {
            setGeoMessage('Could not determine location automatically.');
          }
        }

        setLoadingGeo(false);
        setTimeout(() => {
          setIsOpen(false);
          setGeoMessage('');
        }, 1500);
      },
      (error) => {
        console.error('Geolocation Permission Error:', error);
        setLoadingGeo(false);
        setGeoMessage('Location access denied by browser.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary/80 hover:bg-surface-secondary text-gray-200 hover:text-white border border-white/10 text-xs sm:text-sm font-medium transition-all shadow-md"
        title="Select City Location"
      >
        <MapPin className="w-4 h-4 text-brand-primary animate-pulse" />
        <span>{selectedCity}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#141A29] border border-white/10 rounded-2xl shadow-2xl z-50 py-2 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          {/* Detect Device Location Button */}
          <div className="px-3 py-2 border-b border-white/10">
            <button
              onClick={handleDetectLocation}
              disabled={loadingGeo}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-brand-primary/30 text-xs font-bold transition-all disabled:opacity-50"
            >
              {loadingGeo ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Detecting Precise GPS Location...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Detect My Exact Location</span>
                </>
              )}
            </button>

            {geoMessage && (
              <p className="text-[11px] font-semibold text-emerald-400 text-center mt-1.5 leading-snug">
                {geoMessage}
              </p>
            )}
          </div>

          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Popular Cities
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {customCitiesList.map((city) => {
              const isSelected = city.name.toLowerCase() === selectedCity.toLowerCase();
              return (
                <button
                  key={city.name}
                  onClick={() => {
                    dispatch(setSelectedCity(city.name));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-white/5 transition-colors ${
                    isSelected ? 'text-brand-primary font-bold bg-brand-primary/10' : 'text-gray-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{city.icon || '📍'}</span>
                    <span>{city.name}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
