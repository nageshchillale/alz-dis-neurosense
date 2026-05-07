import { useState } from 'react';

export default function SpatialReasoning(){
  const [started, setStarted] = useState(false);
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Spatial Reasoning</h1>
      <p className="mb-4">Placeholder for Spatial Reasoning mini-game. Intended to capture response time and accuracy.</p>
      <button onClick={()=>setStarted(true)} className="px-4 py-2 bg-[#00F0FF] rounded">Start</button>
      {started && <p className="mt-4">Game running (stub)</p>}
    </div>
  )
}
