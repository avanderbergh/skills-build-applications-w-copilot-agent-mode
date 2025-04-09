import React, { useEffect, useState } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use a relative URL or try both URLs
    const apiUrls = [
      '/api/users/',              // Relative URL
      'http://localhost:8000/api/users/',  // Local URL
      'https://organic-pancake-9rq97jrxfxjj9-8000.app.github.dev/api/users/' // GitHub Codespace URL
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
          setUsers(data);
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
        setError('Failed to fetch users from all available endpoints');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-center">Users</h1>
      
      {loading && <p>Loading users...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Users;