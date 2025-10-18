import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Thermometer, Droplets, Sprout, Sun, Calendar, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:1880/api/data")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (value, type) => {
    if (type === 'temp') {
      if (value < 20) return 'text-blue-400';
      if (value > 30) return 'text-red-400';
      return 'text-green-400';
    }
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Navigation Bar
        <nav className="mb-8 flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg">
          <h1 className="text-2xl font-bold text-white">Green House</h1>
          <div className="space-x-6">
            <Link to="/" className="text-slate-300 hover:text-white font-semibold">Dashboard</Link>
            <Link to="/history" className="text-slate-300 hover:text-white font-semibold">History</Link>
            <Link to="/about" className="text-slate-300 hover:text-white font-semibold">About Us</Link>
          </div>  
        </nav> */}

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sensor History</h1>
          <p className="text-slate-400">Track your environmental data over time</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{data.length} records found</span>
          </div>
        </div>

        {/* Stats Cards */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 bg-opacity-20 rounded-lg">
                  <Thermometer className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Avg Temp</p>
                  <p className="text-xl font-bold text-white">
                    {(data.reduce((acc, item) => acc + item.temp, 0) / data.length).toFixed(1)}°C
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 bg-opacity-20 rounded-lg">
                  <Droplets className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Avg Humidity</p>
                  <p className="text-xl font-bold text-white">
                    {(data.reduce((acc, item) => acc + item.humi, 0) / data.length).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                  <Sprout className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Avg Soil</p>
                  <p className="text-xl font-bold text-white">
                    {(data.reduce((acc, item) => acc + item.soil, 0) / data.length).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                  <Sun className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Avg Light</p>
                  <p className="text-xl font-bold text-white">
                    {(data.reduce((acc, item) => acc + item.ldr, 0) / data.length).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr className="bg-gradient-to-r from-slate-700 to-slate-900">
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">#</th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Temperature
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4" /> Humidity
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4" /> Soil
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" /> Light
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Sprout className="w-12 h-12 text-slate-600" />
                        <p className="text-lg font-medium">No data available</p>
                        <p className="text-sm">Records will appear here once data is collected</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700 transition-colors duration-150">
                      <td className="py-4 px-6 text-sm font-medium text-white">{index + 1}</td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`font-semibold ${getStatusColor(item.temp, 'temp')}`}>
                          {item.temp}°C
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="font-semibold text-blue-400">{item.humi}%</span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="font-semibold text-green-400">{item.soil}</span>
                      </td>
                      <td className="py-4 px-6 text-sm">
                        <span className="font-semibold text-yellow-400">{item.ldr}</span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
