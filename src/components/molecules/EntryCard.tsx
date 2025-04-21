import React from "react";
import { Card, CardContent } from "@/components/atoms/card";
import Link from "next/link";
import { format } from "date-fns";
import { getMoodEmoji } from "@/lib/utils";

const EntryCard = ({ entry }) => {
  // Use either the mood emoji from moodData or generate one based on score
  const moodEmoji = entry.moodData?.emoji || getMoodEmoji(entry.moodScore);
  
  return (
    <Link href={`/journal/${entry.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{moodEmoji}</span>
                <h3 className="font-semibold text-lg">{entry.title}</h3>
              </div>
              <div
                className="text-gray-600 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>
            <div className="min-w-[100px]">
            <time className="text-sm text-gray-500">
              {format(new Date(entry.createdAt), "MMM d, yyyy")}
            </time>
            </div>
          </div>
          {entry.collection && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm px-2 py-1 bg-orange-100 text-orange-800 rounded">
                {entry.collection.name}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default EntryCard;
