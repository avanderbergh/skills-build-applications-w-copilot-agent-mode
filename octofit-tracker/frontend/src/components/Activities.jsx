import React, { useEffect, useState } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use a relative URL or try both URLs
    const apiUrls = [
      '/api/activities/',              // Relative URL
      'http://localhost:8000/api/activities/',  // Local URL
      'https://organic-pancake-9rq97jrxfxjj9-8000.app.github.dev/api/activities/' // GitHub Codespace URL
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
          setActivities(data);
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
        setError('Failed to fetch activities from all available endpoints');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to format the date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <h1 className="text-center">Activities</h1>
      
      {loading && <p>Loading activities...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Activity</th>
            <th>Duration</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map(activity => (
            <tr key={activity._id}>
              <td>{activity.activity_type}</td>
              <td>{activity.duration}</td>
              <td>{formatDate(activity.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Activities;