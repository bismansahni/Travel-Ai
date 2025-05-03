

"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react"
import { format, isValid } from "date-fns"


function SavedTripsContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [savedTrips, setSavedTrips] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("day-1")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTrips = async () => {
      if (!email) return
      setIsLoading(true)
      try {
        const res = await fetch(`/api/get-trips?email=${encodeURIComponent(email)}`)
        const data = await res.json()
        console.log("Fetched trips:", data)
        if (data.trips) {
          setSavedTrips(data.trips)
        }
      } catch (error) {
        console.error("Failed to fetch trips", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTrips()
  }, [email])

  const filteredTrips = savedTrips.filter((trip) => trip.location.toLowerCase().includes(searchQuery.toLowerCase()))

  const fetchItineraryForTrip = async (tid: number) => {
    try {
      const res = await fetch(`/api/get-trip-results?tid=${tid}`);
      if (!res.ok) throw new Error("fetch failed");
      const { activities } = await res.json();
      return activities;
    } catch (e) {
      console.error("Cannot load itinerary:", e);
      return null;
    }
  };
  

  const calculateTripDuration = (startDate: string, endDate: string) => {
    const tripDuration = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    )
    return tripDuration
  }

  // const handleDeleteTrip = async (res.data[trips].tid: string) => {
  //   if (!email) {
  //     alert("Missing user email.")
  //     return
  //   }

  //   const confirmed = confirm(`Are you sure you want to delete your trip to ${location}?`)
  //   if (!confirmed) return

  //   try {
  //     const res = await fetch(
  //       `/api/delete-trip?email=${encodeURIComponent(email)}&destination=${encodeURIComponent(location)}`,
  //       { method: "DELETE" },
  //     )

  //     const data = await res.json()

  //     if (!res.ok) throw new Error(data.error || "Unknown error")

  //     setSavedTrips((prev) => prev.filter((trip) => trip.location !== location))
  //   } catch (error) {
  //     console.error("Delete failed:", error)
  //     alert("Failed to delete trip.")
  //   }
  // }



  const handleDeleteTrip = async (tid: number) => {
    if (!email) {
      alert("Missing user email.")
      return
    }
  
    const confirmed = confirm("Are you sure you want to delete this trip?")
    if (!confirmed) return
  
    try {
      const res = await fetch(
        `/api/delete-trip?email=${encodeURIComponent(email)}&tid=${tid}`,
        { method: "DELETE" }
      )
  
      const data = await res.json()
  
      if (!res.ok) throw new Error(data.error || "Unknown error")
  
      setSavedTrips((prev) => prev.filter((trip) => trip.tid !== tid))
    } catch (error) {
      console.error("Delete failed:", error)
      alert("Failed to delete trip.")
    }
  }
  

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">My Saved Trips</h1>
      </div>

      {filteredTrips.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip, index) => {
            const tripDuration = calculateTripDuration(trip.startdate, trip.enddate)
            const startDate = new Date(trip.startdate)
            const endDate = new Date(trip.enddate)

            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{trip.location}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {isValid(startDate) && isValid(endDate) ? (
                          <>
                            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                            <span className="text-muted-foreground"> · {tripDuration} days</span>
                          </>
                        ) : (
                          "Invalid dates"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{trip.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        ${trip.budget} <span className="text-muted-foreground">/ budget</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={async () => {
                      const itinerary = await fetchItineraryForTrip(trip.tid);
                      setSelectedTrip({ ...trip, itinerary });
                      setActiveTab("day-1");
                      setIsDialogOpen(true);
                    }}
                  >
                    View Itinerary
                  </Button>
                  {/* <Button variant="destructive" className="w-full" onClick={() => handleDeleteTrip(trip.location)}>
                    Delete
                  </Button> */}


<Button variant="destructive" className="w-full" onClick={() => handleDeleteTrip(trip.tid)}>
  Delete
</Button>

                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="flex h-[50vh] items-center justify-center rounded-lg border border-dashed">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold">No trips found</h2>
            <p className="mt-2 text-muted-foreground">
              {searchQuery
                ? `No trips matching "${searchQuery}" were found.`
                : "You haven't saved any trips yet. Plan a trip on the dashboard to get started."}
            </p>
            {searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            )}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          {selectedTrip && (
            <>
              <DialogHeader>
                <DialogTitle>Trip to {selectedTrip.location}</DialogTitle>
              </DialogHeader>
              <p className="text-muted-foreground text-sm mt-2">
                Duration: {calculateTripDuration(selectedTrip.startdate, selectedTrip.enddate)} days
              </p>

              {/* Itinerary Display */}
              <div className="mt-6">
                <Tabs defaultValue="day-1" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 flex flex-wrap">
                    {Array.from({ length: calculateTripDuration(selectedTrip.startdate, selectedTrip.enddate) }).map(
                      (_, i) => (
                        <TabsTrigger key={i} value={`day-${i + 1}`}>
                          Day {i + 1}
                        </TabsTrigger>
                      ),
                    )}
                  </TabsList>

                  {Array.from({ length: calculateTripDuration(selectedTrip.startdate, selectedTrip.enddate) }).map(
                    (_, i) => (
                      <TabsContent key={i} value={`day-${i + 1}`} className="space-y-4">
                        <h3 className="text-lg font-medium">Day {i + 1} Itinerary</h3>

                        { selectedTrip.itinerary && selectedTrip.itinerary[i] ? (
                          <div className="space-y-4">
                            {selectedTrip.itinerary[i].items.map((activity: any, actIndex: number) => (
                              <Card key={actIndex}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-medium">{activity.activity}</h4>
                                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                      <span className="text-sm">{activity.time}</span>
                                    </div>
                                  </div>
                                  {activity.location && (
                                    <div className="mt-2 flex items-center">
                                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                      <span className="text-sm">{activity.location}</span>
                                    </div>
                                  )}
                                  {activity.cost && (
                                    <div className="mt-2 flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                                      <span className="text-sm">${activity.cost}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No activities planned for this day.</p>
                        )}
                      </TabsContent>
                    ),
                  )}
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SavedTrips() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[50vh] items-center justify-center">
          <div className="animate-pulse text-center">
            <p>Loading your trips...</p>
          </div>
        </div>
      }
    >
      <SavedTripsContent />
    </Suspense>
  )
}
