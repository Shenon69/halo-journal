"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/atoms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import EntryCard from "./EntryCard";

export function JournalFilters({ entries }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [date, setDate] = useState(null);
  const [filteredEntries, setFilteredEntries] = useState(entries);

  // Apply filters whenever filter values or entries change
  useEffect(() => {
    let filtered = entries;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry: any) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)
      );
    }

    // Apply mood filter
    if (selectedMood) {
      filtered = filtered.filter((entry: any) => entry.mood === selectedMood);
    }

    // Apply date filter
    if (date) {
      filtered = filtered.filter((entry: any) =>
        isSameDay(new Date(entry.createdAt), date)
      );
    }

    setFilteredEntries(filtered);
  }, [entries, searchQuery, selectedMood, date]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMood("");
    setDate(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            prefixIcon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {(searchQuery || selectedMood || date) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-orange-600"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-500">
        Showing {filteredEntries.length} of {entries.length} entries
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">No entries found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredEntries.map((entry: any) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </>
  );
}
