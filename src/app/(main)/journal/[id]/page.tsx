import { getJournalEntry } from "@/actions/journal"
import { Badge } from "@/components/atoms/badge";
import DeleteDialog from "@/components/atoms/delete-dialog";
import EditButton from "@/components/atoms/edit-button";
import { getMoodColor, getMoodEmoji, getMoodColorClasses, capitalizeFirstLetter } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function JournalPage({ params }) {
  const { id } = params
  const entry = await getJournalEntry(id)
  
  // Create mood display data using entry properties directly
  const moodColor = getMoodColor(entry.moodScore);
  const moodEmoji = getMoodEmoji(entry.moodScore);
  const moodLabel = capitalizeFirstLetter(entry.mood);

  let imageIsValid = false;
  if (entry.moodImageUrl) {
    try {
      const response = await fetch(entry.moodImageUrl, { 
        method: 'HEAD',
        cache: 'no-store' 
      });
      imageIsValid = response.ok;
    } catch (error) {
      console.error('Error checking image URL:', error);
      imageIsValid = false;
    }
  }

  return (
    <>
      {/* Header with Mood Image - only display if image is valid */}
      {entry.moodImageUrl && imageIsValid && (
        <div className="relative h-48 md:h-64 w-full">
          <Image
            src={entry.moodImageUrl}
            alt="Mood visualization"
            className="object-contain"
            fill
            priority
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-5xl font-bold gradient-title">
                  {entry.title}
                </h1>
              </div>
              <p className="text-gray-500">
                Created {format(new Date(entry.createdAt), "PPP")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <EditButton entryId={id} />
              <DeleteDialog entryId={id} />
            </div>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2">
            {entry.collection && (
              <Link href={`/collection/${entry.collection.id}`}>
                <Badge>Collection: {entry.collection.name}</Badge>
              </Link>
            )}
            {(() => {
              const { bgColorClass, textColorClass, borderColorClass } = getMoodColorClasses(moodColor);
              
              return (
                <Badge
                  variant="outline"
                  className={`${bgColorClass} ${textColorClass} border ${borderColorClass}`}
                >
                  {moodEmoji} Feeling {moodLabel}
                </Badge>
              );
            })()}
          </div>
        </div>

        <hr />

        {/* Content Section */}
        <div className="ql-snow">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: entry.content }}
          />
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 pt-4 border-t">
          Last updated {format(new Date(entry.updatedAt), "PPP 'at' p")}
        </div>
      </div>
    </>
  )
}
