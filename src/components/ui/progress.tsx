// components/ui/progress.jsx
"use client"

import React from "react"

export function Progress({ value = 0, className = "" }) {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}>
      <div
        className="h-full bg-indigo-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}