



"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { TravelForm } from "@/components/travel-form"
import { ItineraryDisplay } from "@/components/itinerary-display"
import { TripSummary } from "@/components/trip-summary"


export type ItineraryType = {
  destination: string
  activities: {
    day: number
    date: string
    items: {
      time: string
      activity: string
      cost: string
      description: string
    }[]
  }[]
}


export function DashboardPage() {
  const [itinerary, setItinerary] = useState<ItineraryType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerateItinerary = (result: ItineraryType) => {
    setItinerary(result)
  }

  return (
    <DashboardShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TravelForm onSubmit={handleGenerateItinerary} isLoading={isLoading}  setIsLoading={setIsLoading}  />
        </div>
        <div className="lg:col-span-2">
          {itinerary ? (
            <div className="space-y-6">
           
              <ItineraryDisplay itinerary={itinerary} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-semibold">Plan Your Dream Trip</h3>
                <p className="text-muted-foreground">
                  Fill out the form with your travel details, and our AI will create the perfect itinerary for you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
