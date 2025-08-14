// src/api/activity.ts
export const logEvent = async (event: string, metadata: any) => {
    await fetch('http://localhost:5000/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, metadata }),
    });
  };
  
  export const fetchStats = async () => {
    const res = await fetch('http://localhost:5000/stats');
    return await res.json();
  };
  