import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use a relative URL or try both URLs
    const apiUrls = [
      '/api/leaderboard/',              // Relative URL
      'http://localhost:8000/api/leaderboard/',  // Local URL
      'https://organic-pancake-9rq97jrxfxjj9-8000.app.github.dev/api/leaderboard/' // GitHub Codespace URL
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
          setLeaderboard(data);
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
        setError('Failed to fetch leaderboard from all available endpoints');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center">Leaderboard</h1>
      
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(entry => (
              <tr key={entry._id}>
                <td>{entry.user.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;