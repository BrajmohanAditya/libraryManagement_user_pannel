import React, { useState } from 'react';

const SeatDataViewer = () => {
  // Wahi same example library ID by default
  const [libraryId, setLibraryId] = useState('5b68dc58-9196-40b2-8ee8-43fae7f67903');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSeats = async () => {
    if (!libraryId.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/sheets/${libraryId}`);
      
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

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0fff4', minHeight: '100vh' }}>
      <h1 style={{ color: '#276749' }}>Library Seats (Sheets) Viewer</h1>
      <p style={{ color: '#2f855a' }}>
        Paste a Library ID below to fetch its seat layout using the <code>/sheets/:id</code> API.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
        <input 
          type="text" 
          value={libraryId} 
          onChange={(e) => setLibraryId(e.target.value)} 
          placeholder="Enter Library ID here..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #9ae6b4', fontSize: '16px' }}
        />
        <button 
          onClick={fetchSeats}
          style={{ padding: '10px 20px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Fetching...' : 'Get Seats'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
          {error.includes('401') && <p style={{ marginTop: '5px' }}>Agar 401 aaya, toh 'sheets' ko bhi app.module.ts ki exclude() list mein daalna padega!</p>}
        </div>
      )}

      {data && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #9ae6b4' }}>
          <h2 style={{ borderBottom: '2px solid #9ae6b4', paddingBottom: '10px', color: '#276749' }}>
            Total Seats Found: {Array.isArray(data) ? data.length : 0}
          </h2>
          
          {/* Ek chota sa UI representation seats dikhane ke liye */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {Array.isArray(data) && data.map((seat, index) => (
              <div 
                key={seat.id || index} 
                style={{ 
                  padding: '15px', 
                  backgroundColor: seat.isAvailable ? '#c6f6d5' : '#fed7d7',
                  border: `2px solid ${seat.isAvailable ? '#48bb78' : '#f56565'}`,
                  borderRadius: '8px',
                  minWidth: '60px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: seat.isAvailable ? '#276749' : '#c53030'
                }}
              >
                {seat.sheetNumber}
                <div style={{ fontSize: '12px', marginTop: '5px', fontWeight: 'normal' }}>
                  {seat.isAvailable ? 'Empty' : 'Booked'}
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ color: '#276749' }}>Raw JSON Data</h3>
          <pre style={{ background: '#2d3748', color: '#a0aec0', padding: '20px', borderRadius: '6px', overflowX: 'auto', fontSize: '14px', lineHeight: '1.5' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SeatDataViewer;
