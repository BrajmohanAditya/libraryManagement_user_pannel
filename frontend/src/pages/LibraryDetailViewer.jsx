import React, { useState } from 'react';

const LibraryDetailViewer = () => {
  // Puraani koi library ka default ID yaha rakha hai example ke liye
  const [libraryId, setLibraryId] = useState('5b68dc58-9196-40b2-8ee8-43fae7f67903');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLibraryDetails = async () => {
    if (!libraryId.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/librarys/${libraryId}`);
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
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <h1 style={{ color: '#1a365d' }}>Library Details API Viewer</h1>
      <p style={{ color: '#4a5568' }}>
        Paste a Library ID below to fetch and inspect its details from the <code>/librarys/:id</code> endpoint.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
        <input 
          type="text" 
          value={libraryId} 
          onChange={(e) => setLibraryId(e.target.value)} 
          placeholder="Enter Library ID here..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e0', fontSize: '16px' }}
        />
        <button 
          onClick={fetchLibraryDetails}
          style={{ padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Fetching...' : 'Fetch Details'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fed7d7', color: '#c53030', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#2d3748' }}>API Response Data</h2>
          <pre style={{ background: '#1a202c', color: '#a0aec0', padding: '20px', borderRadius: '6px', overflowX: 'auto', fontSize: '14px', lineHeight: '1.5' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default LibraryDetailViewer;
