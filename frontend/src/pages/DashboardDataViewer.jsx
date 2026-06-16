import React, { useState, useEffect } from 'react';

const DashboardDataViewer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // We pass some dummy coordinates (e.g., New Delhi coordinates) 
    // to test the distance calculation properly.
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dashboard?lat=28.6139&lng=77.2090');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>Dashboard Endpoint Data Viewer</h1>
      <p style={{ color: '#666' }}>
        This is a dummy UI to inspect the exact data structure returned by <code>/dashboard</code>.
      </p>

      {loading && <div style={{ padding: '20px', fontSize: '18px', color: '#0066cc' }}>Loading data...</div>}
      
      {error && (
        <div style={{ padding: '20px', backgroundColor: '#ffe6e6', color: '#cc0000', border: '1px solid #cc0000', borderRadius: '4px' }}>
          <strong>Error fetching data:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
          
          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>1. Statistics (data.statistics)</h2>
            <pre style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '6px', overflowX: 'auto' }}>
              {JSON.stringify(data.statistics, null, 2)}
            </pre>
          </div>

          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>2. Banners (data.banners)</h2>
            <pre style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '6px', overflowX: 'auto' }}>
              {JSON.stringify(data.banners, null, 2)}
            </pre>
          </div>

          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>3. Top Libraries (data.topLibraries)</h2>
            <pre style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '6px', overflowX: 'auto' }}>
              {JSON.stringify(data.topLibraries, null, 2)}
            </pre>
          </div>

          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>4. Nearest Libraries (data.nearestLibraries)</h2>
            <pre style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '6px', overflowX: 'auto' }}>
              {JSON.stringify(data.nearestLibraries, null, 2)}
            </pre>
          </div>

          <div style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>5. All Libraries Paginated (data.allLibraries)</h2>
            <pre style={{ background: '#282c34', color: '#abb2bf', padding: '15px', borderRadius: '6px', overflowX: 'auto' }}>
              {JSON.stringify(data.allLibraries, null, 2)}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardDataViewer;
