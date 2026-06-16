import React, { useState } from 'react';

const ReviewDataViewer = () => {
  // Default library ID example
  const [libraryId, setLibraryId] = useState('5b68dc58-9196-40b2-8ee8-43fae7f67903');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    if (!libraryId.trim()) return;
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/feedback/library/${libraryId}?page=1&limit=10`);
      
      // If unauthorized, you might see a 401. If so, you will need to exclude /feedback in app.module.ts
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
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#fff5f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#c53030' }}>Library Reviews (Feedback) Viewer</h1>
      <p style={{ color: '#742a2a' }}>
        Paste a Library ID below to fetch its reviews using the <code>/feedback/library/:libraryId</code> API.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', maxWidth: '600px' }}>
        <input 
          type="text" 
          value={libraryId} 
          onChange={(e) => setLibraryId(e.target.value)} 
          placeholder="Enter Library ID here..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #feb2b2', fontSize: '16px' }}
        />
        <button 
          onClick={fetchReviews}
          style={{ padding: '10px 20px', backgroundColor: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          {loading ? 'Fetching...' : 'Get Reviews'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fed7d7', color: '#9b2c2c', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
          {error.includes('401') && <p style={{ marginTop: '5px' }}>Note: You might need to login first, or exclude '/feedback' in your AuthMiddleware (app.module.ts) if this is meant to be public.</p>}
        </div>
      )}

      {data && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #fed7d7' }}>
          <h2 style={{ borderBottom: '2px solid #feb2b2', paddingBottom: '10px', color: '#9b2c2c' }}>Reviews Response Data</h2>
          <pre style={{ background: '#2d3748', color: '#fbd38d', padding: '20px', borderRadius: '6px', overflowX: 'auto', fontSize: '14px', lineHeight: '1.5' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReviewDataViewer;
