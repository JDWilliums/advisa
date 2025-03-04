// components/ui/radio-group.tsx
"use client"

import React, { createContext, useContext, useState } from "react"

interface RadioContextType {
  value: string | undefined;
  onValueChange: (newValue: string) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined)

interface RadioGroupProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export function RadioGroup({ defaultValue, onValueChange, children, className = "" }: RadioGroupProps) {
  const [value, setValue] = useState<string | undefined>(defaultValue)
  
  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    if (onValueChange) onValueChange(newValue)
  }
  
  return (
    <RadioContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`grid gap-2 ${className}`}>
        {children}
      </div>
    </RadioContext.Provider>
  )
}

interface RadioGroupItemProps {
  value: string;
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

export function RadioGroupItem({ value, id, children, className = "" }: RadioGroupItemProps) {
  const context = useContext(RadioContext)
  
  if (!context) {
    throw new Error("RadioGroupItem must be used within a RadioGroup")
  }
  
  const checked = context.value === value
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={() => context.onValueChange(value)}
        className={`aspect-square h-4 w-4 rounded-full border ${
          checked 
            ? 'border-indigo-600 bg-indigo-600' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
        id={id}
      >
        {checked && (
          <span className="flex h-full w-full items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        )}
      </button>
      {children}
    </div>
  )
}