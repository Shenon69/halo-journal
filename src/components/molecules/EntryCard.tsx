import React from "react";
import { Card, CardContent } from "@/components/atoms/card";
import Link from "next/link";
import { format } from "date-fns";
import { getMoodEmoji, getMoodColor, getMoodColorClasses, capitalizeFirstLetter } from "@/lib/utils";

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
          <div className="mt-4 flex items-center gap-2">
            {/* Show mood instead of collection */}
            {(() => {
              const moodColor = getMoodColor(entry.moodScore || 0);
              const { bgColorClass, textColorClass, borderColorClass } = getMoodColorClasses(moodColor);
              
              return (
                <span className={`text-sm px-2 py-1 rounded border ${bgColorClass} ${textColorClass} ${borderColorClass}`}>
                  {moodEmoji} {capitalizeFirstLetter(entry.mood || 'neutral')}
                </span>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EntryCard;
