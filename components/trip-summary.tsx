import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { Calendar, DollarSign, MapPin } from "lucide-react"
import type { ItineraryType } from "./dashboard-page"

interface TripSummaryProps {
  itinerary: ItineraryType
}

export function TripSummary({ itinerary }: TripSummaryProps) {
  const tripDuration = Math.ceil((itinerary.endDate.getTime() - itinerary.startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">
                {format(itinerary.startDate, "MMM d")} - {format(itinerary.endDate, "MMM d, yyyy")}
              </p>
              <p className="text-sm text-muted-foreground">{tripDuration} days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">{itinerary.destination}</p>
              <p className="text-sm text-muted-foreground">Destination</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium leading-none">${itinerary.totalCost}</p>
              <p className="text-sm text-muted-foreground">Estimated cost</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
