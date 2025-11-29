import React, { useState, useEffect } from 'react';

// Main App component
function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // NOTE: The URL MUST match the port your backend API is running on (3000)
    const API_URL = 'http://localhost:3000/api/patients';

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((err) => {
        // This usually happens if the backend server isn't running
        console.error('Connection Error:', err);
        setError("Failed to connect to the backend API. Is your server running on port 3000?");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs only once on mount

  if (loading) {
    return (
      <div className="text-center p-8">
        <h1 className="text-xl font-bold">Loading Patient Data...</h1>
        <p>Attempting to connect to the API on port 3000.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border-l-4 border-red-500 text-red-700">
        <h1 className="text-xl font-bold mb-2">Error Connecting to Backend</h1>
        <p>{error}</p>
        <p className="mt-4 text-sm">Please ensure you run <code className="font-mono bg-red-200 p-1 rounded">npm run dev</code> in the <strong>api</strong> folder.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
          🏥 Hospital Management Client
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Patient List</h2>
        
        {patients.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded">
            <p className="font-bold">No Patients Found</p>
            <p>The API is working, but the database is empty. Add a patient using Postman or an Insomnia POST request.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {patients.map((p, index) => (
              <li 
                key={p._id || index} 
                className="p-4 border rounded-lg bg-gray-50 hover:bg-blue-50 transition duration-150 ease-in-out flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-gray-900">{p.name}</span>
                  <span className="text-sm text-gray-600">
                    Gender: {p.gender} | DOB: {p.dob}
                  </span>
                </div>
                <span className="text-blue-500 font-medium">ID: {p._id || "N/A"}</span>
              </li>
            ))}
          </ul>
        )}
        
        <p className="mt-8 text-xs text-gray-500">
          This data is fetched from your backend API running at <code className="font-mono">http://localhost:3000</code>.
        </p>
      </div>
    </div>
  );
}

export default App;