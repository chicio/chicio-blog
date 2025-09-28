'use client'

import { useState } from "react";

export function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border rounded mb-2">
      <button className="w-full px-4 py-2 text-left bg-gray-100" onClick={() => setOpen(!open)}>
        {title}
      </button>
      {open && <div className="p-4 bg-white">{children}</div>}
    </div>
  )
}
