import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const addTestResult = (test, status, details) => {
    setTestResults(prev => [...prev, { test, status, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    setTestResults([]);

    try {
      // Test 1: Basic backend connection
      addTestResult('Backend Base URL', 'testing', 'Checking http://localhost:5000');
      const baseResponse = await fetch('http://localhost:5000');
      if (baseResponse.ok) {
        const data = await baseResponse.json();
        addTestResult('Backend Base URL', 'success', `Connected! Message: ${data.message}`);
      } else {
        addTestResult('Backend Base URL', 'error', `HTTP ${baseResponse.status}`);
      }

      // Test 2: API test endpoint
      addTestResult('API Test Endpoint', 'testing', 'Checking /api/test');
      const testResponse = await api.get('/test');
      addTestResult('API Test Endpoint', 'success', `API working! ${testResponse.data.message}`);

      // Test 3: Registration endpoint (OPTIONS request)
      addTestResult('Registration Endpoint', 'testing', 'Checking /api/auth/register (OPTIONS)');
      const optionsResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'OPTIONS'
      });
      addTestResult('Registration Endpoint', 'success', `OPTIONS request successful (${optionsResponse.status})`);

      setConnectionStatus('success');
    } catch (error) {
      addTestResult('Connection Test', 'error', `${error.message} (Code: ${error.code})`);
      setConnectionStatus('error');
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Connection Test</h3>
        <button 
          onClick={testConnection}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Retest
        </button>
      </div>
      
      <div className={`mb-3 px-3 py-2 rounded text-sm font-medium ${
        connectionStatus === 'testing' ? 'bg-yellow-100 text-yellow-800' :
        connectionStatus === 'success' ? 'bg-green-100 text-green-800' :
        'bg-red-100 text-red-800'
      }`}>
        Status: {connectionStatus}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {testResults.map((result, index) => (
          <div key={index} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium">{result.test}</span>
              <span className={`px-2 py-1 rounded ${
                result.status === 'testing' ? 'bg-yellow-100 text-yellow-700' :
                result.status === 'success' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {result.status}
              </span>
            </div>
            <div className="text-gray-600 mt-1">{result.details}</div>
            <div className="text-gray-400">{result.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionTest;