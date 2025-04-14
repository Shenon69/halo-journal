"use server";

import { MOODS } from "@/data/const/moods";
import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getPixabayImage } from "./public";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";

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

export async function createJournalEntry(data: Omit<JournalEntry, 'id' | 'moodImageUrl'>) {
  try {
    const { userId } = await auth()
    if (!userId) throw new Error("User not authenticated");

    // Archjet rate limiting
    const req = await request()
    const descition = await aj.protect(req, {
      userId,
      requested: 1
    })

    if (descition.isDenied()) {
      if (descition.reason.isRateLimit()) {
        const { remaining, reset } = descition.reason
        console.error("Rate limit exceeded", { remaining, reset })

        throw new Error("Too many requests, please try again later")
      }

      throw new Error("Request denied")
    }

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
