"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// The value flows in/out as a datetime-local string ("YYYY-MM-DDTHH:mm", local
// time) so callers stay decoupled from the Date/Calendar internals.
function parseLocal(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toLocalString(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

// Default time used when a date is picked before any time has been set.
const DEFAULT_TIME = "09:00";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Disables calendar days, e.g. dates in the past. */
  disabled?: (date: Date) => boolean;
  id?: string;
};

export function DateTimePicker({ value, onChange, disabled, id }: Props) {
  const [open, setOpen] = React.useState(false);

  const selected = parseLocal(value);
  const time = selected ? format(selected, "HH:mm") : DEFAULT_TIME;

  function combine(day: Date, hhmm: string): string {
    const [h, m] = hhmm.split(":").map(Number);
    const next = new Date(day);
    next.setHours(h || 0, m || 0, 0, 0);
    return toLocalString(next);
  }

  function handleDateSelect(day: Date | undefined) {
    if (!day) {
      onChange("");
      return;
    }
    // Keep the chosen (or default) time when only the date changes.
    onChange(combine(day, time));
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Anchor a time-only change to the picked day, falling back to today.
    onChange(combine(selected ?? new Date(), e.target.value));
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn(
              "flex-1 justify-start font-normal",
              !selected && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {selected ? format(selected, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleDateSelect}
            disabled={disabled}
            autoFocus
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-32"
        aria-label="Schedule time"
      />
    </div>
  );
}
