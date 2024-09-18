import React, { useState, useEffect } from 'react';

function Search() {
  const [inputValue, setInputValue] = useState(''); // User input
  const [debouncedValue, setDebouncedValue] = useState(inputValue); // Debounced value
  const [data, setData] = useState(null); // API response data
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Debounce the input value by 500ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500); // Change this value to adjust the debounce delay

    // Cleanup the timeout when inputValue changes (or on component unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  // Fetch data and handle debounced search
  useEffect(() => {
    if (debouncedValue) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:3030/data`); // Fetching from db.json
          const result = await response.json();

          // Extracting the director's avatar URL
          const casts = result.title.casts;
          const filteredData = casts.filter(casts =>
            casts.name.display_name.toLowerCase().includes(debouncedValue.toLowerCase())
          );

          setData(filteredData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setData(null); // Clear data if the input is empty
    }
  }, [debouncedValue]);

  return (
    <div>
      <h1>Debounce API Example</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type director's name to search..."
      />

      {isLoading && <p>Loading...</p>}

      {data && data.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          {data.map((casts, index) => (
            <div key={index}>
              <h3>{casts.name.display_name}</h3>
              <img src={casts.name.avatars[0].url} alt={casts.name.display_name} width="200" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <p>No results found for "{debouncedValue}".</p>
      )}
    </div>
  );
}

export default Search;
