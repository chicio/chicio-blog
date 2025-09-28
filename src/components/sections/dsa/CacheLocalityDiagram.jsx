import React from "react";

export const CacheLocalityDiagram = () => {
  return (
    <div className="p-4 border rounded-lg shadow mt-4">
      <h3 className="font-bold mb-2">Cache Locality</h3>
      <div className="flex space-x-2">
        {["A[0]", "A[1]", "A[2]", "A[3]", "A[4]"].map((cell, i) => (
          <div key={i} className="w-16 h-12 border flex items-center justify-center bg-yellow-200">
            {cell}
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-600">
        Contiguous memory means the CPU can load multiple elements into cache at once, 
        improving iteration speed compared to linked structures.
      </p>
    </div>
  );
};
