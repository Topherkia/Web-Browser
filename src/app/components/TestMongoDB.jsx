import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestMongoDB = () => {
  const [loading, setLoading] = useState(false);
  const [activeTest, setActiveTest] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('react tutorials');
  const [commentText, setCommentText] = useState('This is a test comment');
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('Test User');

  // Test basic connection
  const testConnection = async () => {
    setActiveTest('connection');
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/test');
      setResult(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Test search endpoint with better error handling
// Update the testSearch function in your TestMongoDB component:
const testSearch = async () => {
  setActiveTest('search');
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get('http://localhost:5000/api/search', {
      params: { q: searchQuery }
    });
    setResult(response.data);
    
    // Show success message for search
    if (response.data.items && response.data.items.length > 0) {
      console.log('✅ Search is working! Found', response.data.items.length, 'results');
    }
  } catch (err) {
    handleError(err);
  } finally {
    setLoading(false);
  }
};
  // Test comments endpoint (GET)
  const testGetComments = async () => {
    setActiveTest('get-comments');
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/comments');
      setResult(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Test adding a comment (POST) with better error handling
  const testAddComment = async () => {
    setActiveTest('add-comment');
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/comments', {
        text: commentText,
        rating: rating,
        author: author,
        url: 'http://example.com/test'
      });
      setResult(response.data);
      
      // Refresh comments after adding
      setTimeout(testGetComments, 500);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Comments endpoint not found. Make sure backend/routes/comments.js is properly configured.');
      } else {
        handleError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create test document
  const createTestDocument = async () => {
    setActiveTest('create-document');
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/test/create');
      setResult(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all test documents
  const fetchAllDocuments = async () => {
    setActiveTest('fetch-documents');
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/test/all');
      setResult(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      setError(`Server Error ${err.response.status}: ${err.response.data?.error || err.response.data?.message || 'Unknown error'}`);
    } else if (err.request) {
      // The request was made but no response was received
      setError('No response from server. Make sure backend is running on port 5000.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setError('Request error: ' + err.message);
    }
  };

  const clearResults = () => {
    setResult(null);
    setError(null);
    setActiveTest('');
  };

  // Load comments on component mount
  useEffect(() => {
    testGetComments();
  }, []);

  // Button style helper
  const buttonStyle = (testName) => {
    const isActive = activeTest === testName;
    const colors = {
      'connection': '#4299e1',
      'search': '#38b2ac',
      'get-comments': '#ed8936',
      'add-comment': '#48bb78',
      'create-document': '#9f7aea',
      'fetch-documents': '#ed64a6'
    };
    
    return {
      padding: '10px',
      backgroundColor: colors[testName] || '#a0aec0',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: loading && !isActive ? 'not-allowed' : 'pointer',
      opacity: loading && !isActive ? 0.5 : 1,
      fontWeight: '500',
      fontSize: '14px',
      boxShadow: isActive ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : 'none',
      transform: isActive ? 'translateY(1px)' : 'none',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    };
  };

  return (
    <div style={{ 
      padding: '24px', 
      border: '1px solid #e2e8f0', 
      margin: '20px',
      borderRadius: '12px',
      backgroundColor: '#f8fafc',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px'
    }}>
      <h2 style={{ 
        margin: '0 0 24px 0', 
        color: '#2d3748',
        borderBottom: '2px solid #4299e1',
        paddingBottom: '10px'
      }}>
        🛠️ API Endpoint Tester
      </h2>
      
      {/* Status Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#48bb78',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>MongoDB Status</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>✅ Connected</div>
        </div>
        <div style={{
          padding: '15px',
          backgroundColor: result?.data?.length > 0 ? '#48bb78' : '#ed8936',
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Test Documents</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {result?.count || result?.data?.length || 0} created
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div style={{ 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#4a5568' }}>Test Parameters</h4>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' }}>
              Search Query:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter search query"
            />
            <small style={{ color: '#a0aec0', display: 'block', marginTop: '4px' }}>
              ⚠️ Requires GOOGLE_API_KEY and GOOGLE_CX in .env
            </small>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' }}>
              Comment Text:
            </label>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter comment text"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' }}>
              Author:
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              placeholder="Enter author name"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#4a5568' }}>
              Rating (1-5):
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span>1</span>
              <span style={{ fontWeight: 'bold', color: '#4299e1' }}>{rating}</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        marginBottom: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px'
      }}>
        <button 
          onClick={testConnection}
          disabled={loading && activeTest !== 'connection'}
          style={buttonStyle('connection')}
        >
          🔗 Test Connection
        </button>
        
        <button 
          onClick={testSearch}
          disabled={loading && activeTest !== 'search'}
          style={buttonStyle('search')}
        >
          🔍 Test Search
        </button>
        
        <button 
          onClick={testGetComments}
          disabled={loading && activeTest !== 'get-comments'}
          style={buttonStyle('get-comments')}
        >
          💬 Get Comments
        </button>
        
        <button 
          onClick={testAddComment}
          disabled={loading && activeTest !== 'add-comment'}
          style={buttonStyle('add-comment')}
        >
          ➕ Add Comment
        </button>
        
        <button 
          onClick={createTestDocument}
          disabled={loading && activeTest !== 'create-document'}
          style={buttonStyle('create-document')}
        >
          📝 Create Document
        </button>
        
        <button 
          onClick={fetchAllDocuments}
          disabled={loading && activeTest !== 'fetch-documents'}
          style={buttonStyle('fetch-documents')}
        >
          📋 Fetch All
        </button>
        
        <button 
          onClick={clearResults}
          style={{
            padding: '10px',
            backgroundColor: '#a0aec0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px'
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#edf2f7',
          borderRadius: '8px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #4299e1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#4a5568', fontWeight: '500' }}>
            Testing {activeTest.replace('-', ' ')}...
          </span>
          <style>
            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
          </style>
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '16px',
          backgroundColor: '#fed7d7',
          border: '1px solid #fc8181',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: '#c53030', fontSize: '20px' }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#c53030' }}>Error Details</h4>
              <p style={{ margin: 0, color: '#c53030', fontSize: '14px' }}>{error}</p>
              
              {/* Show specific solutions based on error */}
              {error.includes('GOOGLE_API_KEY') && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px'
                }}>
                  <strong style={{ color: '#c53030' }}>Solution:</strong>
                  <ol style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#c53030' }}>
                    <li>Go to Google Cloud Console</li>
                    <li>Create a project and enable Custom Search API</li>
                    <li>Get your API Key and Search Engine ID (CX)</li>
                    <li>Add them to your .env file</li>
                  </ol>
                </div>
              )}
              
              {error.includes('endpoint not found') && (
                <div style={{ 
                  marginTop: '10px', 
                  padding: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '4px'
                }}>
                  <strong style={{ color: '#c53030' }}>Solution:</strong>
                  <p style={{ margin: '5px 0 0 0', color: '#c53030' }}>
                    Check your backend/routes/comments.js file exists and is properly exported.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#c53030',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Results Display */}
      {result && !loading && (
        <div style={{ 
          marginTop: '20px',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: '#4299e1',
            color: 'white',
            fontWeight: '600',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>📊 Results - {activeTest.replace('-', ' ').toUpperCase()}</span>
            <span style={{
              padding: '4px 8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'white' }}>
            {activeTest === 'connection' && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>
                  ✅ MongoDB Connection Successful
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f0fff4', 
                    borderRadius: '6px',
                    border: '1px solid #c6f6d5'
                  }}>
                    <div style={{ color: '#22543d', fontSize: '12px' }}>Database</div>
                    <div style={{ color: '#22543d', fontWeight: 'bold' }}>{result.database}</div>
                  </div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f0fff4', 
                    borderRadius: '6px',
                    border: '1px solid #c6f6d5'
                  }}>
                    <div style={{ color: '#22543d', fontSize: '12px' }}>Host</div>
                    <div style={{ color: '#22543d', fontWeight: 'bold' }}>{result.host}</div>
                  </div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f0fff4', 
                    borderRadius: '6px',
                    border: '1px solid #c6f6d5'
                  }}>
                    <div style={{ color: '#22543d', fontSize: '12px' }}>Version</div>
                    <div style={{ color: '#22543d', fontWeight: 'bold' }}>{result.serverStatus?.version}</div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTest === 'fetch-documents' && result.data && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>
                  Test Documents ({result.count || result.data.length})
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {result.data.map((doc, index) => (
                    <div key={doc._id} style={{
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      backgroundColor: '#f7fafc',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ 
                            backgroundColor: '#4299e1',
                            color: 'white',
                            width: '24px',
                            height: '24px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </span>
                          <strong style={{ color: '#4a5568' }}>{doc.message}</strong>
                        </div>
                        <small style={{ color: '#a0aec0', display: 'block', marginLeft: '32px' }}>
                          ID: {doc._id} • Created: {new Date(doc.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <pre style={{ 
              background: '#f7fafc', 
              padding: '16px', 
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '13px',
              maxHeight: '400px',
              color: '#2d3748',
              margin: 0,
              border: '1px solid #e2e8f0'
            }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestMongoDB;