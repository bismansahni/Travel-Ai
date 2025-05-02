import { SavedTrips } from "@/components/saved-trips"
import { DashboardShell } from "@/components/dashboard-shell"

export default function MyTripsPage() {
  return (
    <DashboardShell>
      <SavedTrips />
    </DashboardShell>
  )
}
