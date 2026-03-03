"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = "Pilih rentang tanggal",
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!value?.from}
            className={cn(
              "w-full justify-start text-left font-normal border-foreground/20 bg-transparent hover:border-primary hover:bg-primary/10 hover:text-foreground text-xs h-9",
              "data-[empty=true]:text-foreground/40",
              value?.from && "text-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 opacity-60" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd MMM yyyy", { locale: id })} -{" "}
                  {format(value.to, "dd MMM yyyy", { locale: id })}
                </>
              ) : (
                format(value.from, "dd MMM yyyy", { locale: id })
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={1}
            locale={id}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
