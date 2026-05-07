import { useState } from 'react';

export default function PatternSequence(){
  const [started, setStarted] = useState(false);
  const [metrics, setMetrics] = useState({ errors:0, timeMs:0 });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Pattern Sequence</h1>
      <p className="mb-4">Placeholder for the Pattern Sequence mini-game. Tracks errors and time.</p>
      <button onClick={()=>setStarted(true)} className="px-4 py-2 bg-[#00F0FF] rounded">Start</button>
      {started && <p className="mt-4">Game running (stub)</p>}
    </div>
  )
}
