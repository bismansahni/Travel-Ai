"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ItineraryType } from "./dashboard-page"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"

interface ItineraryDisplayProps {
  itinerary: ItineraryType
}

export function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const [activeTab, setActiveTab] = useState(`day-1`)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Itinerary</CardTitle>
        <CardDescription>Day-by-day plan for your trip to {itinerary.destination}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex w-full overflow-x-auto">
            {itinerary.activities.map((day) => (
              <TabsTrigger key={`day-${day.day}`} value={`day-${day.day}`} className="flex-shrink-0">
                Day {day.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {itinerary.activities.map((day) => (
            <TabsContent key={`day-${day.day}`} value={`day-${day.day}`} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Day {day.day}: {day.date}
                </h3>
              </div>

              <div className="space-y-4">
                {day.items.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="border-l-4 border-primary p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{item.activity}</h4>
                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{item.time}</span>
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
        </Tabs>
      </CardContent>
    </Card>
  )
}
