import { getCollections } from "@/actions/collection"
import { getJournalEntries } from "@/actions/journal"
import Collections from "@/components/organisms/Collections"
import MoodAnalytics from "@/components/organisms/MoodAnalytics"

export interface DBJournalEntry {
  id: string
  title: string
  content: string
  mood: string
  moodScore: number
  moodImageUrl: string
  collectionId: string | null
  userId: string
  createdAt: string
  updatedAt: string
  collection: {
    id: string
    name: string
  } | null
  moodData: {
    id: string
    label: string
    emoji: string
    score: number
    color: string
    prompt: string
    pixabayQuery: string
  }
}

// Define the response type from your API
interface JournalEntriesResponse {
  success: boolean
  data?: {
    entries: DBJournalEntry[]
  }
  error?: string
}

export default async function Dashboard() {
  const collections = await getCollections()
  const entriesData = await getJournalEntries() as JournalEntriesResponse

  const entriesByCollection = entriesData?.data?.entries.reduce<Record<string, DBJournalEntry[]>>((acc, entry) => {
    const collectionId = entry.collectionId || "unorganized"
    if (!acc[collectionId]) {
      acc[collectionId] = []
    }
    acc[collectionId].push(entry)
    return acc
  }, {})

  console.log("Entries by Collection:", entriesByCollection)

  return (
    <div className="px-4 py-8 space-y-8">
      <section className="space-y-4">
        <MoodAnalytics />
      </section>

      <Collections
        collections={collections}
        entriesByCollection={entriesByCollection}
      />
    </div>
  )
}
