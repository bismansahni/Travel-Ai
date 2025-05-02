// import { SavedTrips } from "@/components/saved-trips"
// import { DashboardShell } from "@/components/dashboard-shell"

// export default function MyTripsPage() {
//   return (
//     <DashboardShell>
//       <SavedTrips />
//     </DashboardShell>
//   )
// }



import { Suspense } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { SavedTrips } from "@/components/saved-trips"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function MyTripsPage() {
  return (
    <DashboardShell>
      <Suspense fallback={
        <Card>
          <CardContent className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Loading your trips...</p>
            </div>
          </CardContent>
        </Card>
      }>
        <SavedTrips />
      </Suspense>
    </DashboardShell>
  )
}