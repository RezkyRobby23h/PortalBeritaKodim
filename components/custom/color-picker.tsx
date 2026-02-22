"use client";

import { useCallback, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Pipette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
  "#1e293b",
];

function isValidHex(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  const handlePickerChange = useCallback(
    (hex: string) => {
      setInputValue(hex);
      onChange(hex);
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    // Normalise: prepend # if missing
    const normalised = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalised)) {
      onChange(normalised);
    }
  };

  const handleInputBlur = () => {
    // Snap input back to last valid hex on blur
    setInputValue(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("flex items-center gap-2 font-mono text-sm", className)}
        >
          {/* Color swatch */}
          <span
            className="size-4 shrink-0 rounded-sm border border-black/10"
            style={{ backgroundColor: isValidHex(value) ? value : "#3b82f6" }}
          />
          {value}
          <Pipette className="ml-auto size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3" align="start">
        {/* react-colorful canvas */}
        <HexColorPicker
          color={isValidHex(value) ? value : "#3b82f6"}
          onChange={handlePickerChange}
          style={{ width: "100%", height: "160px" }}
        />

        {/* Hex input */}
        <div className="mt-3 flex items-center gap-2">
          <span
            className="size-6 shrink-0 rounded-sm border border-black/10"
            style={{ backgroundColor: isValidHex(value) ? value : "#3b82f6" }}
          />
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="#3b82f6"
            className="h-8 font-mono text-xs"
            maxLength={7}
          />
        </div>

        {/* Presets */}
        <div className="mt-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Preset
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                title={preset}
                onClick={() => handlePickerChange(preset)}
                className={cn(
                  "size-6 rounded-sm border-2 transition-transform hover:scale-110",
                  value === preset ? "border-foreground" : "border-transparent",
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
