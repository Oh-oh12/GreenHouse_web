import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Thermometer, Sun, Droplets, Sprout, Fan, Lightbulb, Droplet, Settings } from 'lucide-react';

export default function DashBoard() {
  // Initialize controls from localStorage
  const getInitialControls = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('controls');
      if (saved) return JSON.parse(saved);
    }
    return { fan: false, light: false, waterPump: false, mode: 'M' };
  };

  const [controls, setControls] = useState(getInitialControls);
  const [sensors, setSensors] = useState({ temp: 0, ldr: 0, soil: 0, humi: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Device ON/OFF codes for Arduino
  const deviceCodes = {
    fan: { on: 1, off: 0 },
    waterPump: { on: 2, off: 3 },
    light: { on: 4, off: 5 }
  };

  // Save controls to localStorage
  useEffect(() => {
    localStorage.setItem('controls', JSON.stringify(controls));
  }, [controls]);

  // Fetch sensor data from backend
  const fetchSensorData = async () => {
    try {
      const res = await fetch('http://127.0.0.1:1880/api/sensor', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      setSensors(prev => ({
        ...prev,
        temp: data.temp || prev.temp,
        humi: data.humi || prev.humi,
        soil: data.soil || prev.soil,
        ldr: data.ldr || prev.ldr
      }));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Toggle device control
  const toggleControl = async (device) => {
    if (controls.mode === 'A') return; // Disable in auto mode

    const newState = !controls[device];
    const newControls = { ...controls, [device]: newState };
    setControls(newControls);
    localStorage.setItem('controls', JSON.stringify(newControls));

    const codeToSend = newState ? deviceCodes[device].on : deviceCodes[device].off;

    try {
      await fetch('http://127.0.0.1:1880/api/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ btn: codeToSend })
      });
    } catch (err) {
      console.error('Error sending button command:', err);
    }
  };

  // Toggle manual/auto mode
  const toggleMode = async () => {
    const newMode = controls.mode === 'M' ? 'A' : 'M';
    const newControls = { ...controls, mode: newMode };
    setControls(newControls);
    localStorage.setItem('controls', JSON.stringify(newControls));

    try {
      await fetch('http://127.0.0.1:1880/api/post-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ btn: newMode })
      });
    } catch (err) {
      console.error('Error sending mode change:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">

        {/* Navigation Bar */}
        <nav className="mb-8 flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h1 className="text-2xl font-bold text-white">Green House</h1>
          <div className="space-x-6">
            <Link to="/" className="text-slate-300 hover:text-white font-semibold">Dashboard</Link>
            <Link to="/history" className="text-slate-300 hover:text-white font-semibold">History</Link>
            <Link to="/about" className="text-slate-300 hover:text-white font-semibold">About Us</Link>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Monitor and control your devices</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Last Update</p>
            <p className="text-white font-semibold">{lastUpdate.toLocaleTimeString()}</p>
            <p className="text-green-400 text-xs mt-1">● Auto-refresh: 5s</p>
          </div>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 bg-opacity-20 p-3 rounded-lg">
                <Thermometer className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Temperature</p>
            <p className="text-3xl font-bold text-white">{sensors.temp}°C</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Light Intensity</p>
            <p className="text-3xl font-bold text-white">{sensors.ldr}%</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                <Sprout className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Soil Moisture</p>
            <p className="text-3xl font-bold text-white">{sensors.soil}%</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 bg-opacity-20 p-3 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-1">Humidity</p>
            <p className="text-3xl font-bold text-white">{sensors.humi}%</p>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Control Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Fan */}
            <button
              onClick={() => toggleControl('fan')}
              disabled={controls.mode === 'A'}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                controls.mode === 'A'
                  ? 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
                  : controls.fan
                  ? 'bg-cyan-500 bg-opacity-20 border-cyan-500 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }`}
            >
              <Fan className={`w-8 h-8 mx-auto mb-3 ${controls.fan ? 'text-cyan-400' : 'text-slate-400'}`} />
              <p className={`font-semibold ${controls.fan ? 'text-cyan-400' : 'text-slate-300'}`}>Fan</p>
              <p className="text-sm mt-1 text-slate-400">{controls.fan ? 'ON' : 'OFF'}</p>
            </button>

            {/* Light */}
            <button
              onClick={() => toggleControl('light')}
              disabled={controls.mode === 'A'}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                controls.mode === 'A'
                  ? 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
                  : controls.light
                  ? 'bg-yellow-500 bg-opacity-20 border-yellow-500 shadow-lg shadow-yellow-500/50'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }`}
            >
              <Lightbulb className={`w-8 h-8 mx-auto mb-3 ${controls.light ? 'text-yellow-400' : 'text-slate-400'}`} />
              <p className={`font-semibold ${controls.light ? 'text-yellow-400' : 'text-slate-300'}`}>Light</p>
              <p className="text-sm mt-1 text-slate-400">{controls.light ? 'ON' : 'OFF'}</p>
            </button>

            {/* Water Pump */}
            <button
              onClick={() => toggleControl('waterPump')}
              disabled={controls.mode === 'A'}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                controls.mode === 'A'
                  ? 'bg-slate-700 border-slate-600 opacity-50 cursor-not-allowed'
                  : controls.waterPump
                  ? 'bg-blue-500 bg-opacity-20 border-blue-500 shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }`}
            >
              <Droplet className={`w-8 h-8 mx-auto mb-3 ${controls.waterPump ? 'text-blue-400' : 'text-slate-400'}`} />
              <p className={`font-semibold ${controls.waterPump ? 'text-blue-400' : 'text-slate-300'}`}>Water Pump</p>
              <p className="text-sm mt-1 text-slate-400">{controls.waterPump ? 'ON' : 'OFF'}</p>
            </button>

            {/* Mode Toggle */}
            <button
              onClick={toggleMode}
              className={`p-6 rounded-xl border-2 transition-all duration-300 md:col-span-2 lg:col-span-1 ${
                controls.mode === 'A'
                  ? 'bg-purple-500 bg-opacity-20 border-purple-500 shadow-lg shadow-purple-500/50'
                  : 'bg-slate-700 border-slate-600 hover:border-slate-500'
              }`}
            >
              <Settings className={`w-8 h-8 mx-auto mb-3 ${controls.mode === 'A' ? 'text-purple-400' : 'text-slate-400'}`} />
              <p className={`font-semibold ${controls.mode === 'A' ? 'text-purple-400' : 'text-slate-300'}`}>Mode</p>
              <p className="text-sm mt-1 text-slate-400">{controls.mode === 'A' ? 'AUTO' : 'MANUAL'}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
