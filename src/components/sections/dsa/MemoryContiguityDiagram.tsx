'use client';

export function MemoryContiguityDiagram() {
  return (
    <div className="flex gap-2">
      {[0,1,2,3,4].map(i => (
        <div key={i} className="w-12 h-12 border flex items-center justify-center bg-gray-200">
          {i}
        </div>
      ))}
    </div>
  )
}
