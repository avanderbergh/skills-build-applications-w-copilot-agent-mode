import React, { useEffect, useState } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use a relative URL or try both URLs
    const apiUrls = [
      '/api/teams/',              // Relative URL
      'http://localhost:8000/api/teams/',  // Local URL
      'https://organic-pancake-9rq97jrxfxjj9-8000.app.github.dev/api/teams/' // GitHub Codespace URL
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
          setTeams(data);
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
        setError('Failed to fetch teams from all available endpoints');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center">Teams</h1>
      
      {loading && <p>Loading teams...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Members</th>
            </tr>
          </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team._id}>
                <td>{team.name}</td>
                <td>{team.members.map(member => member.username).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Teams;