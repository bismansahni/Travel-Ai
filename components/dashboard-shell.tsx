"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {  Luggage, Router } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Plane } from "lucide-react"
import { useRouter,usePathname,useSearchParams } from "next/navigation"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
const email = searchParams.get("email")
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">TravelAI</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
        

    {pathname === "/my-trips" ? (
 <Button onClick={() => router.push(`/new-trip?email=${encodeURIComponent(email || "")}`)} variant="outline" size="sm">

    <Plane className="mr-2 h-4 w-4" />
    New Trip
  </Button>
) : (
  <Button onClick={() => router.push(`/my-trips?email=${encodeURIComponent(email || "")}`)} variant="outline" size="sm">
    <Luggage className="mr-2 h-4 w-4" />
    Old Trips
  </Button>
)}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}
