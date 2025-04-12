import { MOODS } from "@/data/const/moods";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getPixabayImage } from "./public";
import { revalidatePath } from "next/cache";

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: keyof typeof MOODS
  moodScore: number
  moodImageUrl: string
  moodQuery: string
  collectionId?: string
}

export async function createJournalEntry(data: JournalEntry) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("User not authenticated");

    // Archjet rate limiting

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    })

    if (!user) throw new Error("User not found");

    const mood = MOODS[data.mood.toUpperCase() as keyof typeof MOODS];
    if (!mood) throw new Error("Invalid mood");

    const moodImageUrl = await getPixabayImage(data.moodQuery)
    const entry = await db.entry.create({
      data: {
        title: data.title,
        content: data.content,
        mood: mood.id,
        moodScore: mood.score,
        moodImageUrl: moodImageUrl,
        userId: user.id,
        collectionId: data.collectionId || null,
      }
    })

    await db.draft.deleteMany({
      where: {
        userId: user.id,
      }
    })

    revalidatePath("/dashboard");
    return entry
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw new Error("Failed to create journal entry");
  }
}
