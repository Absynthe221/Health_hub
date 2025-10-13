'use client';

import React, { useState, useEffect } from 'react';

const TestSimplePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const response = await fetch('/api/ecg/modules');
        console.log('Response:', response);
        const result = await response.json();
        console.log('Data:', result);
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>Data loaded: {data ? data.length : 0} modules</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TestSimplePage;




