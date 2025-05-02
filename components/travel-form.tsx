// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { format } from "date-fns"
// import { CalendarIcon, Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Slider } from "@/components/ui/slider"
// import { Textarea } from "@/components/ui/textarea"
// import { cn } from "@/lib/utils"
// import { useSearchParams } from "next/navigation"


// const formSchema = z
//   .object({
//     destination: z.string().min(2, {
//       message: "Destination must be at least 2 characters.",
//     }),
//     startDate: z.date({
//       required_error: "A start date is required.",
//     }),
//     endDate: z.date({
//       required_error: "An end date is required.",
//     }),
//     budget: z.number().min(100, {
//       message: "Budget must be at least $100.",
//     }),
//     preferences: z.string().optional(),
//   })
//   .refine((data) => data.endDate > data.startDate, {
//     message: "End date must be after start date.",
//     path: ["endDate"],
//   })

// type FormValues = z.infer<typeof formSchema>

// interface TravelFormProps {
//   onSubmit: (values: FormValues) => void
//   isLoading: boolean
//   setIsLoading: (loading: boolean) => void
// }

// export function TravelForm({ onSubmit, isLoading, setIsLoading }: TravelFormProps) {

//   const searchParams = useSearchParams()
// const email = searchParams.get("email")


//   const [budget, setBudget] = useState(1000)

//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       destination: "",
//       budget: 1000,
//       preferences: "",
//     },
//   })





//   const handleSubmit = async (values: FormValues) => {
//     try {
//       setIsLoading(true) // ✅ Show loader immediately
  
//       const response = await fetch("/api/callGemini", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(values),
//       })
  
//       const result = await response.json()
//       console.log("AI Response:", result)
//       onSubmit(result)



//       const saveResponse = await fetch("/api/save-trip", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userEmail: email,
//           destination: values.destination,
//           startDate: values.startDate,
//           endDate: values.endDate,
//           budget: values.budget,
//           preferences: values.preferences,
//           itineraryData: result,
//         }),
        
//       })
  
//       const saveResult = await saveResponse.json()
//       console.log("Saved to DB:", saveResult)


//     } catch (err) {
//       console.error("Failed to call API:", err)
//     } finally {
//       setIsLoading(false) // ✅ Hide loader when done
//     }
//   }
  
  

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Plan Your Trip</CardTitle>
//         <CardDescription>Enter your travel details and our AI will create the perfect itinerary.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="destination"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Destination</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Paris, Tokyo, New York" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Start Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                           >
//                             {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="endDate"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>End Date</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                           >
//                             {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                             <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                       </PopoverContent>
//                     </Popover>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <FormField
//               control={form.control}
//               name="budget"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Budget (USD)</FormLabel>
//                   <FormControl>
//                     <div className="space-y-2">
//                       <Slider
//                         min={100}
//                         max={10000}
//                         step={100}
//                         value={[field.value]}
//                         onValueChange={(value) => {
//                           field.onChange(value[0])
//                           setBudget(value[0])
//                         }}
//                       />
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-muted-foreground">$100</span>
//                         <span className="font-medium">${budget}</span>
//                         <span className="text-sm text-muted-foreground">$10,000</span>
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="preferences"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Travel Preferences</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Tell us about your interests (e.g., food, culture, adventure, relaxation)"
//                       className="resize-none"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>This helps our AI create a more personalized itinerary.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Generating Itinerary...
//                 </>
//               ) : (
//                 "Generate Itinerary"
//               )}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }





"use client"

import { useState, Suspense } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

const formSchema = z
  .object({
    destination: z.string().min(2, {
      message: "Destination must be at least 2 characters.",
    }),
    startDate: z.date({
      required_error: "A start date is required.",
    }),
    endDate: z.date({
      required_error: "An end date is required.",
    }),
    budget: z.number().min(100, {
      message: "Budget must be at least $100.",
    }),
    preferences: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  })

type FormValues = z.infer<typeof formSchema>

interface TravelFormProps {
  onSubmit: (values: FormValues) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

function TravelFormContent({ onSubmit, isLoading, setIsLoading }: TravelFormProps) {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const [budget, setBudget] = useState(1000)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      budget: 1000,
      preferences: "",
    },
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/callGemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to generate itinerary")
      }

      const result = await response.json()
      onSubmit(result)

      if (email) {
        const saveResponse = await fetch("/api/save-trip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: email,
            destination: values.destination,
            startDate: values.startDate,
            endDate: values.endDate,
            budget: values.budget,
            preferences: values.preferences,
            itineraryData: result,
          }),
        })

        if (!saveResponse.ok) {
          throw new Error("Failed to save trip")
        }
        
        await saveResponse.json()
      }
    } catch (err) {
      console.error("Error:", err)
      // You might want to add error state handling here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
        <CardDescription>Enter your travel details and our AI will create the perfect itinerary.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paris, Tokyo, New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={field.value} 
                          onSelect={field.onChange} 
                          initialFocus 
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar 
                          mode="single" 
                          selected={field.value} 
                          onSelect={field.onChange} 
                          initialFocus 
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (USD)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={100}
                        max={10000}
                        step={100}
                        value={[field.value]}
                        onValueChange={(value) => {
                          field.onChange(value[0])
                          setBudget(value[0])
                        }}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">$100</span>
                        <span className="font-medium">${budget}</span>
                        <span className="text-sm text-muted-foreground">$10,000</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your interests (e.g., food, culture, adventure, relaxation)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>This helps our AI create a more personalized itinerary.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Itinerary...
                </>
              ) : (
                "Generate Itinerary"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export function TravelForm(props: TravelFormProps) {
  return (
    <Suspense fallback={
      <Card>
        <CardHeader>
          <CardTitle>Plan Your Trip</CardTitle>
          <CardDescription>Loading travel form...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    }>
      <TravelFormContent {...props} />
    </Suspense>
  )
}