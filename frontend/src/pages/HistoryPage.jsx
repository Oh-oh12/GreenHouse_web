import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Calendar,
  ArrowLeft,
  Trash2,
} from "lucide-react";

export default function HistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Node-RED API
  const fetchData = () => {
    setLoading(true);
    fetch("http://127.0.0.1:1880/api/data")
      .then((res) => res.json())
      .then((data) => {
        // Convert object → array if necessary
        const formatted = Array.isArray(data) ? data : Object.values(data);
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🗑 Delete record handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      console.log("Deleting record with ID:", id);
      const response = await fetch(`http://127.0.0.1:1880/api/data/${id}`, {
        method: "DELETE",
      });

      if (response) {
        // Remove from UI immediately
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete:", await response.text());
        alert("Failed to delete record");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting record");
    }
  };

  const getStatusColor = (value, type) => {
    if (type === "temp") {
      if (value < 20) return "text-blue-400";
      if (value > 30) return "text-red-400";
      return "text-green-400";
    }
    return "text-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
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

        {/* Table */}
        <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead>
                <tr className="bg-slate-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  <th className="py-4 px-6">#</th>
                  <th className="py-4 px-6">Temperature</th>
                  <th className="py-4 px-6">Humidity</th>
                  <th className="py-4 px-6">Soil</th>
                  <th className="py-4 px-6">Light</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-slate-400">
                      No data available
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr
                      key={item._id || index}
                      className="hover:bg-slate-700 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-sm text-white">{index + 1}</td>
                      <td className="py-4 px-6 text-sm">
                        <span className={`font-semibold ${getStatusColor(item.temp, "temp")}`}>
                          {item.temp}°C
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-blue-400 font-semibold">
                        {item.humi}%
                      </td>
                      <td className="py-4 px-6 text-sm text-green-400 font-semibold">
                        {item.soil}
                      </td>
                      <td className="py-4 px-6 text-sm text-yellow-400 font-semibold">
                        {item.ldr}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">{item.date}</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
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
