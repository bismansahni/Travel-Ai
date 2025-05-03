
"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, MapPin, Search } from "lucide-react"
import { format, isValid } from "date-fns"
import { Input } from "@/components/ui/input"

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

  const filteredTrips = savedTrips.filter((trip) => trip.destination.toLowerCase().includes(searchQuery.toLowerCase()))

  const calculateTripDuration = (startDate: string, endDate: string) => {
    const tripDuration = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    )
    return tripDuration
  }

  const calculateTotalCost = (activities: any[]) => {
    let totalCost = 0
    activities.forEach((activity) => {
      activity.items.forEach((item: any) => {
        const cost = item.cost.replace("$", "")
        totalCost += Number.parseFloat(cost)
      })
    })
    return totalCost.toFixed(0)
  }

  const handleViewItinerary = (trip: any) => {
    setSelectedTrip(trip)
    setActiveTab(`day-1`) // Reset to first day
    setIsDialogOpen(true)
  }

  const formatTime = (timeString: string) => {
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":")
      const hour = Number.parseInt(hours)
      return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? "PM" : "AM"}`
    }
    return timeString
  }

  // const handleDeleteTrip = async (tripId: number) => {
  //   if (!email) {
  //     alert("Missing user email.");
  //     return;
  //   }
  
  //   const confirmed = confirm("Are you sure you want to delete this trip?");
  //   if (!confirmed) return;
  
  //   try {
  //     const res = await fetch(`/api/delete-trip?email=${encodeURIComponent(email)}&tripId=${tripId}`, {
  //       method: "DELETE",
  //     });
  
  //     const data = await res.json();
  
  //     if (!res.ok) throw new Error(data.error || "Unknown error");
  
  //     setSavedTrips((prev) => prev.filter((trip) => trip.tid !== tripId));
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //     alert("Failed to delete trip.");
  //   }
  // };
  



  const handleDeleteTrip = async (destination: string) => {
    if (!email) {
      alert("Missing user email.");
      return;
    }
  
    const confirmed = confirm(`Are you sure you want to delete your trip to ${destination}?`);
    if (!confirmed) return;
  
    try {
      const res = await fetch(
        `/api/delete-trip?email=${encodeURIComponent(email)}&destination=${encodeURIComponent(destination)}`,
        { method: "DELETE" }
      );
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.error || "Unknown error");
  
      setSavedTrips((prev) => prev.filter((trip) => trip.destination !== destination));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete trip.");
    }
  };
  

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
            const tripDuration = calculateTripDuration(trip.start_date, trip.end_date)
            const totalCost = calculateTotalCost(trip.data.activities)
            const startDate = new Date(trip.start_date)
            const endDate = new Date(trip.end_date)

            return (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{trip.destination}</CardTitle>
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
                      <span className="text-sm">{trip.destination}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        ${totalCost} <span className="text-muted-foreground">/ ${trip.budget} budget</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleViewItinerary(trip)}>
                    View Itinerary
                  </Button>
                  {/* <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDeleteTrip(trip.tid)}
                  >
                    Delete
                  </Button> */}



<Button
  variant="destructive"
  className="w-full"
  onClick={() => handleDeleteTrip(trip.destination)}
>
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
                <DialogTitle>Trip to {selectedTrip.destination}</DialogTitle>
              </DialogHeader>

              <div className="mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {format(new Date(selectedTrip.start_date), "MMM d")} -{" "}
                            {format(new Date(selectedTrip.end_date), "MMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {calculateTripDuration(selectedTrip.start_date, selectedTrip.end_date)} days
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium leading-none">{selectedTrip.destination}</p>
                          <p className="text-sm text-muted-foreground">Destination</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium leading-none">
                            ${calculateTotalCost(selectedTrip.data.activities)}
                          </p>
                          <p className="text-sm text-muted-foreground">Estimated cost</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 flex w-full overflow-x-auto">
                  {selectedTrip.data.activities.map((day: any) => (
                    <TabsTrigger key={`day-${day.day}`} value={`day-${day.day}`} className="flex-shrink-0">
                      Day {day.day}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
                  {selectedTrip.data.activities.map((day: any) => (
                    <TabsContent key={`day-${day.day}`} value={`day-${day.day}`} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Day {day.day}: {format(new Date(day.date), "EEEE, MMMM d, yyyy")}
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {day.items.map((item: any, index: number) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="border-l-4 border-primary p-4">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium">{item.activity}</h4>
                                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{formatTime(item.time)}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {item.cost}
                                </Badge>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function SavedTrips() {
  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Loading your trips...</p>
        </div>
      </div>
    }>
      <SavedTripsContent />
    </Suspense>
  )
}