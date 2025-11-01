'use client';

import { useState, useEffect } from 'react';

interface CostRangeSliderProps {
  filterId: string;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

export default function CostRangeSlider({ filterId, value, onChange }: CostRangeSliderProps) {
  const [min, setMin] = useState(value?.min || 0);
  const [max, setMax] = useState(value?.max || 10);

  useEffect(() => {
    onChange({ min, max });
  }, [min, max, onChange]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">最小费用</label>
          <span className="text-white font-medium">{min}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={min}
          onChange={(e) => {
            const newMin = parseInt(e.target.value);
            if (newMin <= max) {
              setMin(newMin);
            }
          }}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-400">最大费用</label>
          <span className="text-white font-medium">{max}</span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          value={max}
          onChange={(e) => {
            const newMax = parseInt(e.target.value);
            if (newMax >= min) {
              setMax(newMax);
            }
          }}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}