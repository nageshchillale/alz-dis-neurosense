import { useState } from 'react';

export default function MemoryMatch(){
  const [started, setStarted] = useState(false);
  const [metrics, setMetrics] = useState({ clicks:0, timeMs:0 });

  const handleStart = () => {
    setStarted(true);
    setMetrics({ clicks:0, timeMs:0 });
    // placeholder: real game logic to be implemented
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Memory Match</h1>
      <p className="mb-4">A lightweight placeholder for the Memory Match mini-game. Metrics tracked: clicks and time.</p>
      {!started ? (
        <button onClick={handleStart} className="px-4 py-2 bg-[#00F0FF] rounded">Start</button>
      ) : (
        <div>
          <p>Game in progress (stub)</p>
          <p>Clicks: {metrics.clicks}</p>
        </div>
      )}
    </div>
  )
}
