import React, { useEffect, useState } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use a relative URL or try both URLs
    const apiUrls = [
      '/api/workouts/',              // Relative URL
      'http://localhost:8000/api/workouts/',  // Local URL
      'https://organic-pancake-9rq97jrxfxjj9-8000.app.github.dev/api/workouts/' // GitHub Codespace URL
    ];
    
    // Try each URL in sequence until one works
    const fetchData = async () => {
      setLoading(true);
      let success = false;
      
      for (const url of apiUrls) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error ${response.status}`);
          
          const data = await response.json();
          setWorkouts(data);
          setLoading(false);
          success = true;
          console.log(`Successfully fetched from ${url}`);
          break;
        } catch (err) {
          console.log(`Failed to fetch from ${url}: ${err.message}`);
          // Continue to next URL
        }
      }
      
      if (!success) {
        setError('Failed to fetch workouts from all available endpoints');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center">Workouts</h1>
      
      {loading && <p>Loading workouts...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Workout Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map(workout => (
              <tr key={workout._id}>
                <td>{workout.name}</td>
                <td>{workout.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Workouts;