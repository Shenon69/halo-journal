import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { BarLoader } from "react-spinners"

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <Link href={"/dashboard"} className="flex gap-2 items-center text-sm text-orange-600 hover:text-orange-700 cursor-pointer">
          <ArrowLeft /> <span>Back to Dashboard</span>
        </Link>
      </div>
      <Suspense fallback={<BarLoader color="orange" width={"100%"} />}>
        {children}
      </Suspense>
    </div>
  )
}
